import React from 'react'
import { motion } from 'framer-motion'
import FuturisticBackground from './FuturisticBackground'
import boletinPdf from '../assets/boletin_pandor_ai.pdf'

/*
  HeroSection
  - Título holográfico, subtítulo y CTA con borde neón.
  - Incluye animación inicial usando Framer Motion.
  - El fondo con partículas ya está en FuturisticBackground; aquí sólo se agregan overlays.
*/
export default function HeroSection(){
  return (
    <section id="inicio" className="hero">
      <div className="hero-inner">
        <div>
          <motion.h1 className="hero-title" initial={{opacity:0, y:18}} animate={{opacity:1,y:0}} transition={{duration:0.9, delay:0.12}}>
            Pandor-AI
          </motion.h1>

          <motion.p className="hero-sub" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.9, delay:0.25}}>
            Explorando horizontes de conocimiento con interfaces futuristas y asistencias inteligentes. Diseño editorial de alto contraste y experiencias inmersivas.
          </motion.p>

          <motion.button
            className="cta-btn"
            whileHover={{scale:1.03}}
            whileTap={{scale:0.98}}
            transition={{type:'spring',stiffness:300}}
            onClick={(e)=>{
              try{
                const btn = e.currentTarget
                btn.setAttribute('disabled','true')
                // create anchor to download bundled asset
                const a = document.createElement('a')
                a.href = boletinPdf
                a.download = 'boletin_pandor_ai.pdf'
                document.body.appendChild(a)
                a.click()
                a.remove()
              }catch(err){
                console.error(err)
                alert('Error al descargar el PDF: '+(err.message||err))
              }finally{
                const btn = document.querySelector('.cta-btn')
                btn && btn.removeAttribute('disabled')
              }
            }}
          >
            Descargar boletín (PDF)
          </motion.button>
        </div>

        <div>
          {/* Tarjeta lateral con resumen y efecto holográfico */}
          <div className="info-block" style={{minHeight:220,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontWeight:700,color:'var(--cyan)'}}>Boletín Pandor-AI</div>
            <div style={{marginTop:8,color:'rgba(230,233,239,0.8)'}}>Un compendio mensual sobre IA, ética, y transformaciones en educación y cultura.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
