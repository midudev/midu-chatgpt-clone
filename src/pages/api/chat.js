import { decompress } from 'lz-ts'

const { OPENAI_API_KEY } = process.env

const date = new Date()
const currentDate = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`

const INITIAL_ROLE_MESSAGE = {
  role: 'system',
  content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date is: ${currentDate}.`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { prompt, conversation } = req.query

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  let previousConversation = []
  try {
    const decompressedConversation = decompress(conversation)
    let parsedConversation = {}
    try {
      parsedConversation = JSON.parse(decompressedConversation)
    } catch (e) {
      console.error('Problems parsing', decompressedConversation)
      return res.status(400).json({ error: 'Error parsing' })
    }

    previousConversation = parsedConversation
      .map((entry) => {
        const role = entry.ia ? 'assistant' : 'user'

        // ignore messages without content
        if (!entry.message) return null

        return {
          role,
          content: entry.message
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error(error)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0301',
        stream: true,
        messages: [
          INITIAL_ROLE_MESSAGE,
          ...previousConversation,
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      console.error(response.statusText)
      return res.status(500).json({ error: 'OpenAI API error' })
    }

    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream;charset=utf-8'
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        res.end('data: [DONE]\n\n')
        break
      }

      const text = decoder.decode(value)
      const data = text
        .split('\n')
        .filter(Boolean)
        .map((line) => line.trim().replace('data: ', '').trim())

      for (const line of data) {
        if (line === '[DONE]') {
          res.end('data: [DONE]\n\n')
          break
        }

        let content = ''
        try {
          const json = JSON.parse(line)
          content = json?.choices[0]?.delta?.content ?? ''
        } catch (e) {
          console.error('No se pudo parsear la línea', line)
          console.error(e)
        }

        console.log('----------------')
        console.log({ content })
        res.write(`data: ${JSON.stringify(content)}\n\n`)
        res.flush()
      }
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e })
  }
}
