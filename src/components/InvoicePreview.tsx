import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { BrandSettings, currencies, InvoiceData } from '../types'

const A4_PX = 794
const A4_HEIGHT = 1123

export function InvoicePage({
  invoice,
  brand,
  pageItems,
  pageNum,
  itemsPerPage,
}: {
  invoice: InvoiceData
  brand: BrandSettings
  pageItems: InvoiceData['items']
  pageNum: number
  itemsPerPage: number
}) {
  const { t } = useLang()
  const inv = t.invoice

  const currencySymbol =
    currencies.find((c) => c.code === invoice.currency)?.symbol || invoice.currency
  const fontFamily = `'${brand.font}', Arial, Helvetica, sans-serif`

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const totalTax = invoice.items.reduce((sum, item) => {
    const sub = item.quantity * item.rate
    return sum + sub * (item.tax / 100)
  }, 0)

  let adjustmentsTotal = 0
  const adjustmentDetails: { label: string; amount: number }[] = []
  for (const adj of invoice.adjustments) {
    let amount = 0
    if (adj.type === 'fixed') amount = adj.value
    else amount = subtotal * (adj.value / 100)
    adjustmentsTotal += amount
    adjustmentDetails.push({
      label: adj.label || (adj.type === 'fixed' ? 'Adjustment' : 'Discount %'),
      amount,
    })
  }

  const total = subtotal + totalTax + adjustmentsTotal

  return (
    <div
      style={{
        width: `${A4_PX}px`,
        minHeight: `${A4_HEIGHT}px`,
        padding: '56px 76px',
        backgroundColor: brand.backgroundColor,
        color: brand.textColor,
        fontFamily,
        fontSize: '10px',
        lineHeight: '1.5',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        letterSpacing: 'normal',
        wordSpacing: 'normal',
      }}
    >
      <div style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            {brand.logo && (
              <img
                src={brand.logo}
                alt="Logo"
                crossOrigin="anonymous"
                style={{ maxHeight: '50px', maxWidth: '120px', marginBottom: '8px', objectFit: 'contain', display: 'block' }}
              />
            )}
            <div style={{ fontSize: '18px', fontWeight: 700, color: brand.textColor, marginBottom: '2px' }}>
              {invoice.companyName || 'Your Company'}
            </div>
            <div style={{ fontSize: '9px', color: brand.textColor + '99', lineHeight: '1.6' }}>
              {invoice.companyAddress && <div>{invoice.companyAddress}</div>}
              <div>
                {invoice.companyEmail && <span>{invoice.companyEmail} </span>}
                {invoice.companyPhone && <span>| {invoice.companyPhone}</span>}
              </div>
              {invoice.companyTaxId && <div>Tax ID: {invoice.companyTaxId}</div>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: brand.accentColor, letterSpacing: '-0.5px', marginBottom: '4px' }}>
              {inv.invoice}
            </div>
            <div style={{ fontSize: '10px', color: brand.textColor + '99', lineHeight: '1.8' }}>
              <div>#{invoice.invoiceNumber}</div>
              <div>{inv.date}: {invoice.invoiceDate}</div>
              <div>{inv.due}: {invoice.dueDate}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '8px', fontWeight: 600, color: brand.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              {inv.billTo}
            </div>
            <div style={{ fontWeight: 600, fontSize: '11px', marginBottom: '2px' }}>
              {invoice.clientName || 'Client Name'}
            </div>
            <div style={{ fontSize: '9px', color: brand.textColor + '99', lineHeight: '1.6' }}>
              {invoice.clientAddress && <div>{invoice.clientAddress}</div>}
              <div>
                {invoice.clientEmail && <span>{invoice.clientEmail} </span>}
                {invoice.clientPhone && <span>| {invoice.clientPhone}</span>}
              </div>
            </div>
          </div>
          {invoice.poNumber && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8px', fontWeight: 600, color: brand.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {inv.poNumber}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 500 }}>{invoice.poNumber}</div>
            </div>
          )}
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ backgroundColor: brand.accentColor }}>
              {['#', inv.description, inv.qty, inv.rate, inv.tax, inv.amount].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '8px 10px',
                    textAlign: i === 0 || i === 1 ? 'left' : i === 2 ? 'center' : 'right',
                    color: brand.accentTextColor,
                    fontSize: '8px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: i === 1 ? '40%' : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '20px 10px', textAlign: 'center', color: brand.textColor + '60', fontSize: '10px' }}>
                  {inv.noItems}
                </td>
              </tr>
            ) : (
              pageItems.map((item, idx) => {
                const itemSub = item.quantity * item.rate
                const itemAmount = itemSub + itemSub * (item.tax / 100)
                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: idx % 2 === 1 ? brand.alternateRowColor : 'transparent',
                      borderBottom: `1px solid ${brand.textColor}10`,
                    }}
                  >
                    <td style={{ padding: '7px 10px', color: brand.textColor + '80', fontSize: '9px' }}>
                      {idx + 1 + (pageNum - 1) * itemsPerPage}
                    </td>
                    <td style={{ padding: '7px 10px', fontWeight: 500, fontSize: '10px' }}>
                      {item.description || '—'}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'center', color: brand.textColor + 'cc' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'right', color: brand.textColor + 'cc' }}>
                      {currencySymbol}{item.rate.toLocaleString()}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'right', color: brand.textColor + 'cc' }}>
                      {item.tax > 0 ? `${item.tax}%` : '—'}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600 }}>
                      {currencySymbol}{itemAmount.toLocaleString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginLeft: 'auto', width: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
            <span style={{ color: brand.textColor + '99', fontSize: '9px' }}>{inv.subtotal}</span>
            <span style={{ fontWeight: 500, fontSize: '10px' }}>{currencySymbol}{subtotal.toLocaleString()}</span>
          </div>
          {totalTax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span style={{ color: brand.textColor + '99', fontSize: '9px' }}>{inv.taxLabel}</span>
              <span style={{ fontWeight: 500, fontSize: '10px' }}>{currencySymbol}{totalTax.toLocaleString()}</span>
            </div>
          )}
          {adjustmentDetails.map((adj, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span style={{ color: brand.textColor + '99', fontSize: '9px' }}>{adj.label}</span>
              <span style={{ fontWeight: 500, fontSize: '10px' }}>
                {adj.amount >= 0 ? '+' : ''}{currencySymbol}{adj.amount.toLocaleString()}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: brand.accentColor + '15', borderRadius: '4px', marginTop: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '11px', color: brand.textColor }}>{inv.totalLabel}</span>
            <span style={{ fontWeight: 800, fontSize: '12px', color: brand.accentColor }}>
              {currencySymbol}{total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div style={{ marginTop: '24px', borderTop: `1px solid ${brand.textColor}15`, paddingTop: '12px' }}>
            {invoice.notes && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '8px', fontWeight: 600, color: brand.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{inv.notes}</div>
                <div style={{ fontSize: '9px', color: brand.textColor + 'cc', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{invoice.notes}</div>
              </div>
            )}
            {invoice.terms && (
              <div>
                <div style={{ fontSize: '8px', fontWeight: 600, color: brand.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{inv.terms}</div>
                <div style={{ fontSize: '9px', color: brand.textColor + 'cc', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{invoice.terms}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QRIS */}
      {brand.qrisEnabled && brand.showQrisOnInvoice && brand.qrisData && (
        <div style={{ textAlign: 'right', marginTop: '12px' }}>
          <div style={{ display: 'inline-block' }}>
            <div style={{ fontSize: '7px', fontWeight: 600, color: brand.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', textAlign: 'center' }}>
              {inv.scanToPay}
            </div>
            <img
              src={brand.qrisData}
              alt="QRIS"
              crossOrigin="anonymous"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'crisp-edges',
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: '7px', color: brand.textColor + '40', marginTop: '8px', paddingTop: '4px', borderTop: `1px solid ${brand.textColor}10` }}>
        {inv.invoice} #{invoice.invoiceNumber} | {invoice.invoiceDate}
      </div>
    </div>
  )
}

// =================================================================
// InvoicePreview — scaling wrapper untuk tampilan di layar
// =================================================================
export default function InvoicePreview({
  invoice,
  brand,
  exportRef,
}: {
  invoice: InvoiceData
  brand: BrandSettings
  exportRef?: React.RefObject<HTMLDivElement>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const recalcScale = useCallback(() => {
    if (!containerRef.current) return
    const w = containerRef.current.offsetWidth
    if (w <= 0) return
    setScale(w / A4_PX)
  }, [])

  useEffect(() => {
    recalcScale()
    const ro = new ResizeObserver(recalcScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [recalcScale])

  const itemsPerPage = brand.showDurationColumn ? 12 : 14
  const pages = invoice.items.length === 0 ? 1 : Math.ceil(invoice.items.length / itemsPerPage)
  const pageItemsList: InvoiceData['items'][] = []
  for (let i = 0; i < pages; i++) {
    pageItemsList.push(invoice.items.slice(i * itemsPerPage, (i + 1) * itemsPerPage))
  }
  const totalContentHeight = pages * A4_HEIGHT + (pages - 1) * 16

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${A4_PX}px`,
          height: `${totalContentHeight * scale}px`,
        }}
      >
        <div ref={exportRef}>
          {pageItemsList.map((items, i) => (
            <div key={i} style={i < pages - 1 ? { marginBottom: '16px' } : {}}>
              <InvoicePage
                invoice={invoice}
                brand={brand}
                pageItems={items}
                pageNum={i + 1}
                itemsPerPage={itemsPerPage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}