import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { searchEntries } from '../../api/client'
import type { DiaryEntryType } from '../../api/client'
import EntryCard from '../../components/EntryCard'

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(q)
  const [results, setResults] = useState<DiaryEntryType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    searchEntries(q)
      .then(setResults)
      .catch((err) => {
        console.error(err)
        setError('Search failed.')
      })
      .finally(() => setLoading(false))
  }, [q])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors dark:text-gray-400"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Search{q ? `: "${q}"` : ''}
        </h2>
      </div>

      {/* Refine search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Refine search…"
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white text-sm rounded px-4 py-2 hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-gray-500 text-sm dark:text-gray-400">Searching…</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!loading && !error && q && results.length === 0 && (
          <p className="text-gray-500 text-sm dark:text-gray-400">No results found for "{q}".</p>
        )}
        {results.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={() => {}} />
        ))}
      </div>
    </div>
  )
}

