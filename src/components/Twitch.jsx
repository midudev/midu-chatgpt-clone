import { useEffect, useState } from 'react'

const useTwitchOnline = () => {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    fetch('https://midudev-apis.midudev.workers.dev/uptime/midudev')
      .then(res => res.json())
      .then(({ online }) => {
        setOnline(online)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return online
}

export default function TwitchStream () {
  const [open, setOpen] = useState(true)
  const online = useTwitchOnline()

  if (!online) return <div />

  const { hostname } = document.location

  if (!open) return null

  return (
    <div className='fixed p-2 bg-purple-500 rounded shadow-2xl bottom-2 right-2 shadow-purple-400'>
      <button className='absolute p-2 text-xs font-bold bg-black -top-4 right-2 rounded-2xl hover:bg-blue-900' onClick={() => setOpen(false)}>Cerrar 𝖷</button>
      <iframe src={`https://player.twitch.tv/?channel=midudev&parent=${hostname}`} frameBorder='0' width='320' height='200' allowFullScreen='true' scrolling='no' />
      <a className='block py-2 font-semibold text-center' href='https://twitch.tv/midudev' rel='noopener nofollow noreferrer' target='_blank'>
        ¡Estamos en directo en Twitch!
        ¡Únete!
      </a>
    </div>
  )
}
