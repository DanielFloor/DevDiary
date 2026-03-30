import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getEntries, deleteEntry as apiDeleteEntry } from '../../api/client'
import type { DiaryEntryType, EntryFilters } from '../../api/client'
import EntryCard from '../../components/EntryCard'
import FilterPanel from '../../components/FilterPanel'

export default function DiaryList() {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [entries, setEntries] = useState<DiaryEntryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<EntryFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEntries = async (f: EntryFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEntries(f)
      setEntries(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load entries. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries(filters)
  }, [filters])

  const handleFilter = (f: EntryFilters) => {
    setFilters(f)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return
    try {
      await apiDeleteEntry(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete entry.')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Entries</h2>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries…"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-gray-100 text-gray-700 text-sm rounded px-3 py-1.5 hover:bg-gray-200 transition-colors"
            >
              Search
            </button>
          </form>
          <button
            onClick={() => navigate('/entries/new')}
            className="bg-indigo-600 text-white text-sm rounded px-4 py-1.5 hover:bg-indigo-700 transition-colors"
          >
            + New Entry
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <FilterPanel onFilter={handleFilter} />
        </aside>

        {/* Entry list */}
        <section className="flex-1 space-y-4">
          {loading && <p className="text-gray-500 text-sm">Loading…</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && entries.length === 0 && (
            <p className="text-gray-500 text-sm">No entries yet. Create your first one!</p>
          )}
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </section>
      </div>
    </div>
  )
}

