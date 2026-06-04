import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { Adjustment, BrandSettings, currencies, InvoiceData, InvoiceItem } from '../types'
import { v4 } from '../utils'

interface InvoiceFormProps {
  invoice: InvoiceData
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceData>>
  brand: BrandSettings
}

export default function InvoiceForm({ invoice, setInvoice, brand }: InvoiceFormProps) {
  const { t } = useLang()
  const f = t.form

  const update = (field: keyof InvoiceData, value: any) =>
    setInvoice((prev) => ({ ...prev, [field]: value }))

  const addItem = () => {
    const newItem: InvoiceItem = { id: v4(), description: '', quantity: 1, rate: 0, tax: 0, amount: 0 }
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const removeItem = (id: string) =>
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }))

  const updateItem = (id: string, field: keyof InvoiceItem, value: number | string) => {
    setInvoice((prev) => {
      const items = prev.items.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate' || field === 'tax') {
          const qty = field === 'quantity' ? Number(value) : item.quantity
          const rate = field === 'rate' ? Number(value) : item.rate
          const tax = field === 'tax' ? Number(value) : item.tax
          const subtotal = qty * rate
          updated.amount = subtotal + subtotal * (tax / 100)
        }
        return updated
      })
      return { ...prev, items }
    })
  }

  const addAdjustment = () => {
    const adj: Adjustment = { id: v4(), label: '', type: 'fixed', value: 0 }
    setInvoice((prev) => ({ ...prev, adjustments: [...prev.adjustments, adj] }))
  }

  const updateAdjustment = (id: string, field: keyof Adjustment, value: any) =>
    setInvoice((prev) => ({
      ...prev,
      adjustments: prev.adjustments.map((a) => a.id === id ? { ...a, [field]: value } : a),
    }))

  const removeAdjustment = (id: string) =>
    setInvoice((prev) => ({ ...prev, adjustments: prev.adjustments.filter((a) => a.id !== id) }))

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const totalTax = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate * (item.tax / 100), 0)
  const total = subtotal + totalTax

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 96, padding: 16 }}>

      {/* Invoice Details */}
      <FormSection icon={<IconCalendar />} title={f.invoiceDetails}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label={f.invoiceNo}>
            <input type="text" value={invoice.invoiceNumber}
              onChange={(e) => update('invoiceNumber', e.target.value)}
              style={inputStyle} placeholder="INV-001" />
          </FormField>
          <FormField label={f.currency}>
            <div style={{ position: 'relative' }}>
              <select value={invoice.currency}
                onChange={(e) => update('currency', e.target.value)}
                style={{ ...inputStyle, appearance: 'none', paddingRight: 32 }}>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.code}</option>
                ))}
              </select>
              <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </FormField>
          <FormField label={f.invoiceDate}>
            <input type="date" value={invoice.invoiceDate}
              onChange={(e) => update('invoiceDate', e.target.value)}
              style={inputStyle} />
          </FormField>
          <FormField label={f.dueDate}>
            <input type="date" value={invoice.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              style={inputStyle} />
          </FormField>
        </div>
      </FormSection>

      {/* Company */}
      <FormSection icon={<IconBuilding />} title={f.yourCompany}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormField label={f.companyName}>
            <input type="text" value={invoice.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              style={inputStyle} placeholder={f.companyNamePlaceholder} />
          </FormField>
          <FormField label={f.address}>
            <textarea value={invoice.companyAddress}
              onChange={(e) => update('companyAddress', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              rows={2} placeholder={f.companyAddressPlaceholder} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label={f.email}>
              <input type="email" value={invoice.companyEmail}
                onChange={(e) => update('companyEmail', e.target.value)}
                style={inputStyle} placeholder={f.companyEmailPlaceholder} />
            </FormField>
            <FormField label={f.phone}>
              <input type="text" value={invoice.companyPhone}
                onChange={(e) => update('companyPhone', e.target.value)}
                style={inputStyle} placeholder={f.companyPhonePlaceholder} />
            </FormField>
          </div>
          <FormField label={f.taxId}>
            <input type="text" value={invoice.companyTaxId}
              onChange={(e) => update('companyTaxId', e.target.value)}
              style={inputStyle} placeholder={f.taxIdPlaceholder} />
          </FormField>
        </div>
      </FormSection>

      {/* Bill To */}
      <FormSection icon={<IconUser />} title={f.billTo}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormField label={f.clientName}>
            <input type="text" value={invoice.clientName}
              onChange={(e) => update('clientName', e.target.value)}
              style={inputStyle} placeholder={f.clientNamePlaceholder} />
          </FormField>
          <FormField label={f.clientAddress}>
            <textarea value={invoice.clientAddress}
              onChange={(e) => update('clientAddress', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              rows={2} placeholder={f.clientAddressPlaceholder} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label={f.email}>
              <input type="email" value={invoice.clientEmail}
                onChange={(e) => update('clientEmail', e.target.value)}
                style={inputStyle} placeholder={f.clientEmailPlaceholder} />
            </FormField>
            <FormField label={f.phone}>
              <input type="text" value={invoice.clientPhone}
                onChange={(e) => update('clientPhone', e.target.value)}
                style={inputStyle} placeholder={f.clientPhonePlaceholder} />
            </FormField>
          </div>
        </div>
      </FormSection>

      {/* Line Items */}
      <FormSection icon={<IconList />} title={f.lineItems}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {invoice.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f9 100%)',
                  border: '1px solid #ebebf0', borderRadius: 16, padding: 14,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 8,
                      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: 'white',
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.item}</span>
                  </div>
                  {invoice.items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        fontSize: 11, fontWeight: 600, color: '#f87171',
                        padding: '3px 10px', borderRadius: 8,
                        background: 'rgba(248,113,113,0.08)',
                        border: '1px solid rgba(248,113,113,0.15)',
                        cursor: 'pointer',
                      }}
                    >{f.remove}</button>
                  )}
                </div>

                {/* Description */}
                <input
                  type="text" value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  style={{ ...inputStyle, background: 'white' }}
                  placeholder={f.descriptionPlaceholder} />

                {/* Qty / Rate / Tax / Total */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: f.qty, field: 'quantity' as keyof InvoiceItem, value: item.quantity },
                    { label: f.rate, field: 'rate' as keyof InvoiceItem, value: item.rate },
                    { label: f.taxPct, field: 'tax' as keyof InvoiceItem, value: item.tax },
                  ].map(({ label, field, value }) => (
                    <div key={field}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                      <input type="number" value={value}
                        onChange={(e) => updateItem(item.id, field, e.target.value)}
                        style={{ ...inputStyle, background: 'white', padding: '8px 10px' }}
                        min="0" />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{f.itemTotal}</div>
                    <div style={{
                      height: 38, display: 'flex', alignItems: 'center',
                      background: 'linear-gradient(135deg, #7c3aed08, #a78bfa08)',
                      border: '1px solid rgba(167,139,250,0.25)',
                      borderRadius: 10, padding: '0 10px',
                      fontSize: 12, fontWeight: 800, color: '#7c3aed',
                      overflow: 'hidden',
                    }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Item */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={addItem}
            style={{
              width: '100%', padding: 12,
              border: '2px dashed #e4e4e7', borderRadius: 14,
              fontSize: 13, fontWeight: 600, color: '#a1a1aa',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.color = '#7c3aed'
              e.currentTarget.style.background = 'rgba(124,58,237,0.04)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e4e4e7'
              e.currentTarget.style.color = '#a1a1aa'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {f.addItem}
          </motion.button>

          {/* Running total */}
          {invoice.items.length > 0 && (
            <div style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed10, #a78bfa08)',
              border: '1px solid rgba(167,139,250,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.estimatedTotal}</div>
                <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 1 }}>{f.subtotalPlusTax}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>
                {total.toLocaleString('id-ID')}
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Adjustments */}
      <FormSection icon={<IconSliders />} title={f.adjustments}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence>
            {invoice.adjustments.map((adj) => (
              <motion.div key={adj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="text" value={adj.label}
                  onChange={(e) => updateAdjustment(adj.id, 'label', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} placeholder={f.adjustmentLabelPlaceholder} />
                <div style={{ position: 'relative' }}>
                  <select value={adj.type}
                    onChange={(e) => updateAdjustment(adj.id, 'type', e.target.value)}
                    style={{ ...inputStyle, width: 72, appearance: 'none', paddingRight: 20 }}>
                    <option value="fixed">Fixed</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                <input type="number" value={adj.value}
                  onChange={(e) => updateAdjustment(adj.id, 'value', parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, width: 72 }} min="0" />
                <button onClick={() => removeAdjustment(adj.id)} style={{
                  width: 34, height: 42, borderRadius: 10,
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)',
                  color: '#f87171', fontSize: 18, cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={addAdjustment}
            style={{
              width: '100%', padding: 10,
              border: '2px dashed #e4e4e7', borderRadius: 12,
              fontSize: 12, fontWeight: 600, color: '#a1a1aa',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.color = '#a1a1aa' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {f.addAdjustment}
          </motion.button>
        </div>
      </FormSection>

      {/* Notes & Terms */}
      <FormSection icon={<IconDoc />} title={f.notesTerms}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormField label={f.notes}>
            <textarea value={invoice.notes}
              onChange={(e) => update('notes', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              rows={3}
              placeholder={f.notesPlaceholder} />
          </FormField>
          <FormField label={f.terms}>
            <textarea value={invoice.terms}
              onChange={(e) => update('terms', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }}
              rows={2}
              placeholder={f.termsPlaceholder} />
          </FormField>
        </div>
      </FormSection>

    </div>
  )
}

/* ── Shared style ── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#f4f4f6', border: '1px solid #e4e4e7',
  borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#18181b',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

/* ── Sub-components ── */
function FormSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', borderRadius: 20,
      border: '1px solid #ebebf0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 16px', borderBottom: '1px solid #f4f4f8',
        background: 'linear-gradient(180deg, #fefefe 0%, #f9f9fb 100%)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124,58,237,0.25)', color: 'white', flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b', letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {children}
    </div>
  )
}

/* ── Icons ── */
function IconCalendar() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}
function IconBuilding() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function IconUser() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function IconList() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
}
function IconSliders() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
}
function IconDoc() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
}