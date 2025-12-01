import React from 'react'
import { motion } from 'framer-motion'
import Logo from '../assets/logo.svg'
import LogoPng from '../assets/logo.png'

/*
  TopBanner
  - Barra superior con logo y navegación flotante.
  - Sticky con blur + glow.
  - Usa Framer Motion para aparecer con un pequeño slide y fade.
*/
export default function TopBanner(){
  return (
    <motion.header className="top-banner" initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}}>
      <div className="logo" aria-hidden>
        {/* Logo SVG inyectado: se puede reemplazar por una imagen real */}
        <img src={Logo} alt="Pandor-AI logo" />
      </div>

      <nav className="nav-links" aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <a href="#miembros">Miembros</a>
      </nav>
      <div className="logo-right" aria-hidden>
        <img src={LogoPng} alt="Pandor-AI logo" />
      </div>
    </motion.header>
  )
}
