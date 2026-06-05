import { motion } from 'framer-motion'

type AnimationVariant = 'fadeInUp' | 'fadeInDown' | 'scaleIn' | 'slideInLeft' | 'slideInRight' | 'fadeIn'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  amount?: number
}

// Variantes de animación
const variantDefs = {
  fadeInUp:      { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  fadeInDown:    { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  scaleIn:       { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  slideInLeft:   { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  slideInRight:  { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  fadeIn:        { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

// ── ScrollReveal ─────────────────────────────────────────────
// Usa whileInView + viewport={{ once: true }} en lugar del patrón
// useInView + animate, que es susceptible a re-triggers cuando el
// componente padre actualiza estado con frecuencia (ej: typewriter).
export default function ScrollReveal({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.65,
  className = '',
  amount = 0.2,
}: ScrollRevealProps) {
  const { hidden, visible } = variantDefs[variant]
  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerContainer ─────────────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
  amount?: number
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
  delayChildren = 0.1,
  amount = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerItem ──────────────────────────────────────────────
interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
