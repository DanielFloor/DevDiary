import { useEffect, useState } from 'react'
import { getProjects, getTags } from '../../api/client'
import type { EntryFilters, ProjectType, TagType } from '../../api/client'
import MultiSelectDropdown from '../MultiSelectDropdown'

interface FilterPanelProps {
  onFilter: (filters: EntryFilters) => void
}

export default function FilterPanel({ onFilter }: FilterPanelProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [activeProjects, setActiveProjects] = useState<ProjectType[]>([])
  const [activeTags, setActiveTags] = useState<TagType[]>([])

  useEffect(() => {
    getProjects('ACTIVE').then(setActiveProjects).catch(console.error)
    getTags('ACTIVE').then(setActiveTags).catch(console.error)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({
      project: selectedProjects.length ? selectedProjects : undefined,
      tag: selectedTags.length ? selectedTags : undefined,
      from: from || undefined,
      to: to || undefined,
    })
  }

  const handleClear = () => {
    setSelectedProjects([])
    setSelectedTags([])
    setFrom('')
    setTo('')
    onFilter({})
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filters</h2>

      {/* Projects multi-select dropdown */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Project</label>
        <MultiSelectDropdown
          options={activeProjects.map((p) => ({ value: p.name, label: p.name }))}
          selected={selectedProjects}
          onChange={setSelectedProjects}
          placeholder="All projects"
        />
      </div>

      {/* Tags multi-select dropdown */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Tags</label>
        <MultiSelectDropdown
          options={activeTags.map((t) => ({ value: t.name, label: `#${t.name}` }))}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder="All tags"
        />
      </div>

      {/* Date range */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white text-sm rounded px-3 py-1.5 hover:bg-indigo-700 transition-colors"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 bg-gray-100 text-gray-700 text-sm rounded px-3 py-1.5 hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
