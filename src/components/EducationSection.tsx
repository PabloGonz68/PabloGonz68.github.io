import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Award, Calendar, MapPin, BookOpen, Shield } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { useApp } from '../lib/AppContext'

// ── Utilities ─────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  'Java':         '#f87171',
  'Spring Boot':  '#4ade80',
  'REST API':     '#60a5fa',
  'Backend':      '#c084fc',
}

const EDU_EXTRAS = [
  { icon: Shield, color: '#22d3ee', typeKey: 'official', current: true, institution: 'IES Rafael Alberti', location: 'Cádiz, España', period: 'Sept. 2025 — Jun. 2026' },
  { icon: GraduationCap, color: '#4f8bff', typeKey: 'official', current: false, institution: 'IES Rafael Alberti', location: 'Cádiz, España', period: 'Sept. 2024 — Jun. 2025' },
  { icon: BookOpen, color: '#a855f7', typeKey: 'official', current: false, institution: 'Staff Formación', location: 'Cádiz, España', period: 'Sept. 2022 — Jun. 2024' },
]

const CERT_EXTRAS = [
  { platform: 'Udemy', color: '#f97316', tags: ['Java', 'Spring Boot', 'REST API'] },
  { platform: 'Udemy', color: '#4ade80', tags: ['Java', 'Spring Boot', 'Backend'] },
]

// ── Education card ────────────────────────────────────────────
function EduCard({ item, i, currentText, typeText }: { item: any; i: number; currentText: string; typeText: string }) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <ScrollReveal variant="fadeInUp" delay={i * 0.12}>
      <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
        {/* Line segment + dot */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          flexShrink: 0, width: '36px', marginRight: '20px',
        }}>
          <motion.div
            animate={item.current ? {
              boxShadow: [`0 0 0px ${item.color}00`, `0 0 12px ${item.color}60`, `0 0 0px ${item.color}00`],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: `radial-gradient(circle, ${item.color}20, ${item.color}08)`,
              border: `2px solid ${item.color}${item.current ? '80' : '40'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1, position: 'relative',
            }}
          >
            <Icon size={15} style={{ color: item.color }} />
          </motion.div>
          {/* Connector line */}
          <div style={{
            flex: 1, width: '1px', minHeight: '24px',
            background: `linear-gradient(180deg, ${item.color}30, rgba(79,139,255,0.1))`,
            marginTop: '4px',
          }} />
        </div>

        {/* Card */}
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{ borderColor: hovered ? `${item.color}35` : 'var(--card-border)' }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.25 }}
          style={{
            flex: 1, marginBottom: '28px',
            background: hovered ? `${item.color}08` : 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderLeft: `3px solid ${item.color}`,
            borderRadius: '14px', padding: '18px 20px',
            transition: 'background 0.3s, border-color 0.3s',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              {/* Badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                color: item.color, background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                padding: '2px 8px', borderRadius: '999px', marginBottom: '6px',
              }}>
                {item.current && (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: item.color, flexShrink: 0,
                    }}
                  />
                )}
                {item.current ? currentText : typeText}
              </span>

              <h3 style={{
                fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)',
                lineHeight: 1.35, marginBottom: '4px',
              }}>
                {item.degree}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.color }}>
                  {item.institution}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-subtle)', fontSize: '0.72rem' }}>
                  <MapPin size={10} />{item.location}
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--text-subtle)', fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)', flexShrink: 0,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '4px 10px',
            }}>
              <Calendar size={10} />{item.period}
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.8rem', color: 'var(--text-muted)',
            lineHeight: 1.65, marginTop: '10px',
          }}>
            {item.description}
          </p>
        </motion.div>
      </div>
    </ScrollReveal>
  )
}

// ── Cert card ─────────────────────────────────────────────────
function CertCard({ cert, i }: { cert: any; i: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <ScrollReveal variant="fadeInUp" delay={i * 0.1}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4, boxShadow: `0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px ${cert.color}25` }}
        transition={{ duration: 0.25 }}
        style={{
          background: hovered ? `${cert.color}06` : 'var(--card-bg)',
          border: `1px solid ${hovered ? cert.color + '30' : 'var(--card-border)'}`,
          borderRadius: '14px', padding: '18px 20px',
          transition: 'background 0.3s, border-color 0.3s',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '80px',
          background: `radial-gradient(circle at top right, ${cert.color}15, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
            fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
            color: cert.color, background: `${cert.color}15`,
            border: `1px solid ${cert.color}30`,
            padding: '2px 9px', borderRadius: '999px',
          }}>
            <Award size={9} />{cert.platform}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
            color: 'var(--text-subtle)',
          }}>
            <Calendar size={10} />{cert.date}
          </span>
        </div>

        <p style={{
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.4, marginBottom: '12px',
        }}>
          {cert.title}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {cert.tags.map((tag: string) => (
            <span key={tag} style={{
              fontSize: '0.65rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
              padding: '2px 9px', borderRadius: '999px',
              color: TAG_COLORS[tag] ?? '#93c5fd',
              background: `${TAG_COLORS[tag] ?? '#60a5fa'}12`,
              border: `1px solid ${TAG_COLORS[tag] ?? '#60a5fa'}28`,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

// ── Section header ────────────────────────────────────────────
function SH({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        color: 'rgba(79,139,255,0.55)', letterSpacing: '0.3em',
        textTransform: 'uppercase', marginBottom: '10px',
      }}>{label}</p>
      <h2 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800,
        fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
        letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: '12px',
      }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.65 }}>{sub}</p>
    </motion.div>
  )
}

// ── Column header ─────────────────────────────────────────────
function ColHeader({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '32px',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          color, marginBottom: '1px',
        }}>{label}</p>
        <div style={{ height: '2px', width: '32px', background: `linear-gradient(90deg, ${color}60, transparent)`, borderRadius: '1px' }} />
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function EducationSection() {
  const { t } = useApp()

  const EDUCATION = t.education.list.map((edu, i) => ({
    ...edu,
    ...EDU_EXTRAS[i],
  }))

  const CERTS = t.education.certList.map((cert, i) => ({
    ...cert,
    ...CERT_EXTRAS[i],
  }))

  return (
    <section
      id="education"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, var(--bg-base), var(--bg-surface))',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: '400px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <SH
          label={t.education.label}
          title={t.education.title}
          sub={t.education.sub}
        />

        {/* Two-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px 64px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>

          {/* ── Left: Academic */}
          <div>
            <ColHeader icon={GraduationCap} label={t.education.academic} color="#4f8bff" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {EDUCATION.map((item, i) => (
                <EduCard key={item.degree} item={item} i={i} currentText={t.education.current} typeText={t.education.official} />
              ))}
            </div>
          </div>

          {/* ── Right: Certifications */}
          <div>
            <ColHeader icon={Award} label={t.education.certs} color="#f97316" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CERTS.map((cert, i) => (
                <CertCard key={cert.title} cert={cert} i={i} />
              ))}

              {/* CTA — add more */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: '8px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px dashed var(--card-border)',
                  textAlign: 'center',
                }}
              >
                <p style={{
                  fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                  color: 'var(--text-subtle)', letterSpacing: '0.06em',
                }}>
                  {t.education.continuousLearning}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
