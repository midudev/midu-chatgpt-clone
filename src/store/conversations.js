import { compress } from 'lz-ts'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useConversationsStore = create(
  persist(
    (set, get) => ({
      loading: false,
      conversationsMessages: {},
      conversationsInfo: {},
      selectedConversation: null,
      selectConversation: ({ id }) => {
        set(() => ({ selectedConversation: id }))
      },
      clearConversations: () => {
        set(() => ({
          loading: false,
          conversationsMessages: {},
          conversationsInfo: {},
          selectedConversation: null
        }))
      },
      removeConversation: async ({ id }) => {
        const newSelectedConversation =
          get().selectedConversation === id ? null : get().selectedConversation

        set((state) => {
          const { [id]: _, ...conversationsMessages } =
            state.conversationsMessages
          const { [id]: __, ...conversationsInfo } = state.conversationsInfo

          return {
            selectedConversation: newSelectedConversation,
            conversationsMessages,
            conversationsInfo
          }
        })
      },
      addNewConversation: async () => {
        const selectedConversation = crypto.randomUUID()

        set((state) => ({
          loading: false,
          selectedConversation,
          conversationsMessages: {
            ...state.conversationsMessages,
            [selectedConversation]: []
          },
          conversationsInfo: {
            ...state.conversationsInfo,
            [selectedConversation]: {
              id: selectedConversation,
              name: 'New conversation'
            }
          }
        }))
      },
      sendPrompt: async ({ prompt }) => {
        let selectedConversation = get().selectedConversation
        const userMessageID = crypto.randomUUID()
        const IAMessageID = crypto.randomUUID()

        const partialNewConversation = [
          {
            id: userMessageID,
            ia: false,
            message: prompt
          },
          {
            id: IAMessageID,
            ia: true,
            message: ''
          }
        ]

        let fullConversation = partialNewConversation

        if (!selectedConversation) {
          selectedConversation = crypto.randomUUID()

          set((state) => ({
            loading: true,
            selectedConversation,
            conversationsMessages: {
              ...state.conversationsMessages,
              [selectedConversation]: partialNewConversation
            },
            conversationsInfo: {
              ...state.conversationsInfo,
              [selectedConversation]: {
                id: selectedConversation,
                name: 'New conversation'
              }
            }
          }))
        } else {
          set((state) => {
            fullConversation = [
              ...state.conversationsMessages[selectedConversation],
              ...partialNewConversation
            ]

            return {
              loading: true,
              conversationsMessages: {
                ...state.conversationsMessages,
                [selectedConversation]: fullConversation
              }
            }
          })
        }

        const compressedConversation = compress(
          JSON.stringify(fullConversation)
        )

        try {
          const eventSource = new EventSource(
            '/api/chat?prompt=' +
              prompt +
              '&conversation=' +
              compressedConversation
          )
          let message = ''

          eventSource.onerror = () => {
            set((state) => {
              return {
                loading: false,
                conversationsMessages: {
                  ...state.conversationsMessages,
                  [selectedConversation]: state.conversationsMessages[
                    selectedConversation
                  ].map((entry) => {
                    if (entry.id === IAMessageID) {
                      return {
                        ...entry,
                        error: true,
                        message
                      }
                    }
                    return entry
                  })
                }
              }
            })
          }

          eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
              set(() => ({ loading: false }))

              eventSource.close()
              return
            }

            message += JSON.parse(event.data)

            // Actualizar el mensaje de la IA
            // que tenía el mensaje vacio,
            // con el texto completo
            set((state) => {
              return {
                conversationsMessages: {
                  ...state.conversationsMessages,
                  [selectedConversation]: state.conversationsMessages[
                    selectedConversation
                  ].map((entry) => {
                    if (entry.id === IAMessageID) {
                      return {
                        ...entry,
                        message
                      }
                    }
                    return entry
                  })
                }
              }
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }),
    {
      name: 'conversations',
      storage: createJSONStorage(() => ({
        // Returning a promise from getItem is necessary to avoid issues with hydration
        getItem: async (name) =>
          new Promise((resolve) =>
            setTimeout(() => {
              const isServer = typeof window === 'undefined'
              if (isServer) return

              const value = localStorage?.getItem(name)
              resolve(value)
            }, 100)
          ),
        setItem: (name, value) => localStorage?.setItem(name, value),
        removeItem: (name) => localStorage?.removeItem(name)
      }))
    }
  )
)

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useConversationsStore)
}
