import { GitHubIcon, ReactIcon, TwitchIcon } from './Icons'

export function Welcome() {
  return (
    <section className='flex justify-center w-full m-auto'>
      <div class='text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100'>
        <h1 class='text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-4 flex gap-2 items-center justify-center'>
          miduGPT
        </h1>

        <p class='text-center max-w-md m-auto block align-middle mb-8'>
          Esta página <strong>no es la oficial de ChatGPT</strong>. Es un clon creado con React <ReactIcon className='inline-block w-6 h-6' /> y Tailwind para fines educativos.
        </p>

        <div class='flex gap-x-2 max-w-xl m-auto'>
          <a className='flex items-center justify-center w-[250px] p-2 font-bold text-white bg-purple-700 rounded-full gap-x-2 hover:bg-purple-500 focus:border-purple-800 active:bg-purple-800 transition' href='https://twitch.tv/midudev'>
            <TwitchIcon className='w-7 h-7' /> Sígueme en Twitch
          </a>
          <a className='flex items-center justify-center w-[250px] p-2 font-bold text-white bg-black rounded-full gap-x-2 hover:bg-black/50 ' href='https://twitch.tv/midudev'>
            <GitHubIcon className='w-7 h-7' /> Ver código en GitHub
          </a>
        </div>

      </div>
    </section>
  )
}
