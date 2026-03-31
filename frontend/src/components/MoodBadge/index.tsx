import type { Mood } from '../../api/client'

const moodConfig: Record<Mood, { label: string; className: string }> = {
  GREAT:      { label: '🚀 Great',      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  GOOD:       { label: '😊 Good',       className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  NEUTRAL:    { label: '😐 Neutral',    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  TIRED:      { label: '😴 Tired',      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  FRUSTRATED: { label: '😤 Frustrated', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

interface MoodBadgeProps {
  mood: Mood
}

export default function MoodBadge({ mood }: MoodBadgeProps) {
  const cfg = moodConfig[mood] ?? moodConfig.NEUTRAL
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

