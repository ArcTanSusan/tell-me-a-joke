"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import type { JokeSettings } from "@/types/settings"
import { defaultSettings, jokeTopics, jokeTones, jokeTypes } from "@/types/settings"
import { SettingsCard } from "@/components/settings-card"


export default function Settings() {
  const [settings, setSettings] = useState<JokeSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Load settings on mount
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

  const saveSettings = () => {
    setError(null)
    localStorage.setItem('jokeSettings', JSON.stringify(settings))
    console.log('Saved settings:', settings)
    setSaved(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-amber-900/40">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">
          Tell Me A<span className="text-orange-500"> Joke</span>
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
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
              
              <SettingsCard settings={settings} />

              {/* Settings Form */}
              <div className="bg-black/20 border border-amber-800/30 rounded-3xl p-6 backdrop-blur-sm">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); saveSettings(); }}>
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-gray-300 flex items-center gap-2">
                      Topic
                    </Label>
                    <Select 
                      value={settings.topic} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, topic: value }))}
                    >
                      <SelectTrigger id="topic" className="bg-transparent border-amber-800/30">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        {jokeTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-gray-300 flex items-center gap-2">
                      Tone
                    </Label>
                    <Select 
                      value={settings.tone} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger id="tone" className="bg-transparent border-amber-800/30">
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        {jokeTones.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joke-type" className="text-gray-300 flex items-center gap-2">
                      Type
                    </Label>
                    <Select 
                      value={settings.jokeType} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, jokeType: value }))}
                    >
                      <SelectTrigger id="joke-type" className="bg-transparent border-amber-800/30">
                        <SelectValue placeholder="Select a joke type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        {jokeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature" className="text-gray-300 flex items-center gap-2">
                        Creativity
                      </Label>
                      <span className="text-orange-400 font-medium">{Math.round(settings.temperature * 100)}%</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={[settings.temperature]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, temperature: value }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Predictable</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full rounded-full p-6 text-xl font-bold transition-all transform hover:scale-105 ${
                      saved 
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {saved ? '✨ Settings Saved!' : 'Save Settings'}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 