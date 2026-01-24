import api from './client'
import type { Document, DocumentUpload } from '../types'

export const documentsApi = {
  upload: async (projectId: string, files: File[]): Promise<DocumentUpload[]> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    const { data } = await api.post(`/documents/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  listByProject: async (projectId: string): Promise<{ documents: Document[], total: number }> => {
    const { data } = await api.get(`/documents/project/${projectId}`)
    return data
  },

  get: async (id: string): Promise<Document> => {
    const { data } = await api.get(`/documents/${id}`)
    return data
  },

  getOcr: async (id: string): Promise<OcrResult> => {
    const { data } = await api.get(`/documents/${id}/ocr`)
    return data
  },

  getPdfUrl: (id: string): string => {
    return `/api/documents/${id}/pdf`
  },

  reprocess: async (id: string): Promise<Document> => {
    const { data } = await api.post(`/documents/${id}/reprocess`)
    return data
  },

  setLanguage: async (id: string, language: string): Promise<void> => {
    await api.put(`/documents/${id}/language?language=${language}`)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`)
  },
}

export interface OcrResult {
  pages: {
    page_number: number
    markdown: string
    language?: string
  }[]
  page_count: number
  detected_language: string
  processing_time: number
  confidence: number
}

