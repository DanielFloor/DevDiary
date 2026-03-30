import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, updateProject, deleteProject } from '../../api/client'
import type { ProjectType } from '../../api/client'

export default function ProjectsManager() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const p = await createProject(newName.trim())
      setProjects((prev) => [...prev, p])
      setNewName('')
    } catch {
      setError('Failed to create project. It may already exist.')
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (project: ProjectType) => {
    const newStatus = project.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'
    try {
      const updated = await updateProject(project.id!, { status: newStatus })
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } catch {
      setError('Failed to update project status.')
    }
  }

  const handleDelete = async (project: ProjectType) => {
    if (!confirm(`Delete project "${project.name}"? This only removes it from the list — existing entries keep their project name.`)) return
    try {
      await deleteProject(project.id!)
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
    } catch {
      setError('Failed to delete project.')
    }
  }

  const active = projects.filter((p) => p.status === 'ACTIVE')
  const archived = projects.filter((p) => p.status === 'ARCHIVED')

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Manage Projects</h2>
      </div>

      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      {/* New project form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name…"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : (
        <>
          {/* Active projects */}
          <section className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Active ({active.length})
            </h3>
            {active.length === 0 && (
              <p className="text-sm text-gray-400">No active projects.</p>
            )}
            <ul className="space-y-2">
              {active.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(p)}
                      className="text-xs text-amber-600 hover:text-amber-800 px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Archived projects */}
          {archived.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Archived ({archived.length})
              </h3>
              <ul className="space-y-2">
                {archived.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 opacity-70"
                  >
                    <span className="text-sm text-gray-500">{p.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(p)}
                        className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      >
                        Reactivate
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}

