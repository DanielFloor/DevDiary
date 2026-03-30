/// <reference types="vite/client" />
import axios from 'axios'

export type Mood = 'GREAT' | 'GOOD' | 'NEUTRAL' | 'TIRED' | 'FRUSTRATED'
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED'

export interface ProjectType {
  id?: number
  name: string
  status: ProjectStatus
}

export interface TagType {
  id?: number
  name: string
  status?: ProjectStatus
}

export interface LinkType {
  id?: number
  url: string
  label?: string
}

export interface DiaryEntryType {
  id?: number
  date: string            // ISO date "YYYY-MM-DD"
  project: string
  content: string
  mood: Mood
  tags: TagType[]
  links: LinkType[]
  createdAt?: string
  updatedAt?: string
}

export interface EntryFilters {
  project?: string[]
  tag?: string[]
  from?: string
  to?: string
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  paramsSerializer: {
    indexes: null,   // serialise arrays as ?tag=java&tag=spring (no brackets)
  },
})

// ── Entries ──────────────────────────────────────────────

export const getEntries = async (filters?: EntryFilters): Promise<DiaryEntryType[]> => {
  const { data } = await api.get<DiaryEntryType[]>('/api/entries', { params: filters })
  return data
}

export const searchEntries = async (q: string): Promise<DiaryEntryType[]> => {
  const { data } = await api.get<DiaryEntryType[]>('/api/entries/search', { params: { q } })
  return data
}

export const getEntry = async (id: number): Promise<DiaryEntryType> => {
  const { data } = await api.get<DiaryEntryType>(`/api/entries/${id}`)
  return data
}

export const createEntry = async (
  entry: Omit<DiaryEntryType, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DiaryEntryType> => {
  const { data } = await api.post<DiaryEntryType>('/api/entries', entry)
  return data
}

export const updateEntry = async (
  id: number,
  entry: Partial<DiaryEntryType>
): Promise<DiaryEntryType> => {
  const { data } = await api.put<DiaryEntryType>(`/api/entries/${id}`, entry)
  return data
}

export const deleteEntry = async (id: number): Promise<void> => {
  await api.delete(`/api/entries/${id}`)
}

// ── Projects ─────────────────────────────────────────────

export const getProjects = async (status?: ProjectStatus): Promise<ProjectType[]> => {
  const { data } = await api.get<ProjectType[]>('/api/projects', { params: status ? { status } : undefined })
  return data
}

export const createProject = async (name: string): Promise<ProjectType> => {
  const { data } = await api.post<ProjectType>('/api/projects', { name })
  return data
}

export const updateProject = async (id: number, updates: Partial<ProjectType>): Promise<ProjectType> => {
  const { data } = await api.put<ProjectType>(`/api/projects/${id}`, updates)
  return data
}

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/api/projects/${id}`)
}

// ── Tags ──────────────────────────────────────────────────

export const getTags = async (status?: ProjectStatus): Promise<TagType[]> => {
  const { data } = await api.get<TagType[]>('/api/tags', { params: status ? { status } : undefined })
  return data
}

export const createTag = async (name: string): Promise<TagType> => {
  const { data } = await api.post<TagType>('/api/tags', { name })
  return data
}

export const updateTag = async (id: number, updates: Partial<TagType>): Promise<TagType> => {
  const { data } = await api.put<TagType>(`/api/tags/${id}`, updates)
  return data
}
