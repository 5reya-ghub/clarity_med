let currentUtterance = null

export function speak(text, { onStart, onEnd, onError } = {}) {
  if (!window.speechSynthesis) { onError?.('TTS not supported'); return }
  stopSpeaking()
  const clean = text.replace(/[•●■]/g, '').replace(/\s+/g, ' ').trim()
  currentUtterance = new SpeechSynthesisUtterance(clean)
  currentUtterance.rate = 0.92; currentUtterance.pitch = 1.0; currentUtterance.volume = 1.0
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen'))) || voices.find(v => v.lang.startsWith('en'))
  if (preferred) currentUtterance.voice = preferred
  currentUtterance.onstart = onStart
  currentUtterance.onend = onEnd
  currentUtterance.onerror = (e) => onError?.(e.error)
  window.speechSynthesis.speak(currentUtterance)
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
  currentUtterance = null
}

export function isSpeaking() {
  return window.speechSynthesis?.speaking ?? false
}
