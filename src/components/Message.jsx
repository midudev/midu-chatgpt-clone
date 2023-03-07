import snarkdown from 'snarkdown'
import { Avatar } from '@/components/Avatar.jsx'
import { TypingEffect } from '@/components/TypingEffect.jsx'
import { UserAvatar } from '@/components/UserAvatar'
import { ChatGPTLogo } from '@/components/Icons.jsx'
import { ErrorMessage } from './ErrorMessage'

export function Message({ ia, message, error }) {
  const avatar = ia ? <ChatGPTLogo /> : <UserAvatar />
  const textElement = ia
    ? <TypingEffect text={snarkdown(message)} />
    : (
      <div dangerouslySetInnerHTML={{
        __html: snarkdown(message)
      }}
      />
      )

  const renderContent = () => {
    if (error) return <ErrorMessage />
    return textElement
  }

  return (
    <div className={`text-gray-100 ${ia ? 'bg-gptlightgray' : 'bg-gptgray'}`}>
      <article className='flex max-w-3xl gap-4 p-6 m-auto'>
        <Avatar>{avatar}</Avatar>
        <div className='min-h-[20px] flex flex-1 flex-col items-start gap-4 whitespace-pre-wrap'>
          <div className='w-full break-words prose-invert'>
            {renderContent()}
          </div>
        </div>
      </article>
    </div>
  )
}
