import { Card } from '@/components/ui/card';
import type { JokeSettings } from '@/types/settings';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsCardProps {
  settings: JokeSettings;
}

export function SettingsCard({ settings }: SettingsCardProps) {
  if (!settings) return null;

  const { topic, tone, jokeType, temperature } = settings;

  return (
    <Card className="p-6 bg-black/40 border border-amber-800/30 backdrop-blur-sm">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Current Settings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Topic</div>
            <div className="text-white font-medium capitalize">{topic}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Tone</div>
            <div className="text-white font-medium capitalize">{tone}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Type</div>
            <div className="text-white font-medium capitalize">{jokeType}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Creativity</div>
            <div className="text-white font-medium">{Math.round(temperature * 100)}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
} 