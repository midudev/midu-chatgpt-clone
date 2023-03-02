import { SendIcon } from '@/components/Icons.jsx'
import { useEffect, useRef } from 'react'
import { useConversationsStore } from '@/store/conversations'

function LoadingButton () {
  return (
    <div className='text-2xl'>
      <span class=''>·</span>
      <span class=''>·</span>
      <span class=''>·</span>
    </div>
  )
}

export function ChatForm() {
  const sendPrompt = useConversationsStore((state) => state.sendPrompt)
  const isLoading = useConversationsStore(state => state.loading)
  const textAreaRef = useRef()

  const handleSubmit = (event) => {
    event?.preventDefault()
    if (isLoading) return

    const { value } = textAreaRef.current
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

  useEffect(() => {
    textAreaRef.current.focus()
  }, [])

  return (
    <section className='absolute bottom-0 left-0 right-0 w-full ml-32'>
      <form
        disabled={isLoading}
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
            {
              isLoading ? <LoadingButton /> : <SendIcon />
            }
          </button>
        </div>
      </form>
      <div className='px-3 pt-2 pb-3 text-xs text-center text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6'>
        <a
          href='https://twitch.tv/midudev'
          target='_blank'
          rel='noreferrer'
          className='underline'
        >
          Clon de ChatGPT creado por @midudev con Next.js y TailwindCSS
        </a>
        . Creado con fines educativos y de aprendizaje.
      </div>
    </section>
  )
}
