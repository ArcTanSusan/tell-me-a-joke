"use client"

import { useState } from 'react';
import type { JokeSettings } from '@/types/settings';
import { defaultSettings } from '@/types/settings';
import { MessageCircle, Laugh, Sparkles, Tag, Settings } from 'lucide-react';
import Link from 'next/link';

interface SimpleJokeDisplayProps {
  settings?: JokeSettings;
}

export default function SimpleJokeDisplay({ settings = defaultSettings }: SimpleJokeDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [joke, setJoke] = useState('');

  const generateJoke = async () => {

      setIsLoading(true);
      setJoke('');

    try {
      const response = await fetch('/api/joke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Tell me a joke' }],
          parameters: settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate joke');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let jokeText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content;
            if (content) {
              jokeText += content;
              setJoke(jokeText);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating joke:', error);
      setJoke('Failed to generate joke. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="text-9xl text-center animate-bounce mb-12">
        😜
      </div>
      <button
        onClick={generateJoke}
        disabled={isLoading}
        type="button"
        className="w-full max-w-md text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white py-6 px-12 rounded-full mb-12 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/25"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" aria-label="Loading">
              <title>Loading...</title>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Thinking ...
          </div>
        ) : (
          'Tell me a joke!'
        )}
      </button>
      {joke && (
        <>
          <div className="w-full max-w-lg text-center p-8 bg-black/40 border border-amber-800/30 rounded-3xl backdrop-blur-sm mb-4">
            <p className="text-2xl text-white leading-relaxed">{joke}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 bg-black/40 px-4 py-2 rounded-full border border-amber-800/30">
            {settings.topic !== 'anything' && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3 w-3 text-orange-400" />
                <span className="capitalize">{settings.topic}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Laugh className="h-3 w-3 text-orange-400" />
              <span className="capitalize">{settings.tone}</span>
            </div>
            {settings.jokeType !== 'any' && (
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-3 w-3 text-orange-400" />
                <span className="capitalize">{settings.jokeType}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-orange-400" />
              <span>{Math.round(settings.temperature * 100)}% creative</span>
            </div>
            <Link href="/settings" className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors ml-2">
              <Settings className="h-3 w-3" />
              <span>Edit</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 