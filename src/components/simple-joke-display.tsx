"use client"

import { useChat } from "ai/react";
import type { JokeSettings } from '@/types/settings';
import { defaultSettings } from '@/types/settings';

interface SimpleJokeDisplayProps {
  settings?: JokeSettings;
}

export default function SimpleJokeDisplay({ settings = defaultSettings }: SimpleJokeDisplayProps) {
  const { messages, append  } = useChat();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="text-9xl text-center animate-bounce mb-12">
        😜
      </div>
      <button
        onClick={() =>
          append({
            role: "user",
            content: `Tell me a ${settings.jokeType} story in a ${settings.tone} tone of joke type ${settings.jokeType} with this creativity score out of 100: ${settings.temperature}`,
          })}
        disabled={false}
        type="button"
        className="w-full max-w-md text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white py-6 px-12 rounded-full mb-12 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/25"
      >
        Tell me a joke
      </button>
      <div
        hidden={
          messages.length === 0 ||
          messages[messages.length - 1]?.content === undefined
        }
        className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
      >
        {messages[messages.length - 1]?.content}
      </div>
    </div>
  );
} 