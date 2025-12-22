import api from './client'

export const exportsApi = {
  downloadExcel: async (projectId: string): Promise<Blob> => {
    const { data } = await api.post(`/exports/project/${projectId}/excel`, null, {
      responseType: 'blob',
    })
    return data
  },

  getXml: async (projectId: string): Promise<string> => {
    const { data } = await api.post(`/exports/project/${projectId}/xml`)
    return data
  },

  previewXml: async (projectId: string): Promise<{ xml: string }> => {
    const { data } = await api.get(`/exports/project/${projectId}/preview-xml`)
    return data
  },

  downloadZip: async (projectId: string): Promise<Blob> => {
    const { data } = await api.post(`/exports/project/${projectId}/zip`, null, {
      responseType: 'blob',
    })
    return data
  },

  getHistory: async (projectId: string): Promise<ExportRecord[]> => {
    const { data } = await api.get(`/exports/project/${projectId}/history`)
    return data
  },
}

export interface ExportRecord {
  id: string
  format: string
  filename: string
  generated_at: string
  warnings_count: string
  blocking_flags_count: string
}

