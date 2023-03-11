import { useConversationsStore } from '@/store/conversations'
import { MenuIcon, MessageIcon, PencilIcon, PlusIcon, TrashIcon } from './Icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState } from 'react'

export function Aside() {
  const [editConversationId, setEditConversationId] = useState(null)

  const addNewConversation = useConversationsStore(
    (state) => state.addNewConversation
  )
  const conversationsInfo = useConversationsStore(
    (state) => state.conversationsInfo
  )
  const removeConversation = useConversationsStore(
    (state) => state.removeConversation
  )
  const clearConversations = useConversationsStore(
    (state) => state.clearConversations
  )
  const selectConversation = useConversationsStore(
    (state) => state.selectConversation
  )

  const [animationParent] = useAutoAnimate()

  return (
    <>
      <div className='sticky top-0 z-10 flex items-center pt-1 pl-1 text-gray-200 bg-gray-800 border-b border-white/20 sm:pl-3 md:hidden'>
        <button
          type='button'
          className='-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white'
        >
          <span className='sr-only'>Open sidebar</span>
          <MenuIcon />
        </button>
        <h1 className='flex-1 text-base font-normal text-center'>New chat</h1>
        <button onClick={addNewConversation} type='button' className='px-3'>
          <PlusIcon />
        </button>
      </div>

      <aside className='fixed z-10 flex flex-col w-64 h-screen transition -translate-x-full md:transition-none lg:translate-x-0 bg-gptdarkgray'>
        <nav className='flex flex-col flex-1 h-full p-2 space-y-1'>
          <button onClick={addNewConversation} className='flex items-center flex-shrink-0 gap-3 px-3 py-3 mb-2 text-sm text-white transition-colors duration-200 border rounded-md cursor-pointer hover:bg-gray-500/10 border-white/20'>
            <PlusIcon />
            New chat
          </button>

          <div className='flex-col flex-1 overflow-y-auto border-b border-white/20'>
            <div
              ref={animationParent}
              className='flex flex-col gap-2 text-sm text-gray-100'
            >
              {Object.entries(conversationsInfo).map(
                ([key, conversationInfo]) => {
                  const isEditing = editConversationId === key
                  const Element = isEditing ? 'a' : 'div'
                  const ElementText = isEditing ? 'input' : 'div'

                  return (
                    <Element
                      key={key}
                      onClick={() => selectConversation({ id: key })}
                      className='relative flex items-center gap-3 px-3 py-3 break-all bg-gray-800 rounded-md cursor-pointer pr-14 hover:bg-gray-800 group'
                    >
                      <MessageIcon />
                      <ElementText className='relative flex-1 overflow-hidden break-all text-ellipsis max-h-5'>
                        {conversationInfo.name}
                        <div className='absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-800' />
                      </ElementText>

                      <div className='absolute z-10 flex visible text-gray-300 right-1'>
                        <button onClick={() => setEditConversationId(key)} className='p-1 hover:text-white'>
                          <PencilIcon />
                        </button>

                        <button
                          onClick={() => removeConversation({ id: key })}
                          className='p-1 hover:text-white'
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </Element>
                  )
                }
              )}
            </div>
          </div>
          <button
            onClick={clearConversations}
            className='flex items-center gap-3 px-3 py-3 text-sm text-white transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-500/10'
          >
            <TrashIcon />
            Clear conversations
          </button>
        </nav>
      </aside>
    </>
  )
}
