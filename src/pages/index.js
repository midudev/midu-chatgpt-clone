import { ChatForm } from '@/components/CreatePrompt'
import { Layout } from '@/components/Layout'
import { Message } from '@/components/Message'
import { Welcome } from '@/components/Welcome'
import { useConversationsStore } from '@/store/conversations.js'
import { useAutoAnimate } from '@formkit/auto-animate/react'

function Chat() {
  const selectedConversation = useConversationsStore(
    (state) => state.selectedConversation
  )
  const messages = useConversationsStore((state) => {
    const { selectedConversation } = state
    return state.conversationsMessages[selectedConversation]
  })
  const [animationParent] = useAutoAnimate()

  const renderContent = () => {
    if (!selectedConversation) return <Welcome />
    return (
      <div className='flex-1 overflow-hidden'>
        <div className='h-full overflow-auto'>
          {messages?.map((entry) => (
            <Message key={entry.id} {...entry} />
          ))}
          <div className='flex-shrink-0 w-full h-32 md:h-48 bg-gptgray' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col flex-1 h-full lg:pl-64'>
      <main className='relative w-full' ref={animationParent}>
        {renderContent()}
        <ChatForm />
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Layout>
      <Chat />
    </Layout>
  )
}
