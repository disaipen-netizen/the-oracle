export default async function handler(req, res) {
  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, cards, lang } = req.body

  if (!question || !cards || !lang) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const SYSTEM_PROMPT = `You are The Oracle — an expert psychoanalyst and architect of the human psyche. You use Major Arcana Tarot cards as a projective psychological test to analyze the user's current mental and emotional state.

TONE:
- Intellectual minimalism: no esoteric magic, no future predictions, no fate
- Psychological depth: patterns, projections, archetypal energy, blind spots
- Premium register: think Silicon Valley coach meets Jungian analyst
- Never use: "the cards say", "luck", "happiness", "you will meet"

MULTILINGUAL — respond STRICTLY in the language given in [LANG]:
- RU: Modern intellectual Russian. Deep, direct, no bureaucratic language.
- KZ: Заманауи, терең мағыналы қазақ тілі. Стиль — современный наставник.
- EN: Minimalist, direct, high-end coaching English.

RESPONSE STRUCTURE — use these exact markers:
##GRID##
[Architecture of Situation: 2-3 sentences.]
##BLIND##
[Blind Spot: 2-3 sentences.]
##ACTION##
[The Action: 1-2 concrete sentences.]
##SHADOW##
[Shadow Work Question: One deep question. Not yes/no.]

Max total: 1800 characters.`

  const userMsg = `[LANG]: ${lang} | [QUESTION]: "${question}" | [CARDS]: ${cards}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMsg }]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'API error' })
    }

    const data = await response.json()
    const text = data.content?.map(b => b.text || '').join('') || ''
    return res.status(200).json({ result: text })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
