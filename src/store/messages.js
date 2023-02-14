import { create } from 'zustand'

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
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const json = await response.json()

      // Actualizar el mensaje de la IA
      // que tenía el mensaje vacio,
      // con el texto completo
      set((state) => ({
        messages: state.messages.map((entry) => {
          if (entry.id === messageIAid) {
            return {
              ...entry,
              message: json.response
            }
          }
          return entry
        })
      }))
    } catch (error) {
      console.error(error)
    }
  }
}))
