// Aquí añade tu API_KEY, porque esta no funcionará
// const OPENAI_API_KEY = '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'
import * as https from 'https'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' })
  try {
    res.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream'
    })
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
    const request = https.request(options, function (response) {
      response.on('data', async (chunk) => {
        if (!chunk.toString().includes('data: [DONE]')) {
          const decoder = new TextDecoder('utf-8')
          const text = decoder.decode(chunk)
          const data = JSON.parse(text.replace('data: ', ''))
          // console.log(data)
          const chatgptMsg = data.choices[0].text
          res.write(`data: ${chatgptMsg}\n\n`)
          res.flush()
        }
      })
      response.on('error', (e) => {
        console.error(`problem with request: ${e.message}`)
      })
      response.on('end', () => {
        res.end()
      })
    })
    const body = JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Responde como si fueras la inteligencia artificial conversacional ChatGPT. El usuario te escribe un prompt y tú debes contestar de forma natural. El prompt es:\n\n${prompt}`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true
    })
    request.write(body)
    request.end()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e })
  }
}
