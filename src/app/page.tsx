"use client"

import Link from "next/link"
import { Settings, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleJokeDisplay from "@/components/simple-joke-display"
import { useState, useEffect } from "react"
import type { JokeSettings } from "@/types/settings"
import { defaultSettings } from "@/types/settings"


export default function Home() {
  const [settings, setSettings] = useState<JokeSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      setError(null)
      
      const savedSettings = localStorage.getItem('jokeSettings')
      if (!savedSettings) {
        console.log('No saved settings found, using defaults')
        setSettings(defaultSettings)
        setIsLoading(false)
        return
      }
      
      const parsed = JSON.parse(savedSettings) 
      
      // Merge with defaults to ensure all fields exist
      const mergedSettings = {
        topic: parsed.topic || defaultSettings.topic,
        tone: parsed.tone || defaultSettings.tone,
        jokeType: parsed.jokeType || defaultSettings.jokeType,
        temperature: parsed.temperature ?? defaultSettings.temperature
      }
      
      console.log('Loaded settings:', mergedSettings)
      setSettings(mergedSettings)
      setIsLoading(false)
    }

    loadSettings()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-amber-900/40">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Tell Me A<span className="text-orange-500"> Joke</span>
        </h1>
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading settings...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <SimpleJokeDisplay settings={settings} />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-400">
        <p>Powered by AI • Made with ❤️</p>
      </footer>
    </div>
  )
}

