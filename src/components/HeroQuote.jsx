import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './HeroQuote.css'

// HeroQuote
// - Componente que presenta el lema institucional con estilo cyber-futurista.
// - Usa Framer Motion para animación de entrada y respeta prefers-reduced-motion.
// - Incluye: gradiente holográfico en texto, destello radial, subrayado SVG animado, glow suave.

export default function HeroQuote(){
  const reduce = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="hero-quote" role="region" aria-label="Lema institucional — Pandor-AI" className="hero-quote">

      {/* Glow radial - capa visual detrás del texto */}
      <div className="hq-radial" aria-hidden />

      {/* Subtle holographic border */}
      <div className="hq-border" aria-hidden />

      <motion.div
        className="hero-quote__inner"
        initial={reduce ? false : 'hidden'}
        animate={reduce ? false : 'visible'}
        variants={containerVariants}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <blockquote className="hero-quote__text">
          “Innovación, Inteligencia Artificial y Proyección Social Universitaria”
        </blockquote>

        {/* SVG subrayado tecnológico animado */}
        <svg className="hero-quote__underline" viewBox="0 0 900 40" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="hqGrad" x1="0" x2="1">
              <stop offset="0" stopColor="var(--electric-blue)" />
              <stop offset="0.5" stopColor="var(--neon-purple)" />
              <stop offset="1" stopColor="var(--cyan)" />
            </linearGradient>
          </defs>
          <path className="underline-path" d="M30 18 C220 28, 680 8, 870 18" stroke="url(#hqGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>

      </motion.div>

      {/* tech flare - thin animated horizontal bar */}
      <div className="hq-flare" aria-hidden />

    </section>
  )
}
