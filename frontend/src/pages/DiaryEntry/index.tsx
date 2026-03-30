import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEntry, getEntry, updateEntry, getProjects, getTags, createTag } from '../../api/client'
import type { DiaryEntryType, LinkType, Mood, ProjectType, TagType } from '../../api/client'

const MOODS: Mood[] = ['GREAT', 'GOOD', 'NEUTRAL', 'TIRED', 'FRUSTRATED']

const emptyForm = (): Omit<DiaryEntryType, 'id' | 'createdAt' | 'updatedAt'> => ({
  date: new Date().toISOString().slice(0, 10),
  project: '',
  content: '',
  mood: 'NEUTRAL',
  tags: [],
  links: [],
})

export default function DiaryEntryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm())
  const [selectedTags, setSelectedTags] = useState<TagType[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeProjects, setActiveProjects] = useState<ProjectType[]>([])
  const [activeTags, setActiveTags] = useState<TagType[]>([])

  // Load dropdown options
  useEffect(() => {
    getProjects('ACTIVE').then(setActiveProjects).catch(console.error)
    getTags('ACTIVE').then(setActiveTags).catch(console.error)
  }, [])

  // Load entry when editing
  useEffect(() => {
    if (!isEdit || !id) return
    getEntry(Number(id))
      .then((entry) => {
        setForm({
          date: entry.date,
          project: entry.project ?? '',
          content: entry.content ?? '',
          mood: entry.mood,
          tags: entry.tags,
          links: entry.links,
        })
        setSelectedTags(entry.tags ?? [])
        setLinks(entry.links ?? [])
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load entry.')
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Toggle an active tag on/off
  const toggleTag = (tag: TagType) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.name === tag.name)
        ? prev.filter((t) => t.name !== tag.name)
        : [...prev, tag]
    )
  }

  // Add a new tag inline (creates it in the backend + selects it)
  const handleAddNewTag = async () => {
    const name = newTagInput.trim()
    if (!name) return
    if (selectedTags.some((t) => t.name === name)) {
      setNewTagInput('')
      return
    }
    try {
      // Try to create; if it already exists the backend returns 400, so fall back to using it by name
      let tag: TagType = { name }
      try {
        tag = await createTag(name)
        setActiveTags((prev) => [...prev, tag])
      } catch {
        // Tag already exists — just use it by name so resolveTagsInPlace handles it
      }
      setSelectedTags((prev) => [...prev, tag])
      setNewTagInput('')
    } catch (err) {
      console.error(err)
    }
  }

  const addLink = () => setLinks((prev) => [...prev, { url: '', label: '' }])
  const updateLink = (index: number, field: keyof LinkType, value: string) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }
  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      tags: selectedTags.map((t) => ({ name: t.name })),
      links: links.filter((l) => l.url.trim()),
    }

    try {
      if (isEdit && id) {
        await updateEntry(Number(id), payload)
      } else {
        await createEntry(payload)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  // The current project might be archived — add it as an option so edit forms stay valid
  const projectOptions = activeProjects.some((p) => p.name === form.project)
    ? activeProjects
    : form.project
    ? [{ id: undefined, name: form.project, status: 'ARCHIVED' as const }, ...activeProjects]
    : activeProjects

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? 'Edit Entry' : 'New Entry'}
        </h2>
      </div>

      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {/* Date + Project row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Project
              <a
                href="/manage/projects"
                className="ml-2 font-normal text-indigo-500 hover:underline"
                onClick={(e) => { e.preventDefault(); navigate('/manage/projects') }}
              >
                manage
              </a>
            </label>
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— No project —</option>
              {projectOptions.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}{p.status === 'ARCHIVED' ? ' (archived)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mood</label>
          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">What did you work on? *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={8}
            placeholder="Describe what you worked on today…"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tags
            <a
              href="/manage/tags"
              className="ml-2 font-normal text-indigo-500 hover:underline"
              onClick={(e) => { e.preventDefault(); navigate('/manage/tags') }}
            >
              manage
            </a>
          </label>
          {/* Active tag badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {activeTags.map((tag) => {
              const selected = selectedTags.some((t) => t.name === tag.name)
              return (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </button>
              )
            })}
            {/* Show tags on the entry that are not in the active list (e.g. archived) */}
            {selectedTags
              .filter((st) => !activeTags.some((at) => at.name === st.name))
              .map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white opacity-60"
                  title="Archived tag"
                >
                  #{tag.name} ×
                </button>
              ))}
          </div>
          {/* New tag input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewTag() } }}
              placeholder="New tag name…"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddNewTag}
              className="bg-gray-100 text-gray-700 text-sm rounded px-3 py-1.5 hover:bg-gray-200 transition-colors"
            >
              + Add tag
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-600">Links</label>
            <button type="button" onClick={addLink} className="text-xs text-indigo-600 hover:underline">
              + Add link
            </button>
          </div>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  placeholder="https://…"
                  className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={link.label ?? ''}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  placeholder="Label (optional)"
                  className="w-36 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white text-sm rounded px-5 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Update Entry' : 'Create Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-100 text-gray-700 text-sm rounded px-5 py-2 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

