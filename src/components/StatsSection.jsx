import React, {useEffect, useRef} from 'react'
import { motion } from 'framer-motion'

/*
  StatsSection
  - Muestra 3 estadísticas con contador ascendente animado.
  - Contiene componente interno <StatCard /> reutilizable.
  - Tooltips y micro-animaciones aplicadas con CSS y Framer Motion.
*/
function useCountUp(target, duration=1200){
  const ref = useRef(null)
  useEffect(()=>{
    let start = 0
    const end = target
    const startTime = performance.now()
    const step = (now)=>{
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.floor(progress * (end - start) + start)
      if(ref.current) ref.current.textContent = value + '%'
      if(progress < 1){
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  },[target,duration])
  return ref
}

function StatCard({value,label,delay=0}){
  const ref = useCountUp(value, 1200)
  return (
    <motion.div className="stat-card" initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} transition={{delay}} whileHover={{scale:1.03}} whileTap={{scale:0.98}}>
      <div className="stat-number" ref={ref}>0%</div>
      <div className="stat-label">{label}</div>
      <div className="stat-card__glow" aria-hidden />
    </motion.div>
  )
}

export default function StatsSection(){
  return (
    <section id="estadisticas" className="stats-section">
      <div className="stats-grid">
        {/* Usar textos EXACTOS provistos */}
        <StatCard value={68} label={`68% – Instituciones con IA`} delay={0.12} />
        <StatCard value={40} label={`40% – Reducción de tiempos`} delay={0.22} />
        <StatCard value={74} label={`74% – Aumento de productividad`} delay={0.32} />
      </div>
    </section>
  )
}
