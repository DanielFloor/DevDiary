import type { Mood } from '../../api/client'

const moodConfig: Record<Mood, { label: string; className: string }> = {
  GREAT:      { label: '🚀 Great',      className: 'bg-green-100 text-green-800' },
  GOOD:       { label: '😊 Good',       className: 'bg-blue-100 text-blue-800' },
  NEUTRAL:    { label: '😐 Neutral',    className: 'bg-gray-100 text-gray-700' },
  TIRED:      { label: '😴 Tired',      className: 'bg-yellow-100 text-yellow-800' },
  FRUSTRATED: { label: '😤 Frustrated', className: 'bg-red-100 text-red-800' },
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

