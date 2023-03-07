import { GitHubIcon, ReactIcon, SunIcon, TwitchIcon } from './Icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useConversationsStore } from '@/store/conversations'

const EXAMPLES = [
  '¿Cómo iterar un array en JavaScript?',
  'Explícame cómo funciona un coche',
  '¿Por qué se dice que un gato tiene 7 vidas?'
]

export function Welcome() {
  const [animationParent] = useAutoAnimate()
  const sendPrompt = useConversationsStore(state => state.sendPrompt)

  return (
    <section
      ref={animationParent}
      className='flex justify-center w-full m-auto'
    >
      <div className='w-full px-6 text-gray-800 md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col dark:text-gray-100'>
        <h1 className='text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 flex gap-2 items-center justify-center'>
          miduGPT
        </h1>

        <p className='block max-w-md m-auto mb-10 text-center align-middle'>
          Esta página <strong>no es la oficial de ChatGPT</strong>. Es un clon
          creado con React <ReactIcon className='inline-block w-6 h-6' /> y
          Tailwind para fines educativos.
        </p>

        <div className='flex max-w-xl m-auto gap-x-2'>
          <a
            className='flex items-center justify-center w-[250px] p-2 font-bold text-white bg-purple-700 rounded-full gap-x-2 hover:bg-purple-500 focus:border-purple-800 active:bg-purple-800 transition'
            href='https://twitch.tv/midudev'
          >
            <TwitchIcon className='w-6 h-6' /> Sígueme en Twitch
          </a>
          <a
            className='flex items-center justify-center w-[250px] p-2 font-bold text-white bg-black rounded-full gap-x-2 hover:bg-black/50 '
            href='https://twitch.tv/midudev'
          >
            <GitHubIcon className='w-6 h-6' /> Ver código en GitHub
          </a>
        </div>

        <h3 className='flex items-center justify-center mt-8 mb-2 text-lg gap-x-2'><SunIcon />Ejemplos</h3>

        <ul className='flex flex-col gap-3.5 w-full sm:max-w-md m-auto'>
          {
            EXAMPLES.map((example, index) => (
              <button key={index} onClick={() => sendPrompt({ prompt: example })} className='w-full p-3 rounded-md bg-gray-50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-gray-900'>
                {example} →
              </button>
            ))
          }
        </ul>
      </div>
    </section>
  )
}
