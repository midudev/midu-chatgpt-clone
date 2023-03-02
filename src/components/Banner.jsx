import { useEffect, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { CloseIcon } from './Icons'

export function Banner () {
  const [showBanner, setShowBanner] = useState(false)
  const [animationParent] = useAutoAnimate()

  const handleClick = () => {
    setShowBanner(false)
    localStorage.setItem('bannerClosed', true)
  }

  useEffect(() => {
    // get from local storage is banner has been closed before
    const bannerClosed = localStorage.getItem('bannerClosed')
    if (bannerClosed) return

    // show banner after 5 seconds
    const timeoutId = setTimeout(() => {
      setShowBanner(true)
    }
    , 2000)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div ref={animationParent}>
      {showBanner && (
        <div className='fixed top-0 flex justify-center w-screen font-semibold bg-red-700 center'>
          <div className='flex items-center justify-between w-full max-w-4xl p-2 text-left'>
            Esta página no es la oficial de ChatGPT. Es un clon creado con React y Tailwind para fines educativos.
            <button className='block transition hover:scale-150' onClick={handleClick}>
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
