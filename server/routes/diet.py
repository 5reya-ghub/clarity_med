from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq_client import groq_chat, parse_json

router = APIRouter()

SYSTEM_PROMPT = """You are ClarityMed's clinical nutritionist AI. Based on the patient's medical report findings, create a personalised, practical diet plan with specific meal suggestions.

Return ONLY a valid JSON object with this exact structure:
{
  "headline": "One-line diet summary tailored to this patient (e.g. Heart-healthy, low-glycaemic plan)",
  "rationale": "2-3 sentences explaining why this diet suits their specific results",
  "dailyMeals": {
    "breakfast": [
      { "item": "Food item name", "reason": "Why it helps this patient results" }
    ],
    "lunch": [
      { "item": "Food item name", "reason": "Why it helps" }
    ],
    "dinner": [
      { "item": "Food item name", "reason": "Why it helps" }
    ],
    "snacks": [
      { "item": "Snack item name", "reason": "Why it helps" }
    ]
  },
  "foodsToEat": [
    { "food": "Food name", "benefit": "Specific benefit for this patient condition" }
  ],
  "foodsToAvoid": [
    { "food": "Food name", "reason": "Why harmful given their results" }
  ],
  "hydration": "Specific hydration advice based on their findings",
  "weeklyMealIdea": "One practical weekly meal prep idea suited to their condition"
}

Base every recommendation strictly on the lab findings. Be specific, not generic. Include 3-4 items per meal, 5-6 foods to eat, 4-5 foods to avoid."""


class DietRequest(BaseModel):
    reportData: dict


@router.post("/generate")
async def generate_diet(body: DietRequest):
    report = body.reportData
    if not report:
        raise HTTPException(status_code=400, detail="reportData is required")

    findings_summary = "\n".join(
        f"{f.get('test', '')}{' (' + f['abbreviation'] + ')' if f.get('abbreviation') else ''}: "
        f"{f.get('value', '')} [Range: {f.get('referenceRange', '')}] — {f.get('severity', '')}"
        for f in report.get("findings", [])
    )

    raw = await groq_chat(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Patient lab findings:\n{findings_summary}\n\n"
                    f"Report type: {report.get('reportType', 'Medical Report')}\n"
                    f"Summary: {report.get('summary', '')}"
                ),
            },
        ],
        max_tokens=3000,
    )
    return parse_json(raw)
