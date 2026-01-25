import api from './client'
import type { Project, ProjectCreate, ProjectUpdate } from '../types'

export const projectsApi = {
  list: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects')
    return data
  },

  get: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`)
    return data
  },

  create: async (project: ProjectCreate): Promise<Project> => {
    const { data } = await api.post('/projects', project)
    return data
  },

  update: async (id: string, project: ProjectUpdate): Promise<Project> => {
    const { data } = await api.put(`/projects/${id}`, project)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },

  validate: async (id: string): Promise<ValidationResult> => {
    const { data } = await api.post(`/projects/${id}/validate`)
    return data
  },
}

export interface ValidationResult {
  flags: ValidationFlag[]
  blocking_count: number
  warning_count: number
  info_count: number
  can_export: boolean
}

export interface ValidationFlag {
  code: string
  category: string
  severity: 'info' | 'warning' | 'blocking'
  message: string
  suggestion?: string
  field_name?: string
  document_id?: string
  is_resolved: boolean
  is_acknowledged: boolean
}

