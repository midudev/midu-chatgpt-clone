import { useEffect, useState } from 'react'

const useTypingEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0) // podríamos usar un useRef
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!text?.length) return

    const intervalId = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(intervalId)
        setShowCursor(false)
        return
      }

      const nextIndex = text.indexOf(' ', currentIndex + 1)
      if (nextIndex < 0) { // ha llegado al final
        setDisplayText(text)
        setCurrentIndex(text.length)
        return
      }

      setDisplayText(text.slice(0, nextIndex))
      setCurrentIndex(currentIndex + 1)
    }, 1)

    return () => clearInterval(intervalId)
  }, [text, currentIndex])

  return { displayText, showCursor }
}

export function TypingEffect ({ text }) {
  const { displayText, showCursor } = useTypingEffect({ text })

  return <span className={`${showCursor ? 'after:content-["▋"] after:ml-1 after:animate-typing' : ''}`}>{displayText}</span>
}
