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
  // 判断当前是否有全屏组件
  const hasFullScreenElement = useCallback(() => {
    const fullScreenElement = document.fullscreenElement
    return fullScreenElement !== null && fullScreenElement !== undefined
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

    document.exitFullscreen()
  }, [hasFullScreenElement])

  // 初始化操作
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isInFullScreen = hasFullScreenElement()
    }
    // 监听全屏状态变化
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    const unlockKeyboard = () => {
      if (navigator.keyboard) {
        navigator.keyboard.unlock()
      }
    }
    // 处理页面刷新
    window.addEventListener("beforeunload", unlockKeyboard)
    const dispose = () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      window.removeEventListener("beforeunload", unlockKeyboard)
      unlockKeyboard()
    }
    return dispose
  }, [hasFullScreenElement])

  // 处理全屏状态改变
  useEffect(() => {
    if (isFullScreen) {
      enterFullScreen()
      // 拦截键盘事件
      if (navigator.keyboard) {
        navigator.keyboard.lock()
      }
    } else {
      exitFullScreen()
      // 取消拦截键盘事件
      if (navigator.keyboard) {
        navigator.keyboard.unlock()
      }
    }
  }, [enterFullScreen, exitFullScreen, isFullScreen, viewRef])

  return toggleFullScreen
}
