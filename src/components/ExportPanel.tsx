import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { BrandSettings, InvoiceData, currencies } from '../types'
import InvoicePreview from './InvoicePreview'

interface ExportPanelProps {
  invoice: InvoiceData
  brand: BrandSettings
}

type ExportState = 'idle' | 'processing' | 'done' | 'error'

async function ensureFontLoaded(fontName: string) {
  if (!document.querySelector(`link[data-font="${fontName}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`
    link.setAttribute('data-font', fontName)
    document.head.appendChild(link)
  }
  try {
    await document.fonts.load(`700 16px '${fontName}'`)
    await document.fonts.load(`400 16px '${fontName}'`)
  } catch { /* fallback */ }
  await new Promise((r) => setTimeout(r, 300))
}

export default function ExportPanel({ invoice, brand }: ExportPanelProps) {
  const { t } = useLang()
  const ex = t.export

  const FORMAT_META = {
    pdf: { label: 'PDF', desc: ex.formatPdfDesc, ext: '.pdf', accent: '#dc2626', bg: '#fff1f2', icon: <IconPDF /> },
    jpg: { label: 'JPG', desc: ex.formatJpgDesc, ext: '.jpg', accent: '#2563eb', bg: '#eff6ff', icon: <IconIMG /> },
    png: { label: 'PNG', desc: ex.formatPngDesc, ext: '.png', accent: '#059669', bg: '#ecfdf5', icon: <IconPNG /> },
  }

  const [states, setStates] = useState<Record<string, ExportState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const exportRef = useRef<HTMLDivElement>(null)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = filename
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async (formatId: string) => {
    setStates((p) => ({ ...p, [formatId]: 'processing' }))
    setErrors((p) => ({ ...p, [formatId]: '' }))
    try {
      const element = exportRef.current
      if (!element) throw new Error(ex.exportElementNotFound)
      await ensureFontLoaded(brand.font)
      const imgs = element.querySelectorAll('img')
      await Promise.all(Array.from(imgs).map((img) => new Promise<void>((res) => {
        if (img.complete) res()
        else { img.onload = () => res(); img.onerror = () => res() }
      })))

      const clone = element.cloneNode(true) as HTMLElement
      clone.style.cssText = `position:fixed;top:-99999px;left:-99999px;transform:none;z-index:-1;width:${element.scrollWidth}px;height:${element.scrollHeight}px;`
      document.body.appendChild(clone)
      await new Promise((r) => setTimeout(r, 300))

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(clone, {
        scale: 3, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
        foreignObjectRendering: false,
        width: clone.scrollWidth, height: clone.scrollHeight,
      })
      document.body.removeChild(clone)

      if (canvas.width === 0 || canvas.height === 0) throw new Error(ex.canvasEmpty)
      const filename = `invoice-${invoice.invoiceNumber || 'export'}`

      if (formatId === 'pdf') {
        const { jsPDF } = await import('jspdf')
        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 3, canvas.height / 3] })
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 3, canvas.height / 3)
        pdf.save(`${filename}.pdf`)
        setStates((p) => ({ ...p, [formatId]: 'done' }))
        setTimeout(() => setStates((p) => ({ ...p, [formatId]: 'idle' })), 2500)
      } else {
        const mime = formatId === 'jpg' ? 'image/jpeg' : 'image/png'
        const quality = formatId === 'jpg' ? 0.95 : undefined
        canvas.toBlob((blob) => {
          if (!blob) {
            setErrors((p) => ({ ...p, [formatId]: `${ex.failCreate} ${formatId.toUpperCase()}` }))
            setStates((p) => ({ ...p, [formatId]: 'error' }))
            setTimeout(() => setStates((p) => ({ ...p, [formatId]: 'idle' })), 4000)
            return
          }
          downloadBlob(blob, `${filename}.${formatId}`)
          setStates((p) => ({ ...p, [formatId]: 'done' }))
          setTimeout(() => setStates((p) => ({ ...p, [formatId]: 'idle' })), 2500)
        }, mime, quality)
      }
    } catch (err: any) {
      console.error('Export error:', err)
      setErrors((p) => ({ ...p, [formatId]: err?.message || ex.exportFailed }))
      setStates((p) => ({ ...p, [formatId]: 'error' }))
      setTimeout(() => setStates((p) => ({ ...p, [formatId]: 'idle' })), 4000)
    }
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const totalTax = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate * (item.tax / 100), 0)
  const total = subtotal + totalTax
  const sym = currencies.find((c) => c.code === invoice.currency)?.symbol || invoice.currency

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 96 }}>

      {/* Summary Card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #ebebf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f4f4f8', background: 'linear-gradient(180deg, #fefefe, #f9f9fb)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b' }}>{ex.invoiceSummary}</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: ex.invoiceNo, value: invoice.invoiceNumber || '—' },
              { label: ex.client, value: invoice.clientName || '—' },
              { label: ex.itemCount, value: String(invoice.items.length) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #f0f0f2', paddingTop: 12, marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b' }}>{ex.total}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', marginRight: 2 }}>{sym}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#18181b', letterSpacing: '-0.03em' }}>{total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #ebebf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f4f4f8', background: 'linear-gradient(180deg, #fefefe, #f9f9fb)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b' }}>{ex.downloadInvoice}</span>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(Object.keys(FORMAT_META) as Array<keyof typeof FORMAT_META>).map((fmtId) => {
            const fmt = FORMAT_META[fmtId]
            const state = states[fmtId] || 'idle'
            const errMsg = errors[fmtId]
            const isDone = state === 'done'
            const isErr = state === 'error'
            const isProcessing = state === 'processing'

            return (
              <div key={fmtId}>
                <motion.button
                  whileTap={state === 'idle' ? { scale: 0.98 } : {}}
                  onClick={() => state === 'idle' && handleExport(fmtId)}
                  disabled={state !== 'idle'}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 14, border: 'none',
                    background: isDone ? '#f0fdf4' : isErr ? '#fff1f2' : isProcessing ? '#fafafa' : 'white',
                    boxShadow: state === 'idle' ? '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)' : `0 0 0 1.5px ${isDone ? '#86efac' : isErr ? '#fca5a5' : '#e4e4e7'}`,
                    cursor: state === 'idle' ? 'pointer' : isProcessing ? 'wait' : 'default',
                    textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { if (state === 'idle') { e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08), 0 0 0 1.5px ${fmt.accent}` } }}
                  onMouseLeave={(e) => { if (state === 'idle') { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)' } }}
                >
                  {/* Icon block */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: isDone ? '#059669' : isErr ? '#dc2626' : fmt.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}>
                    {isProcessing ? (
                      <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
                      </svg>
                    ) : isDone ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : isErr ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <span style={{ color: 'white' }}>{fmt.icon}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isErr ? '#dc2626' : isDone ? '#059669' : '#18181b', marginBottom: 2 }}>
                      {isDone ? ex.downloaded : isErr ? ex.downloadFailed : `${ex.downloadBtn} ${fmt.label}`}
                    </div>
                    <div style={{ fontSize: 11, color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isProcessing ? ex.processing : isDone ? `invoice-${invoice.invoiceNumber || 'export'}${fmt.ext}` : isErr ? ex.seeError : fmt.desc}
                    </div>
                  </div>

                  {state === 'idle' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4d4d8" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </motion.button>
                {isErr && errMsg && (
                  <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6, paddingLeft: 4 }}>{errMsg}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #ebebf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f4f4f8', background: 'linear-gradient(180deg, #fefefe, #f9f9fb)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b' }}>{ex.previewInvoice}</span>
        </div>
        <div style={{ padding: 16 }}>
          <InvoicePreview invoice={invoice} brand={brand} exportRef={exportRef} />
        </div>
      </div>

    </div>
  )
}

function IconPDF() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13h6M9 17h4" /></svg>
}
function IconIMG() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="white" stroke="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>
}
function IconPNG() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13v4M16 13v4M12 17v-4l-2 2 2-2 2 2" /></svg>
}