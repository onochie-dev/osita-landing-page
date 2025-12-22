export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  reporting_period?: ReportingPeriod
  reporting_year?: string
  declarant_info?: DeclarantInfo
  installation_info?: InstallationInfo
  emission_factor_source: string
  emission_factor_value?: string
  canonical_data?: CanonicalData
  documents: DocumentSummary[]
  created_at: string
  updated_at: string
}

export interface ProjectCreate {
  name: string
  description?: string
  reporting_period?: ReportingPeriod
  reporting_year?: string
  declarant_info?: DeclarantInfo
  installation_info?: InstallationInfo
  emission_factor_source?: string
  emission_factor_value?: string
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  status?: ProjectStatus
}

export type ProjectStatus = 'draft' | 'needs_review' | 'export_ready' | 'exported'
export type ReportingPeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export interface DeclarantInfo {
  identification_number: string
  name: string
  role?: string
  address?: Address
}

export interface InstallationInfo {
  name?: string
  identifier?: string
  country?: string
  address?: Address
  economic_activity?: string
}

export interface Address {
  country: string
  sub_division?: string
  city: string
  street?: string
  street_additional_line?: string
  number?: string
  postcode?: string
  po_box?: string
}

export interface DocumentSummary {
  id: string
  filename: string
  status: string
}

export interface Document {
  id: string
  project_id: string
  filename: string
  original_filename: string
  status: DocumentStatus
  page_count?: number
  detected_language?: string
  language_override?: string
  ocr_confidence?: number
  ocr_processing_time?: number
  file_size?: number
  error_message?: string
  created_at: string
  updated_at: string
}

export interface DocumentUpload {
  id: string
  filename: string
  original_filename: string
  status: DocumentStatus
  file_size?: number
  message: string
}

export type DocumentStatus = 
  | 'uploaded'
  | 'ocr_processing'
  | 'ocr_complete'
  | 'ocr_failed'
  | 'extraction_processing'
  | 'extraction_complete'
  | 'extraction_failed'
  | 'reviewed'

export interface Extraction {
  id: string
  document_id: string
  version: number
  is_current: boolean
  model_name?: string
  processing_time?: number
  canonical_data?: CanonicalData
  fields: ExtractedField[]
  created_at: string
}

export interface ExtractedField {
  id: string
  field_name: string
  field_type: FieldType
  value?: string
  unit?: string
  normalized_value?: string
  normalized_unit?: string
  confidence?: number
  status: FieldStatus
  source_page?: number
  source_quote?: string
  original_value?: string
  edit_reason?: string
  created_at: string
  updated_at: string
}

export interface FieldUpdate {
  value?: string
  unit?: string
  status?: FieldStatus
  edit_reason?: string
}

export type FieldType = 
  | 'consumption'
  | 'unit'
  | 'period_start'
  | 'period_end'
  | 'billing_period'
  | 'meter_id'
  | 'site_address'
  | 'supplier'
  | 'total_amount'
  | 'currency'
  | 'line_item'
  | 'total_consumption'
  | 'other'

export type FieldStatus = 'unconfirmed' | 'confirmed' | 'corrected' | 'manual'

export interface CanonicalData {
  reporting_period?: string
  reporting_year?: string
  declarant?: DeclarantInfo
  installation?: InstallationInfo
  electricity_bills: ElectricityBill[]
  total_electricity_mwh?: number
  indirect_emissions: IndirectEmission[]
  total_indirect_emissions_tco2?: number
  extraction_version?: string
  last_updated?: string
}

export interface ElectricityBill {
  document_id: string
  supplier?: string
  billing_period?: {
    start_date?: string
    end_date?: string
    period_string?: string
  }
  site_address?: string
  meter_ids: string[]
  line_items: LineItem[]
  total_consumption?: {
    value: number
    unit: string
    normalized_mwh: number
  }
  total_amount?: number
  currency?: string
}

export interface LineItem {
  description?: string
  consumption?: {
    value: number
    unit: string
    normalized_mwh: number
  }
  meter_id?: string
  amount?: number
  currency?: string
}

export interface IndirectEmission {
  electricity_consumed_mwh: number
  emission_factor: number
  emission_factor_source: string
  emissions_tco2: number
  period_start?: string
  period_end?: string
}

export interface ValidationFlag {
  id: string
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

