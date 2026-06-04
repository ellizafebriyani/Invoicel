export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  tax: number
  amount: number
}

export interface BrandSettings {
  logo: string | null
  theme: number
  font: string
  accentColor: string
  accentTextColor: string
  backgroundColor: string
  textColor: string
  alternateRowColor: string
  qrisEnabled: boolean
  showQrisOnInvoice: boolean
  qrisData: string | null
  showDurationColumn: boolean
}

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  paymentTerms: string
  poNumber: string

  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  companyTaxId: string

  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string

  currency: string
  items: InvoiceItem[]
  notes: string
  terms: string

  adjustments: Adjustment[]
}

export interface Adjustment {
  id: string
  label: string
  type: 'percentage' | 'fixed'
  value: number
}

export interface ThemePreset {
  accent: string
  accentText: string
  bg: string
  text: string
  tableHeader: string
  totalBg: string
  tableRowAlt: string
}

export const themePresets: ThemePreset[] = [
  { accent: '#2563eb', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#2563eb', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
  { accent: '#059669', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#059669', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
  { accent: '#dc2626', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#dc2626', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
  { accent: '#7c3aed', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#7c3aed', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
  { accent: '#d97706', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#d97706', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
  { accent: '#0891b2', accentText: '#ffffff', bg: '#ffffff', text: '#18181b', tableHeader: '#e11d48', totalBg: '#f4f4f5', tableRowAlt: '#fafafa' },
]

export const currencies = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
]

export const fonts = [
  'Inter', 'Outfit', 'Space Grotesk', 'Roboto', 'Lato', 'Nunito',
  'Raleway', 'Playfair Display', 'Poppins', 'Dancing Script',
  'Pacifico', 'Caveat', 'Sacramento', 'Great Vibes',
]
