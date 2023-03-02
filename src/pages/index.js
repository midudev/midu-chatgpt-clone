import { Banner } from '@/components/Banner'
import { ChatForm } from '@/components/CreatePrompt'
import { Layout } from '@/components/Layout'
import { Message } from '@/components/Message'
import { Welcome } from '@/components/Welcome'
import { useConversationsStore } from '@/store/conversations.js'

function Chat() {
  const selectedConversation = useConversationsStore(
    (state) => state.selectedConversation
  )
  const messages = useConversationsStore((state) => {
    const { selectedConversation } = state
    return state.conversationsMessages[selectedConversation]
  })

  const renderContent = () => {
    if (!selectedConversation) return <Welcome />
    return messages?.map((entry) => <Message key={entry.id} {...entry} />)
  }

  return (
    <div className='flex flex-col flex-1 h-full pl-64'>
      <main>{renderContent()}</main>
      <ChatForm />
    </div>
  )
}

export default function Home() {
  return (
    <Layout>
      <Banner />
      <Chat />
    </Layout>
  )
}
