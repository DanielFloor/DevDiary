import { Routes, Route, NavLink } from 'react-router-dom'
import DiaryList from './pages/DiaryList'
import DiaryEntryPage from './pages/DiaryEntry'
import SearchResults from './pages/SearchResults'
import ProjectsManager from './pages/ProjectsManager'
import TagsManager from './pages/TagsManager'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
            📓 DevDiary
          </NavLink>
          <nav className="flex items-center gap-4 text-sm text-gray-500">
            <NavLink
              to="/manage/projects"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 font-medium' : 'hover:text-indigo-600 transition-colors'
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/manage/tags"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 font-medium' : 'hover:text-indigo-600 transition-colors'
              }
            >
              Tags
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DiaryList />} />
          <Route path="/entries/new" element={<DiaryEntryPage />} />
          <Route path="/entries/:id/edit" element={<DiaryEntryPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/manage/projects" element={<ProjectsManager />} />
          <Route path="/manage/tags" element={<TagsManager />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

