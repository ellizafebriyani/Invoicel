import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { BrandSettings, fonts, themePresets } from '../types'

interface BrandSettingsPanelProps {
  brand: BrandSettings
  setBrand: React.Dispatch<React.SetStateAction<BrandSettings>>
}

export default function BrandSettingsPanel({ brand, setBrand }: BrandSettingsPanelProps) {
  const { t } = useLang()
  const b = t.brand

  const update = (field: keyof BrandSettings, value: any) =>
    setBrand((prev) => ({ ...prev, [field]: value }))

  const applyPreset = (idx: number) => {
    const preset = themePresets[idx]
    setBrand((prev) => ({
      ...prev,
      theme: idx,
      accentColor: preset.accent,
      accentTextColor: preset.accentText,
      backgroundColor: preset.bg,
      textColor: preset.text,
      alternateRowColor: preset.tableRowAlt,
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => update('logo', reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 96 }}>

      {/* Logo Upload */}
      <PanelCard icon={<IconImage />} title={b.companyLogo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {brand.logo ? (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', border: '1px solid #e4e4e7', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={brand.logo} alt={b.logoAlt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <button
                onClick={() => update('logo', null)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#ef4444', border: '2px solid white',
                  color: 'white', fontSize: 12, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >×</button>
            </div>
          ) : (
            <label style={{
              width: 72, height: 72, borderRadius: 16,
              border: '2px dashed #e4e4e7', background: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', gap: 4, flexShrink: 0,
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.background = '#f5f3ff' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.background = '#fafafa' }}
            >
              <IconImage size={18} color="#c4b5fd" />
              <span style={{ fontSize: 9, color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.04em' }}>UPLOAD</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b', marginBottom: 2 }}>{b.companyLogo}</div>
            <div style={{ fontSize: 11, color: '#a1a1aa', lineHeight: 1.5 }}>
              {b.logoUploadHint.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 ? <br /> : null}</span>
              ))}
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Theme Presets */}
      <PanelCard icon={<IconPalette />} title={b.colorTheme}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{b.preset}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {themePresets.map((preset, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => applyPreset(idx)}
                title={`Preset ${idx + 1}`}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: preset.accent,
                  border: brand.theme === idx ? '3px solid #18181b' : '3px solid transparent',
                  boxShadow: brand.theme === idx ? '0 0 0 2px white, 0 0 0 4px #18181b' : '0 2px 8px rgba(0,0,0,0.12)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {brand.theme === idx && (
                  <svg style={{ position: 'absolute', inset: 0, margin: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={preset.accentText || 'white'} strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>

          {/* Color editors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ColorField label={b.accentColor} value={brand.accentColor} onChange={(v) => update('accentColor', v)} />
            <ColorField label={b.accentText} value={brand.accentTextColor} onChange={(v) => update('accentTextColor', v)} />
            <ColorField label={b.background} value={brand.backgroundColor} onChange={(v) => update('backgroundColor', v)} />
            <ColorField label={b.textColor} value={brand.textColor} onChange={(v) => update('textColor', v)} />
            <ColorField label={b.altRow} value={brand.alternateRowColor} onChange={(v) => update('alternateRowColor', v)} />
          </div>
        </div>
      </PanelCard>

      {/* Font */}
      <PanelCard icon={<IconType />} title={b.typography}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{b.fontFamily}</div>
          <div style={{ position: 'relative' }}>
            <select
              value={brand.font}
              onChange={(e) => update('font', e.target.value)}
              style={{
                width: '100%', appearance: 'none',
                padding: '10px 36px 10px 14px',
                background: '#f4f4f6', border: '1px solid #e4e4e7',
                borderRadius: 12, fontSize: 14,
                fontFamily: `'${brand.font}', sans-serif`,
                fontWeight: 500, color: '#18181b', cursor: 'pointer',
                outline: 'none',
              }}
            >
              {fonts.map((f) => (
                <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>
              ))}
            </select>
            <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div style={{ marginTop: 10, padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f2' }}>
            <span style={{ fontFamily: `'${brand.font}', sans-serif`, fontSize: 14, color: '#52525b' }}>
              {b.fontPreview}
            </span>
          </div>
        </div>
      </PanelCard>

      {/* QRIS */}
      <PanelCard icon={<IconQR />} title={b.qris}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Enable toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>{b.enableQris}</div>
              <div style={{ fontSize: 11, color: '#a1a1aa', marginTop: 1 }}>{b.enableQrisDesc}</div>
            </div>
            <Toggle checked={brand.qrisEnabled} onChange={(v) => update('qrisEnabled', v)} />
          </div>

          <AnimatePresence>
            {brand.qrisEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Show on invoice toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9f9fb', borderRadius: 10, border: '1px solid #f0f0f2' }}>
                    <span style={{ fontSize: 12, color: '#52525b', fontWeight: 500 }}>{b.showOnInvoice}</span>
                    <Toggle checked={brand.showQrisOnInvoice} onChange={(v) => update('showQrisOnInvoice', v)} />
                  </div>

                  {/* QRIS Upload */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{b.qrisImage}</div>
                    {brand.qrisData ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ width: 100, height: 100, borderRadius: 12, border: '1px solid #e4e4e7', overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={brand.qrisData} alt="QRIS" style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }} />
                        </div>
                        <button
                          onClick={() => update('qrisData', null)}
                          style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 20, height: 20, borderRadius: '50%',
                            background: '#ef4444', border: '2px solid white',
                            color: 'white', fontSize: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >×</button>
                        <div style={{ fontSize: 10, color: '#a1a1aa', marginTop: 4 }}>{b.qrisPreview}</div>
                      </div>
                    ) : (
                      <label style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 16px', borderRadius: 12,
                        border: '2px dashed #e4e4e7', background: '#fafafa',
                        cursor: 'pointer', fontSize: 12, color: '#71717a', fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#71717a' }}
                      >
                        <IconQR size={14} color="currentColor" />
                        {b.uploadQris}
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) { const r = new FileReader(); r.onload = () => update('qrisData', r.result); r.readAsDataURL(file) }
                        }} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PanelCard>
    </div>
  )
}

/* ── Sub-components ── */

function PanelCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', borderRadius: 20,
      border: '1px solid #ebebf0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', borderBottom: '1px solid #f4f4f8',
        background: 'linear-gradient(180deg, #fefefe 0%, #f9f9fb 100%)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124,58,237,0.25)', flexShrink: 0,
          color: 'white',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#18181b', letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e4e4e7', padding: 2, cursor: 'pointer', background: 'transparent' }} />
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', background: '#f4f4f6', border: '1px solid #e4e4e7', borderRadius: 10, fontSize: 12, fontWeight: 500, color: '#18181b', outline: 'none', fontFamily: 'monospace' }} />
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: checked ? '#7c3aed' : '#e4e4e7',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s', flexShrink: 0,
        boxShadow: checked ? '0 0 0 3px rgba(124,58,237,0.2)' : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s',
      }} />
    </button>
  )
}

/* ── Icons ── */
function IconImage({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" fill={color} stroke="none" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
    </svg>
  )
}
function IconPalette({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" />
      <path strokeLinecap="round" d="M6.5 17.5l2.5-2.5" />
    </svg>
  )
}
function IconType({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  )
}
function IconQR({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <line x1="14" y1="14" x2="14" y2="14" strokeWidth="3" strokeLinecap="round" />
      <line x1="21" y1="14" x2="21" y2="14" strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="21" x2="14" y2="21" strokeWidth="3" strokeLinecap="round" />
      <line x1="21" y1="21" x2="21" y2="21" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}