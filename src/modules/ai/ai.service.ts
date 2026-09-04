let openaiClient: any = null

const isAiEnabled = () =>
  process.env.AI_ENABLED === 'true' && !!process.env.OPENAI_API_KEY

const getOpenAI = async () => {
  if (!isAiEnabled()) return null
  if (openaiClient) return openaiClient
  try {
    const OpenAI = (await import('openai')).default
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return openaiClient
  } catch {
    return null
  }
}

export class AiService {
  async classify(body: { text?: string; subject?: string; body?: string }) {
    const text = body.text || `${body.subject || ''}\n${body.body || ''}`.trim()
    const client = await getOpenAI()
    if (!client) {
      return {
        category: 'general',
        priority: 'medium',
        confidence: 0.5,
        stub: true,
        message: 'AI classify stub (AI disabled or no API key)',
      }
    }
    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Classify the support ticket. Reply JSON: {"category":string,"priority":"low|medium|high","confidence":number}',
          },
          { role: 'user', content: text || 'empty' },
        ],
        response_format: { type: 'json_object' },
      })
      const raw = completion.choices?.[0]?.message?.content || '{}'
      const parsed = JSON.parse(raw)
      return { ...parsed, stub: false, message: 'Ticket classified successfully' }
    } catch (err: any) {
      return {
        category: 'general',
        priority: 'medium',
        confidence: 0,
        stub: true,
        error: err?.message,
        message: 'AI classify fallback',
      }
    }
  }

  async suggestions(body: { text?: string; subject?: string }) {
    const text = body.text || body.subject || ''
    const client = await getOpenAI()
    if (!client) {
      return {
        suggestions: [
          'Thank you for contacting support. We are looking into this.',
          'Could you please provide more details about the issue?',
        ],
        stub: true,
        message: 'AI suggestions stub',
      }
    }
    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Suggest 3 short support reply templates as JSON {"suggestions":string[]}',
          },
          { role: 'user', content: text || 'generic support request' },
        ],
        response_format: { type: 'json_object' },
      })
      const raw = completion.choices?.[0]?.message?.content || '{}'
      const parsed = JSON.parse(raw)
      return { ...parsed, stub: false, message: 'Suggestions generated successfully' }
    } catch (err: any) {
      return {
        suggestions: [],
        stub: true,
        error: err?.message,
        message: 'AI suggestions fallback',
      }
    }
  }

  async sentiment(body: { text?: string }) {
    const text = body.text || ''
    const client = await getOpenAI()
    if (!client) {
      return {
        sentiment: 'neutral',
        score: 0,
        stub: true,
        message: 'AI sentiment stub',
      }
    }
    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Analyze sentiment. Reply JSON: {"sentiment":"positive|neutral|negative","score":number}',
          },
          { role: 'user', content: text || 'empty' },
        ],
        response_format: { type: 'json_object' },
      })
      const raw = completion.choices?.[0]?.message?.content || '{}'
      const parsed = JSON.parse(raw)
      return { ...parsed, stub: false, message: 'Sentiment analyzed successfully' }
    } catch (err: any) {
      return {
        sentiment: 'neutral',
        score: 0,
        stub: true,
        error: err?.message,
        message: 'AI sentiment fallback',
      }
    }
  }

  status() {
    return {
      enabled: isAiEnabled(),
      provider: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      message: 'AI status fetched successfully',
    }
  }

  analytics() {
    return {
      requestsToday: 0,
      classifyCount: 0,
      suggestionCount: 0,
      sentimentCount: 0,
      stub: true,
      message: 'AI analytics stub',
    }
  }

  settings(body: any = {}) {
    return {
      settings: {
        enabled: body.enabled ?? process.env.AI_ENABLED === 'true',
        model: body.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        ...body,
      },
      message: 'AI settings updated (runtime stub)',
    }
  }
}
