export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { history, voiceName, lang } = req.body

  if (!history || !lang) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const histText = history
    .map(h => `${h.role === 'assistant' ? voiceName : 'Пользователь'}: ${h.content}`)
    .join('\n\n')

  const system = `Аналитик архетипической психологии. Создай Цифровой слепок на основе диалога с Тенью.
Формат строго:
##RESOURCE##
[2-3 предложения: скрытый ресурс который проявился в диалоге]
##BLOCK##
[2-3 предложения: системный блок — паттерн который мешает]
##GROWTH##
[1 конкретное действие или практика на ближайшие 7 дней]
Язык: ${lang === 'RU' ? 'русский' : lang === 'KZ' ? 'казахский' : 'English'}.
Стиль: премиальный психоанализ, без воды, конкретно.`

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
        max_tokens: 500,
        system,
        messages: [{ role: 'user', content: `Диалог:\n${histText}` }]
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
