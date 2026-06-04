import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import BrandSettingsPanel from './components/BrandSettingsPanel'
import ExportPanel from './components/ExportPanel'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import LandingPage from './components/LandingPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './context/LanguageContext'
import { BrandSettings, InvoiceData, themePresets } from './types'
import { v4 } from './utils'

const defaultInvoice: InvoiceData = {
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  paymentTerms: 'Net 30',
  poNumber: '',
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyTaxId: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',
  currency: 'IDR',
  items: [{ id: v4(), description: '', quantity: 1, rate: 0, tax: 0, amount: 0 }],
  notes: '',
  terms: '',
  adjustments: [],
}

const defaultBrand: BrandSettings = {
  logo: null,
  theme: 0,
  font: 'DM Sans',
  accentColor: '#6c63ff',
  accentTextColor: '#ffffff',
  backgroundColor: '#ffffff',
  textColor: '#18181b',
  alternateRowColor: '#fafafa',
  qrisEnabled: false,
  showQrisOnInvoice: false,
  qrisData: null,
  showDurationColumn: false,
}

export type TabId = 'form' | 'brand' | 'export'

const TabIcon = ({ id }: { id: TabId }) => {
  if (id === 'form') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
  if (id === 'brand') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function AppContent() {
  const [showLanding, setShowLanding] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('form')
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('Invoicel_data')
    return saved ? JSON.parse(saved) : defaultInvoice
  })
  const [brand, setBrand] = useState<BrandSettings>(() => {
    const saved = localStorage.getItem('Invoicel_brand')
    if (saved) {
      const parsed = JSON.parse(saved)
      const theme = themePresets[parsed.theme] || themePresets[0]
      return { ...parsed, ...theme }
    }
    return defaultBrand
  })

  useEffect(() => {
    localStorage.setItem('Invoicel_data', JSON.stringify(invoice))
  }, [invoice])

  useEffect(() => {
    localStorage.setItem('Invoicel_brand', JSON.stringify(brand))
  }, [brand])

  const tabs: { id: TabId; label: string }[] = [
    { id: 'form', label: 'Invoice' },
    { id: 'brand', label: 'Brand' },
    { id: 'export', label: 'Export' },
  ]

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen" style={{ background: '#eeeef3' }}>

      {/* ============ DESKTOP LAYOUT (lg+) ============ */}
      <div className="hidden lg:flex h-screen overflow-hidden">

        {/* LEFT: Invoice Preview */}
        <div className="flex-1 flex flex-col preview-area overflow-hidden">

          {/* Preview Header */}
          <div className="app-brand-header shrink-0">
<div
  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
  onClick={() => setShowLanding(true)}
  title="Back to Home"
>
  <div className="brand-logo-mark">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  </div>

  <span
    style={{
      fontFamily: 'Syne, sans-serif',
      fontWeight: 700,
      fontSize: '15px',
      color: '#18181b',
      letterSpacing: '-0.02em',
    }}
  >
    Invoicel
  </span>
</div>

            {/* Language Switcher — desktop header */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <span className="live-badge">
                <span className="live-dot" />
                Live Preview
              </span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-10 flex items-start justify-center">
            <div className="w-full max-w-[620px] invoice-shadow rounded-2xl overflow-hidden">
              <InvoicePreview invoice={invoice} brand={brand} />
            </div>
          </div>
        </div>

        {/* RIGHT: Controls Panel */}
        <div className="w-[420px] xl:w-[460px] flex flex-col app-sidebar overflow-hidden shrink-0">

          {/* Tab Bar */}
          <div className="tab-bar flex shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="desktop-tab-indicator"
                    className="tab-indicator"
                  />
                )}
                <span style={{ marginBottom: '2px' }}>
                  <TabIcon id={tab.id} />
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'form' && (
                  <InvoiceForm invoice={invoice} setInvoice={setInvoice} brand={brand} />
                )}
                {activeTab === 'brand' && (
                  <BrandSettingsPanel brand={brand} setBrand={setBrand} />
                )}
                {activeTab === 'export' && (
                  <ExportPanel invoice={invoice} brand={brand} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ============ MOBILE LAYOUT (< lg) ============ */}
      <div className="lg:hidden min-h-screen pb-24">

        {/* Mobile Header with Language Switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'white', borderBottom: '1px solid #ebebf0',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="brand-logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#18181b', letterSpacing: '-0.02em' }}>
              Invoicel
            </span>
          </div>

          {/* Language Switcher — mobile header */}
          <LanguageSwitcher />
        </div>

        <div className="max-w-xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'form' && (
                <InvoiceForm invoice={invoice} setInvoice={setInvoice} brand={brand} />
              )}
              {activeTab === 'brand' && (
                <BrandSettingsPanel brand={brand} setBrand={setBrand} />
              )}
              {activeTab === 'export' && (
                <ExportPanel invoice={invoice} brand={brand} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="mobile-nav">
          <div className="max-w-xl mx-auto flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="tab-indicator"
                  />
                )}
                <TabIcon id={tab.id} />
                <span style={{ marginTop: '3px' }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}