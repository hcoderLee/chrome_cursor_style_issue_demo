"use client"
import { useFixFullScreenCursorStyle } from "@/hooks/use_fix_fullscreen_cursor"
import { useFullScreen } from "@/hooks/use_fullscreen"
import { useEffect, useRef, useState } from "react"
import styles from "./page.module.css"

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [tabBarHeight, setTabBarHeight] = useState(0)
  const toggleFullScreen = useFullScreen(rootRef)
  // I write a hook to fix this cursor style issue temporarily. You can see the cursor style issue more clearly in the hook file.
  // useFixFullScreenCursorStyle(rootRef)
  useEffect(() => {
    setTabBarHeight(window.outerHeight - window.innerHeight)
  }, [])

  return (
    <main
      className={styles.main}
      ref={rootRef}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        justifyContent: "start",
        padding: 0,
      }}
    >
      {/* When the mouse moves down from the top edge and below this line, the app status bar starts to disappear */}
      <div
        style={{
          width: "100vw",
          height: "1px",
          background: "white",
          marginTop: tabBarHeight - 40,
        }}
      />
      {/* When the mouse moves down below this line, the cursor will revert to the default arrow */}
      <div
        style={{
          width: "100vw",
          height: "1px",
          background: "white",
          marginTop: 40,
        }}
      />
      <div
        className={styles.description}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          marginTop: "20px",
        }}
      >
        <p
          onClick={() => {
            toggleFullScreen()
          }}
        >
          FullScreen
        </p>
      </div>
    </main>
  )
}
