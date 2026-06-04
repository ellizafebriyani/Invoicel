import { motion } from 'framer-motion'

interface LandingPageProps {
  onGetStarted: () => void
}

const features = [
  { icon: '⚡', label: 'Instant PDF Export' },
  { icon: '🎨', label: 'Custom Branding' },
  { icon: '📱', label: 'All Devices' },
  { icon: '🔒', label: 'No Data Stored' },
]

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen landing-bg landing-grid flex flex-col items-center justify-center relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="landing-glow w-[600px] h-[400px] -top-40 left-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse, rgba(108,99,255,0.28) 0%, transparent 70%)' }} />
      <div className="landing-glow w-[400px] h-[400px] bottom-0 right-0 opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(255,124,92,0.20) 0%, transparent 70%)' }} />
      <div className="landing-glow w-[300px] h-[300px] top-1/4 -left-20 opacity-40"
        style={{ background: 'radial-gradient(ellipse, rgba(108,99,255,0.18) 0%, transparent 70%)' }} />

      {/* Top nav hint */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>
        </span>
      </motion.div>

      {/* Main content */}
      <div className="max-w-3xl px-6 text-center relative z-10 flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <span className="badge-free">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            100% Free
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="landing-title mb-6"
          style={{ fontSize: 'clamp(48px, 10vw, 96px)', lineHeight: 1.0 }}
        >
          Invoicel
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, maxWidth: '480px', lineHeight: 1.6, marginBottom: '8px' }}
        >
          A modern invoice maker app that is free, fast, and optimized for all devices.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginBottom: '40px' }}
        >
          Generate professional invoices in seconds, anytime and anywhere.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="btn-cta"
          >
            Start
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {features.map((f, i) => (
            <motion.span
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="feature-chip"
            >
              <span>{f.icon}</span>
              {f.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(9,9,15,0.8), transparent)' }} />

      {/* Footer copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-10"
      >
        <span style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
          </svg>
          {new Date().getFullYear()} Invoicel · Made with
          <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,100,100,0.7)" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          by <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em' }}>El</span>
        </span>
      </motion.div>

    </div>
  )
}