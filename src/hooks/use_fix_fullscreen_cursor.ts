import { useEffect, useRef } from "react"

export function useFixFullScreenCursorStyle(
  viewRef: React.RefObject<HTMLElement>
) {
  const hasFullScreenElement = () => {
    if (typeof document !== "undefined") {
      const fullScreenElement = document.fullscreenElement
      return fullScreenElement !== null && fullScreenElement !== undefined
    }
    return false
  }
  const isFullScreen = useRef(hasFullScreenElement())

  useEffect(() => {
    const handleFullScreenChange = () => {
      isFullScreen.current = hasFullScreenElement()
    }
    if (typeof document !== "undefined") {
      document.addEventListener("fullscreenchange", handleFullScreenChange)
    }

    const onDispose = () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("fullscreenchange", handleFullScreenChange)
      }
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
      // Change the cursor style to the default first, as the current cursor style is already set to pointer. Setting it to pointer directly will have no effect
      if (viewRef.current) {
        viewRef.current.style.cursor = "default"
      }
      if (recoverTimer !== null) {
        window.clearTimeout(recoverTimer)
      }
      // Delay setting the cursor style to pointer, because set it to pointer immediately will have no effect
      recoverTimer = window.setTimeout(() => {
        if (viewRef.current) {
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
        // The mouse moves from the top edge and below the first line, where the app status
        // bar starts to disappear, the cursor style be revert to the default arrow in the 
        // meantime. 
        // Delay setting the cursor style to pointer by 200ms,  because if set too 
        // early, the cursor style will revert back to the default arrow after the app status 
        // bar disappearance animation finishes.
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
        // The mouse moves over the second line, and the cursor style be revert to the
        // default arrow. And delay setting the cursor style back to pointer
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
      // When move down from top edge and this callback is called, the cursor style is change 
      // from default arrow to pointer 
      console.log("Test*** onMouseEnter")
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
