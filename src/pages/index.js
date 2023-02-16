import { Avatar } from '@/components/Avatar.jsx'
import { ChatGPTLogo, PlusIcon, SendIcon } from '@/components/Icons.jsx'
import { TypingEffect } from '@/components/TypingEffect.jsx'
import { useMessageStore } from '@/store/messages.js'
import Head from 'next/head'
import { useRef } from 'react'

function Layout({ children }) {
  return (
    <>
      <Head>
        <title>midu Chat GPT</title>
      </Head>
      <div className='relative flex w-full h-screen bg-gptgray'>
        <Aside />
        {children}
      </div>
    </>
  )
}

function Aside() {
  return (
    <aside className='fixed z-10 flex w-64 h-screen -translate-x-full md:transform-none md:relative shrink-0 bg-gptdarkgray'>
      <nav className='flex flex-col flex-1 h-full p-2 space-y-1'>
        <button className='flex items-center flex-shrink-0 gap-3 px-3 py-3 mb-2 text-sm text-white transition-colors duration-200 border rounded-md cursor-pointer hover:bg-gray-500/10 border-white/20'>
          <PlusIcon />
          New chat
        </button>
      </nav>
    </aside>
  )
}

function UserAvatar() {
  return (
    <img
      alt='Foto de midu'
      src='https://pbs.twimg.com/profile_images/1613612257015128065/oA0Is67J_400x400.jpg'
    />
  )
}

function Message({ ia, message }) {
  const avatar = ia ? <ChatGPTLogo /> : <UserAvatar />
  const textElement = ia ? <TypingEffect text={message} /> : message

  return (
    <div className={`text-gray-100 ${ia ? 'bg-gptlightgray' : 'bg-gptgray'}`}>
      <article className='flex max-w-3xl gap-4 p-6 m-auto'>
        <Avatar>{avatar}</Avatar>

        <div className='min-h-[20px] flex flex-1 flex-col items-start gap-4 whitespace-pre-wrap'>
          <div className='w-full break-words prose-invert'>
            <p>{textElement}</p>
          </div>
        </div>
      </article>
    </div>
  )
}

function Chat() {
  const messages = useMessageStore((state) => state.messages)

  return (
    <div className='flex flex-col w-full h-full'>
      <main className='flex-1 overflow-y-auto'>
        {messages.map((entry) => (
          <Message key={entry.id} {...entry} />
        ))}
      </main>
      <ChatForm />
    </div>
  )
}

function ChatForm() {
  const sendPrompt = useMessageStore((state) => state.sendPrompt)
  const textAreaRef = useRef()

  const handleSubmit = (event) => {
    event?.preventDefault()
    const { value } = textAreaRef.current
    console.log({ value })
    sendPrompt({ prompt: value })
    textAreaRef.current.value = ''
  }

  const handleChange = () => {
    const el = textAreaRef.current

    el.style.height = '0px'
    const scrollHeight = el.scrollHeight
    el.style.height = scrollHeight + 'px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className='w-full px-2 shrink-0'>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className='flex flex-row max-w-3xl pt-6 m-auto mb-6'
      >
        <div className='relative flex flex-col flex-grow w-full px-4 py-3 text-white border rounded-md shadow-lg bg-gptlightgray border-gray-900/50'>
          <textarea
            onChange={handleChange}
            ref={textAreaRef}
            rows={1}
            tabIndex={0}
            autoFocus
            defaultValue=''
            className='w-full h-[24px] resize-none bg-transparent m-0 border-0 outline-none'
          />
          <button
            type='submit'
            className='absolute p-1 rounded-md bottom-2.5 right-2.5'
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}

export default function Home() {
  return (
    <Layout>
      <Chat />
    </Layout>
  )
}
