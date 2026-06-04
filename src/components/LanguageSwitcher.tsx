import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { Language } from '../i18n/translations'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'id', label: 'ID', flag: '🇮🇩' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: '#f4f4f6',
        borderRadius: 12,
        padding: 3,
        border: '1px solid #e4e4e7',
      }}
    >
      {options.map((opt) => {
        const active = lang === opt.code
        return (
          <motion.button
            key={opt.code}
            whileTap={{ scale: 0.93 }}
            onClick={() => setLang(opt.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              borderRadius: 9,
              border: 'none',
              background: active
                ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
                : 'transparent',
              color: active ? 'white' : '#71717a',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'all 0.2s',
              boxShadow: active ? '0 2px 8px rgba(124,58,237,0.25)' : 'none',
            }}
          >
            <span style={{ fontSize: 13 }}>{opt.flag}</span>
            {opt.label}
          </motion.button>
        )
      })}
    </div>
  )
}