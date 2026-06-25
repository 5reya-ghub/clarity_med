export async function generateReportPDF(reportData) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const MARGIN = 18
  const TEXT_WIDTH = W - MARGIN * 2
  let y = 20

  const addText = (text, x, fontSize = 10, style = 'normal', color = [30, 30, 30]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, TEXT_WIDTH - (x - MARGIN))
    doc.text(lines, x, y)
    y += lines.length * (fontSize * 0.4) + 2
  }

  const checkPage = (needed = 20) => {
    if (y + needed > 280) { doc.addPage(); y = 20 }
  }

  // Header
  doc.setFillColor(21, 112, 245)
  doc.rect(0, 0, W, 28, 'F')
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255)
  doc.text('ClarityMed', MARGIN, 13)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal')
  doc.text('Simplified Medical Report', MARGIN, 21)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, W - MARGIN, 21, { align: 'right' })
  y = 36

  if (reportData.reportType) { addText(reportData.reportType, MARGIN, 14, 'bold', [21, 112, 245]); y += 1 }
  if (reportData.patientName) addText(`Patient: ${reportData.patientName}`, MARGIN, 10, 'normal', [80, 80, 80])
  if (reportData.reportDate) addText(`Report Date: ${reportData.reportDate}`, MARGIN, 10, 'normal', [80, 80, 80])

  y += 4
  doc.setDrawColor(220, 220, 220); doc.line(MARGIN, y, W - MARGIN, y); y += 6
  addText('Summary', MARGIN, 13, 'bold', [30, 30, 30]); y += 1
  addText(reportData.summary, MARGIN, 10, 'normal', [60, 60, 60]); y += 6
  doc.line(MARGIN, y, W - MARGIN, y); y += 6
  addText('Your Results', MARGIN, 13, 'bold', [30, 30, 30]); y += 3

  const sev = {
    Normal: { bg: [236, 253, 245], text: [6, 95, 70], label: '● Normal' },
    Watch:  { bg: [255, 251, 235], text: [120, 53, 15], label: '▲ Watch' },
    Urgent: { bg: [255, 241, 242], text: [136, 19, 55], label: '! Urgent' },
  }

  for (const f of reportData.findings) {
    checkPage(45)
    const sc = sev[f.severity] || sev.Normal
    doc.setFillColor(...sc.bg)
    doc.roundedRect(MARGIN - 2, y - 2, TEXT_WIDTH + 4, 1, 2, 2, 'F')
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30)
    doc.text(f.test + (f.abbreviation ? ` (${f.abbreviation})` : ''), MARGIN, y + 4)
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sc.text)
    doc.text(sc.label, W - MARGIN, y + 4, { align: 'right' })
    y += 9
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
    doc.text(`Value: ${f.value}   |   Reference: ${f.referenceRange}`, MARGIN, y); y += 6
    if (f.plainExplanation) {
      const lines = doc.splitTextToSize(f.plainExplanation, TEXT_WIDTH)
      doc.setTextColor(70, 70, 70); doc.text(lines, MARGIN, y)
      y += lines.length * 4 + 2
    }
    if (f.suggestedQuestion) {
      doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(21, 112, 245)
      const q = doc.splitTextToSize(`Ask your doctor: "${f.suggestedQuestion}"`, TEXT_WIDTH)
      doc.text(q, MARGIN, y); y += q.length * 4 + 2
    }
    y += 5
  }

  checkPage(20)
  doc.line(MARGIN, y, W - MARGIN, y); y += 5
  doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(130, 130, 130)
  const d = doc.splitTextToSize('ClarityMed is an informational tool and does not constitute medical advice. Always consult a qualified healthcare professional.', TEXT_WIDTH)
  doc.text(d, MARGIN, y)
  doc.save('ClarityMed-Report.pdf')
}
