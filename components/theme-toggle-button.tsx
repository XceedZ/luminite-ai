"use client"

import { Button } from "@/components/ui/button"
import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="" />
  }

  return (
    <Button variant="ghost" size="icon" className="" onClick={toggleTheme} aria-label="Toggle theme">
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export default ThemeToggleButton


