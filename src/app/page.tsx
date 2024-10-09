"use client"
import { useFixFullScreenCursorStyle } from "@/hooks/use_fix_fullscreen_cursor"
import { useFullScreen } from "@/hooks/use_fullscreen"
import { useRef } from "react"
import styles from "./page.module.css"

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleFullScreen = useFullScreen(rootRef)
  useFixFullScreenCursorStyle(rootRef)
  const tabBarHeight = window.outerHeight - window.innerHeight

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
      {/* <div className={styles.description}>
        <a href="http://10.231.49.203:3000/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiZDk5YjU4YTgtOTEzMy00MTA4LWIyYmMtNzc5YjNlOWNkY2JmIiwiSUQiOjQsIlVzZXJuYW1lIjoiMTc0NjQ0ODQxMkBxcS5jb20iLCJOaWNrTmFtZSI6IjExMiIsIkNvbXBhbnlVbmlxSUQiOjY0ODc0MCwiQXV0aG9yaXR5SWQiOjUsIkJ1ZmZlclRpbWUiOjg2NDAwLCJleHAiOjE3MjQzMTU2NzIsImlzcyI6InFtUGx1cyIsIm5iZiI6MTcyMzcwOTg3Mn0.jkIqdkr0JTo3xlEWg8vjclc31_eJApVZY--8wStsVmI&desktopID=i-gzrteztehazgky3g-bjun01&expiresAt=1724315672000&username=1746448412@qq.com&userid=4&deviceID=606485509&type=PCC">
          点击跳转到云桌面
        </a>
      </div> */}
      <div
        style={{
          width: "100vw",
          height: "1px",
          background: "white",
          marginTop: tabBarHeight - 40,
        }}
      />
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
          全屏
        </p>
      </div>
    </main>
  )
}
