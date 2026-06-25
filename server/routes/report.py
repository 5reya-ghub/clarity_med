from fastapi import APIRouter
from pydantic import BaseModel
from groq_client import groq_chat, parse_json

router = APIRouter()

SYSTEM_PROMPT = """You are ClarityMed, an expert medical communicator. Transform complex medical lab reports into clear, compassionate plain-language summaries any patient can understand.

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "3-sentence plain-English overview of the most important findings",
  "patientName": "extracted name or null",
  "reportDate": "extracted date or null",
  "reportType": "type of report (e.g. Complete Blood Count, Lipid Panel)",
  "findings": [
    {
      "id": "unique_id_string",
      "test": "Test name",
      "abbreviation": "Abbreviation if any (e.g. HbA1c)",
      "abbreviationMeaning": "Full meaning of abbreviation",
      "value": "Patient value with units",
      "referenceRange": "Normal range",
      "severity": "Normal|Watch|Urgent",
      "plainExplanation": "2-3 sentences a patient can understand",
      "whatItMeans": "What this result means for the patient health",
      "suggestedQuestion": "A question the patient could ask their doctor"
    }
  ]
}

Severity rules:
- Normal: value within reference range
- Watch: mildly outside range, warrants monitoring
- Urgent: significantly outside range, requires prompt attention

Be compassionate, avoid alarm, always encourage consulting a doctor."""


class SimplifyRequest(BaseModel):
    reportText: str


@router.post("/simplify")
async def simplify_report(body: SimplifyRequest):
    if not body.reportText.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="reportText is required")

    raw = await groq_chat(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Simplify this medical report:\n\n{body.reportText}"},
        ],
        max_tokens=4096,
    )
    return parse_json(raw)
