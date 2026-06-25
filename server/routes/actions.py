from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq_client import groq_chat, parse_json

router = APIRouter()

SYSTEM_PROMPT = """You are ClarityMed's patient care coordinator AI. Based on the patient's lab results, generate a clear prioritised action plan covering doctor visits, exercises, lifestyle changes, and follow-up tests.

Return ONLY a valid JSON object with this exact structure:
{
  "urgencyLevel": "Immediate|Soon|Routine",
  "urgencyReason": "One sentence explaining the overall urgency level",
  "actions": [
    {
      "id": "unique_id",
      "category": "Doctor Visit|Exercise|Lifestyle|Follow-up Test|Medication Review|Mental Health",
      "priority": "High|Medium|Low",
      "title": "Short action title",
      "description": "Clear 2-3 sentence instruction the patient can act on immediately",
      "timeframe": "e.g. Within 48 hours | This week | Within 1 month | Ongoing",
      "relatedFindings": ["test name 1", "test name 2"],
      "icon": "stethoscope|dumbbell|heart|flask|pill|brain|walk|sun|moon|apple"
    }
  ],
  "exercisePlan": {
    "weeklyGoal": "e.g. 150 minutes moderate activity per week",
    "recommended": [
      {
        "exercise": "Exercise name",
        "duration": "e.g. 30 min",
        "frequency": "e.g. 5x per week",
        "reason": "Why this exercise helps their specific results"
      }
    ],
    "toAvoid": [
      { "exercise": "Exercise name", "reason": "Why to avoid given their findings" }
    ]
  },
  "followUpSchedule": [
    { "test": "Test name", "when": "Timeframe", "reason": "Why this retest is needed" }
  ],
  "warningSignsToWatch": [
    "Specific symptom or sign to watch for, directly linked to their findings"
  ]
}

Generate 5-8 actions sorted by priority. Include at least 3 exercises in recommended. Be specific to this patient's actual findings."""


class ActionsRequest(BaseModel):
    reportData: dict


@router.post("/generate")
async def generate_actions(body: ActionsRequest):
    report = body.reportData
    if not report:
        raise HTTPException(status_code=400, detail="reportData is required")

    findings_summary = "\n".join(
        f"{f.get('test', '')}{' (' + f['abbreviation'] + ')' if f.get('abbreviation') else ''}: "
        f"{f.get('value', '')} [Range: {f.get('referenceRange', '')}] — {f.get('severity', '')}. "
        f"{f.get('plainExplanation', '')}"
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
                    f"Overall summary: {report.get('summary', '')}"
                ),
            },
        ],
        max_tokens=3000,
    )
    return parse_json(raw)
