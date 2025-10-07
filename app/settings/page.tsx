"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const ACCENTS: Array<{ key: string; name: string; hsl: string; fg: string }> = [
  { key: "blue", name: "Blue", hsl: "224 76% 48%", fg: "0 0% 100%" },
  { key: "orange", name: "Orange", hsl: "28 86% 54%", fg: "0 0% 100%" },
  { key: "green", name: "Green", hsl: "142 73% 45%", fg: "0 0% 100%" },
  { key: "pink", name: "Pink", hsl: "340 82% 52%", fg: "0 0% 100%" },
]

function useAccent() {
  const [accent, setAccentState] = React.useState<string | null>(null)
  React.useEffect(() => {
    const stored = localStorage.getItem("accent")
    if (stored) {
      setAccentState(stored)
      const def = ACCENTS.find(a => a.key === stored)
      if (def) {
        document.documentElement.style.setProperty("--primary", def.hsl)
        document.documentElement.style.setProperty("--primary-foreground", def.fg)
      }
    }
  }, [])

  const setAccent = React.useCallback((key: string) => {
    const def = ACCENTS.find(a => a.key === key)
    if (!def) return
    localStorage.setItem("accent", key)
    document.documentElement.style.setProperty("--primary", def.hsl)
    document.documentElement.style.setProperty("--primary-foreground", def.fg)
    setAccentState(key)
  }, [])

  return { accent, setAccent }
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { accent, setAccent } = useAccent()

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">You are on the Free Plan.</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary">Contact support</Button>
                <Button>Upgrade</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accent</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              {ACCENTS.map(a => (
                <button
                  key={a.key}
                  aria-label={a.name}
                  onClick={() => setAccent(a.key)}
                  className="relative size-10 rounded-full border"
                  style={{ backgroundColor: `hsl(${a.hsl})` }}
                >
                  {accent === a.key && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-primary" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`border rounded-md p-2 ${theme === "light" ? "ring-2 ring-primary" : ""}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`border rounded-md p-2 ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
              >
                Dark
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}



