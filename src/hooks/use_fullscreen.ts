"use client"
import { RefObject, useCallback, useEffect, useState } from "react"

declare global {
  interface Navigator {
    keyboard?: {
      lock: () => Promise<void>
      unlock: () => void
    }
  }
}

export function useFullScreen(viewRef: RefObject<HTMLElement>) {
  const hasFullScreenElement = useCallback(() => {
    if (typeof document !== "undefined") {
      const fullScreenElement = document.fullscreenElement
      return fullScreenElement !== null && fullScreenElement !== undefined
    }
    return false
  }, [])

  const [isFullScreen, setIsFullScreen] = useState(hasFullScreenElement())

  const toggleFullScreen = (): boolean => {
    const fullScreenState = !isFullScreen
    setIsFullScreen(fullScreenState)
    return fullScreenState
  }

  const enterFullScreen = useCallback(() => {
    if (hasFullScreenElement()) {
      return
    }

    viewRef.current?.requestFullscreen()
  }, [hasFullScreenElement, viewRef])

  const exitFullScreen = useCallback(() => {
    if (!hasFullScreenElement()) {
      return
    }

    if (typeof document !== "undefined") {
      document.exitFullscreen()
    }
  }, [hasFullScreenElement])

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isInFullScreen = hasFullScreenElement()
    }
    if (typeof document !== "undefined") {
      document.addEventListener("fullscreenchange", handleFullScreenChange)
    }
    const unlockKeyboard = () => {
      if (navigator.keyboard) {
        navigator.keyboard.unlock()
      }
    }
    window.addEventListener("beforeunload", unlockKeyboard)
    const dispose = () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("fullscreenchange", handleFullScreenChange)
      }
      window.removeEventListener("beforeunload", unlockKeyboard)
      unlockKeyboard()
    }
    return dispose
  }, [hasFullScreenElement])

  useEffect(() => {
    if (isFullScreen) {
      enterFullScreen()
      if (navigator.keyboard) {
        navigator.keyboard.lock()
      }
    } else {
      exitFullScreen()
      if (navigator.keyboard) {
        navigator.keyboard.unlock()
      }
    }
  }, [enterFullScreen, exitFullScreen, isFullScreen, viewRef])

  return toggleFullScreen
}
