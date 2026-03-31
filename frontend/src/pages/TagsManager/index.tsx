import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTags, createTag, updateTag } from '../../api/client'
import type { TagType } from '../../api/client'

export default function TagsManager() {
  const navigate = useNavigate()
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getTags()
      .then(setTags)
      .catch(() => setError('Failed to load tags.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const t = await createTag(newName.trim())
      setTags((prev) => [...prev, t])
      setNewName('')
    } catch {
      setError('Failed to create tag. It may already exist.')
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (tag: TagType) => {
    const newStatus = tag.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'
    try {
      const updated = await updateTag(tag.id!, { status: newStatus })
      setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch {
      setError('Failed to update tag status.')
    }
  }

  const active = tags.filter((t) => t.status === 'ACTIVE')
  const archived = tags.filter((t) => t.status === 'ARCHIVED')

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors dark:text-gray-400"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Manage Tags</h2>
      </div>

      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      {/* New tag form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name…"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="bg-indigo-600 text-white text-sm rounded px-4 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {creating ? 'Creating…' : '+ Create'}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-sm dark:text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Active tags */}
          <section className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-400">
              Active ({active.length})
            </h3>
            {active.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No active tags.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {active.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-3 pr-1.5 py-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">#{t.name}</span>
                  <button
                    onClick={() => toggleStatus(t)}
                    title="Archive tag"
                    className="text-gray-400 hover:text-amber-600 transition-colors text-xs px-1 py-0.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  >
                    archive
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Archived tags */}
          {archived.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-400">
                Archived ({archived.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {archived.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1.5 py-1 opacity-60 dark:bg-gray-900 dark:border-gray-700"
                  >
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{t.name}</span>
                    <button
                      onClick={() => toggleStatus(t)}
                      title="Reactivate tag"
                      className="text-gray-400 hover:text-green-600 transition-colors text-xs px-1 py-0.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      reactivate
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

