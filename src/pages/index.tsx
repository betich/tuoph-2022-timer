import { NextPage } from "next"
import { Router, useRouter } from "next/dist/client/router"
import { sendJson } from "next/dist/server/api-utils"
import { FC, useRef, useState } from "react"

const Home: NextPage = () => {
  let _saved: null | string = null
  if (typeof window !== "undefined") {
    _saved = window.localStorage.getItem("time")
  }

  const saved = _saved?.split(":") as string[]
  const _minutes: string | null = saved?.length ? saved[0] : null
  const _seconds: string | null = saved?.length ? saved[1] : null

  const minRef = useRef<HTMLInputElement | null>(null)
  const secRef = useRef<HTMLInputElement | null>(null)
  const [minutes, setMinute] = useState(_minutes ?? "15")
  const [seconds, setSecond] = useState(_seconds ?? "30")
  const [error, setError] = useState<null | string>(null)
  const router = useRouter()

  return (
    <main className="w-full min-h-screen font-display flex flex-col space-y-12 2xl:space-y-48 justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl 2xl:text-[8rem]">Open House Timer</h1>
        {error && <span className="text-red-400">{error}</span>}
      </div>
      <div className="flex space-x-2 2xl:space-x-12 justify-center items-center text-xl">
        <input
          type="text"
          className="text-gray-500 w-24 2xl:w-[20rem] 2xl:text-[10rem] 2xl:py-[10rem] py-8 border border-gray-600 shadow-md rounded-lg text-center text-6xl"
          placeholder="15"
          ref={minRef}
          value={minutes}
          onChange={(e) => {
            e.preventDefault()
            const text = e.target.value

            if (text.length > 2) {
              secRef?.current?.focus()
              return
            }

            if (minutes.length === 0 && text.length === 1) {
              if (+text > 6) return
            }

            setMinute(text)
          }}
        />
        <span className="text-6xl mx-4 2xl:text-[8rem] text-gray-500">:</span>
        <input
          type="text"
          className="text-gray-500 w-24 2xl:w-[20rem] 2xl:text-[10rem] 2xl:py-[10rem] py-8 border border-gray-600 shadow-md rounded-lg text-center text-6xl"
          placeholder="30"
          ref={secRef}
          value={seconds}
          onChange={(e) => {
            e.preventDefault()
            const text = e.target.value

            if (text.length > 2) return

            if (seconds.length === 0 && text.length === 1) {
              if (+text > 6) return
            }
            setSecond(text)
          }}
        />
      </div>

      <div className="flex space-x-2 2xl:space-x-24 text-lg 2xl:text-[6.5rem]">
        <button
          onClick={(e) => {
            e.preventDefault()

            setMinute("")
            setSecond("")
          }}
          className="2xl:border-[0.35rem] px-12 py-2 2xl:px-36 2xl:py-32 rounded-full border-gray-700 bg-red-400 text-white border transition-colors hover:bg-red-600"
        >
          ??????????????????
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()

            if (minutes === "" || seconds === "") {
              setError("a field is missing")
              return
            }

            if (isNaN(+minutes) || isNaN(+seconds)) {
              setError("type in numbers only")
              return
            }

            const timed = +new Date() + +minutes * 1000 * 60 + +seconds * 1000 + 1 * 1000
            if (typeof window !== "undefined") {
              window.localStorage.setItem("time", `${minutes}:${seconds}`)
            }

            router.push({
              pathname: "/timer",
              query: {
                time: timed,
                duration: +minutes * 1000 * 60 + +seconds * 1000,
              },
            })
          }}
          className="2xl:border-[0.35rem] px-12 py-2 2xl:px-36 2xl:py-32 rounded-full border-gray-700 bg-purple-300 text-black border transition-colors hover:bg-purple-400"
        >
          ?????????????????????
        </button>
      </div>
    </main>
  )
}

export default Home
