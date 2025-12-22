import api from './client'
import type { Extraction, ExtractedField, FieldUpdate } from '../types'

export const extractionsApi = {
  getByDocument: async (documentId: string): Promise<Extraction> => {
    const { data } = await api.get(`/extractions/document/${documentId}`)
    return data
  },

  getFields: async (documentId: string): Promise<ExtractedField[]> => {
    const { data } = await api.get(`/extractions/document/${documentId}/fields`)
    return data
  },

  updateField: async (fieldId: string, update: FieldUpdate): Promise<ExtractedField> => {
    const { data } = await api.put(`/extractions/field/${fieldId}`, update)
    return data
  },

  confirmField: async (fieldId: string): Promise<ExtractedField> => {
    const { data } = await api.post(`/extractions/field/${fieldId}/confirm`)
    return data
  },

  confirmAllFields: async (documentId: string): Promise<{ confirmed_count: number }> => {
    const { data } = await api.post(`/extractions/document/${documentId}/confirm-all`)
    return data
  },
}

