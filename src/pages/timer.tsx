import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import classNames from "classnames"
import Link from "next/link"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

const calculateTimeLeft: (time: number) => TimeLeft | null = (time) => {
  const difference = time - +new Date()

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    }
  } else {
    return null
  }
}

type Colors = "normal" | "half" | "5min" | "30sec" | "finished"

const getBgColor = (color: Colors) => {
  if (color === "normal") return "bg-black text-white"
  else if (color === "half") return "bg-green-500 text-white"
  else if (color === "5min") return "bg-yellow-400 text-black"
  else if (color === "30sec") return "bg-yellow-600 text-white"
  else if (color === "finished") return "bg-blinking text-white"
}

const getStatus: (timeLeft: number, duration: number) => Colors = (timeLeft, duration) => {
  if (timeLeft === 0) {
    return "finished"
  } else if (timeLeft <= 30 * 1000) {
    return "30sec"
  } else if (timeLeft <= 5 * 60 * 1000) {
    return "5min"
  } else if (timeLeft > 5 * 60 * 1000 && timeLeft <= duration / 2) {
    return "half"
  } else {
    return "normal"
  }
}

const Timer: NextPage = () => {
  const router = useRouter()
  const { time, duration: _duration } = router.query

  const timeEnd = +(time as string)
  const duration = +(_duration as string)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(timeEnd))
  const currentColor = getStatus(timeLeft ? timeLeft.total : 0, duration)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(timeEnd))
    }, 1000)

    return function cleanup() {
      console.log("cleaning up")
      clearInterval(timer)
    }
  }, [])

  return (
    <div
      className={classNames(
        "w-full min-h-screen space-y-12 2xl:space-y-48 flex flex-col items-center justify-center font-display",
        getBgColor(currentColor)
      )}
    >
      <p
        className={classNames(
          "font-mono text-8xl 2xl:text-[18rem] font-semibold tracking-wider",
          currentColor === "finished" && "animate-bounce"
        )}
      >
        {timeLeft
          ? `${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`
          : "00:00"}
      </p>
      <Link href="/">
        <a className="text-lg 2xl:text-[6.5rem] px-12 py-2 2xl:px-36 2xl:py-32 rounded-full border-gray-700 bg-purple-300 text-black border 2xl:border-[0.35rem] transition-colors hover:bg-purple-400">
          กลับเข้าหน้าแรก
        </a>
      </Link>
    </div>
  )
}

export default Timer
