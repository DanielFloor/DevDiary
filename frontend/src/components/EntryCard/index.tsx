import { useNavigate } from 'react-router-dom'
import type { DiaryEntryType } from '../../api/client'
import MoodBadge from '../MoodBadge'
import LinkList from '../LinkList'

interface EntryCardProps {
  entry: DiaryEntryType
  onDelete: (id: number) => void
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const navigate = useNavigate()
  const excerpt =
    entry.content && entry.content.length > 200
      ? entry.content.slice(0, 200) + '…'
      : entry.content

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-500">{entry.date}</span>
          {entry.project && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-medium">
              {entry.project}
            </span>
          )}
          {entry.mood && <MoodBadge mood={entry.mood} />}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => navigate(`/entries/${entry.id}/edit`)}
            className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => entry.id != null && onDelete(entry.id)}
            className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content excerpt */}
      {excerpt && <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{excerpt}</p>}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span
              key={tag.id ?? tag.name}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <LinkList links={entry.links ?? []} />
    </div>
  )
}

