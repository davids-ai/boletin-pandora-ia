import React from 'react'
import { motion } from 'framer-motion'

/*
  MembersSection
  - Sección al final de la página que muestra los miembros del Semillero Pandor-AI.
  - Estilo cyberpunk/futurista con bordes neón, glow y tipografía tecnológica.
  - Cada tarjeta muestra iniciales grandes, nombre completo y rol.
*/
const MEMBERS = [
  {code:'EJM', name:'Elizabeth Johana Montana Acevedo', role:'Líder de Semillero'},
  {code:'DRR', name:'Dario Rolando Rojas Lopez', role:'Líder de Estudiantes'},
  {code:'DSR', name:'David Stivel Rojas Lopez', role:'Miembro'},
  {code:'CMN', name:'Carlos Mauricio Neira Nonsoque', role:'Miembro'},
  {code:'YLM', name:'Yesica Lorena Maya Garcia', role:'Miembro'},
  {code:'AFM', name:'Andres Felipe Morales Vega', role:'Miembro'},
  {code:'AVR', name:'Angie Viviana Rodriguez Montañez', role:'Miembro'}
]

function MemberCard({m, index}){
  return (
    <motion.div className="member-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.06 + index*0.06}}>
      <div className="member-initials" aria-hidden>{m.code}</div>
      <div className="member-info">
        <div className="member-name">{m.name}</div>
        <div className="member-role">{m.role}</div>
      </div>
    </motion.div>
  )
}

export default function MembersSection(){
  return (
    <section id="miembros" className="members-section">
      <div className="info-title" style={{marginBottom:12}}>Miembros del Semillero Pandor-AI</div>

      <div className="member-grid">
        {MEMBERS.map((m,i)=> <MemberCard key={m.code} m={m} index={i} />)}
      </div>

    </section>
  )
}
