import { useEffect, useRef } from "react"

export function useFixFullScreenCursorStyle(
  viewRef: React.RefObject<HTMLElement>
) {
  const hasFullScreenElement = () => {
    const fullScreenElement = document.fullscreenElement
    return fullScreenElement !== null && fullScreenElement !== undefined
  }
  const isFullScreen = useRef(hasFullScreenElement())

  useEffect(() => {
    const handleFullScreenChange = () => {
      isFullScreen.current = hasFullScreenElement()
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange)

    const onDispose = () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
    return onDispose
  }, [])

  useEffect(() => {
    let hasAboveTabBar = false
    const tabBarHeight = window.outerHeight - window.innerHeight
    let isMoveFromTop = false
    let isHandlingMoveFromTop = false
    let recoverTimer: number | null = null

    const recoverCursor = (delay: number, callback?: () => void) => {
      if (viewRef.current) {
        console.log("Test*** set cursor to default")
        viewRef.current.style.cursor = "default"
      }
      if (recoverTimer !== null) {
        window.clearTimeout(recoverTimer)
      }
      recoverTimer = window.setTimeout(() => {
        if (viewRef.current) {
          console.log("Test*** set cursor to pointer")
          viewRef.current.style.cursor = "pointer"
        }
        recoverTimer = null
        callback?.()
      }, delay)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isFullScreen.current) {
        return
      }

      if (isMoveFromTop) {
        if (e.clientY >= tabBarHeight - 40) {
          console.log("Test*** move from top")
          isHandlingMoveFromTop = true
          recoverCursor(200, () => {
            isHandlingMoveFromTop = false
          })
          isMoveFromTop = false
        }
        return
      }

      if (e.clientY <= tabBarHeight && !hasAboveTabBar) {
        hasAboveTabBar = true
        return
      }
      if (e.clientY > tabBarHeight) {
        if (hasAboveTabBar && !isHandlingMoveFromTop) {
          console.log("Test*** move over tab bar")
          recoverCursor(50)
        }
        hasAboveTabBar = false
      }
    }

    const onMouseEnter = (e: MouseEvent) => {
      if (!isFullScreen.current) {
        return
      }
      console.log("Test*** onMouseEnter, clientY: ", e.clientY)
      isMoveFromTop = true
    }
    viewRef.current?.addEventListener("mousemove", onMouseMove)
    viewRef.current?.addEventListener("mouseenter", onMouseEnter)
    const onDispose = () => {
      viewRef.current?.removeEventListener("mousemove", onMouseMove)
      viewRef.current?.removeEventListener("mouseenter", onMouseEnter)
      if (recoverTimer != null) {
        window.clearTimeout(recoverTimer)
        recoverTimer = null
      }
    }
    return onDispose
  }, [viewRef])
}
