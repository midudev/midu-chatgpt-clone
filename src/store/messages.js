import { create } from 'zustand'
import { fetchEventSource } from '@waylaidwanderer/fetch-event-source'

export const useMessageStore = create((set, get) => ({
  messages: [],
  sendPrompt: async ({ prompt }) => {
    const messageIAid = get().messages.length + 1
    // actualizar el estado de los mensajes
    // con el mensaje del usuario y crear
    // un mensaje de la IA vacio
    // mientras hacemos el fetching de datos
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: state.messages.length,
          ia: false,
          message: prompt
        },
        {
          id: state.messages.length + 1,
          ia: true,
          message: ''
        }
      ]
    }))

    // Fetching de datos
    const controller = new AbortController()
    try {
      let done = false
      await fetchEventSource('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt }),
        bodyTimeout: 0,
        headersTimeout: 0,
        signal: controller.signal,
        async onopen(response) {
          if (response.status === 200) {
            return
          }
          let error
          try {
            const body = await response.text()
            error = new Error(`Failed to send message. HTTP ${response.status} - ${body}`)
            error.status = response.status
            error.json = JSON.parse(body)
          } catch {
            error = error || new Error(`Failed to send message. HTTP ${response.status}`)
          }
          throw error
        },
        onclose() {
          if (!done) {
            controller.abort()
          }
        },
        onerror(err) {
          throw err
        },
        onmessage(msg) {
          if (!msg.data) {
            return
          }
          if (msg.data === '[DONE]') {
            controller.abort()
            done = true
          }
          set((state) => ({
            messages: state.messages.map((entry) => {
              if (entry.id === messageIAid) {
                return {
                  ...entry,
                  message: get().messages[messageIAid].message + msg.data.replace('data: ', '')
                }
              }
              return entry
            })
          }))
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}))
