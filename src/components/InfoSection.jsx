import React, { useMemo } from 'react'
import HorizonSection from './HorizonSection'
import { motion } from 'framer-motion'

/*
  InfoSection (REPLACED)
  - Nueva sección: "Impacto de la IA en Colombia (2025)"
  - Contiene: introducción (4-6 líneas), Gráfico 1 (Bar Chart con datos nacionales),
    Gráfico 2 (conjunto de Donut/Progress rings para la UNAD), y un análisis narrativo.
  - Los gráficos son SVG y no requieren librerías externas. Se usan animaciones con Framer Motion.
  - Colores y tipografía usan variables CSS definidas en `globals.css` para mantener la estética futurista.
*/

// Datos (usados exactamente como se proporcionó)
const nacionalData = [
  { label: 'Estudiantes universitarios que usan IA', value: 91 },
  { label: 'Profesionales que conocen herramientas de IA', value: 95 },
  { label: 'Profesionales con formación formal en IA', value: 10 },
  { label: 'Empleados que usan IA en su trabajo', value: 80 }
]

const unadData = [
  { label: 'Estudiantes UNAD que usan IA para estudiar', value: 83 },
  { label: 'Docentes UNAD que integran IA en sus clases', value: 42 },
  { label: 'Procesos administrativos de la UNAD automatizados con IA', value: 35 },
  { label: 'Programas de la UNAD que incluyen IA en su currículo', value: 27 }
]

// BarChart: SVG bars with gradient and motion
function BarChart({data, height=240}){
  const max = useMemo(()=>Math.max(...data.map(d=>d.value)),[data])
  const padding = 32
  const barGap = 18
  // increase logical svg width so bars have more horizontal room
  const svgWidth = 900
  const barWidth = Math.max(36, Math.floor((svgWidth - (data.length-1)*barGap - padding*2) / data.length))

  // helper to split long labels into multiple lines (maxWordsPerLine)
  // Use 2 words per line to keep labels short and legible under each bar
  const splitLabel = (label, maxWordsPerLine=2) => {
    const words = label.split(' ')
    const lines = []
    for(let i=0;i<words.length;i+=maxWordsPerLine){
      lines.push(words.slice(i,i+maxWordsPerLine).join(' '))
    }
    return lines
  }

  // increase height slightly to give more room for multi-line labels
  const svgHeight = Math.max(height, 300)
  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet" style={{width:'100%',height:'auto',minWidth:420}}>
      <defs>
        <linearGradient id="gBar" x1="0" x2="1">
          <stop offset="0" stopColor="var(--electric-blue)" />
          <stop offset="1" stopColor="var(--neon-purple)" />
        </linearGradient>
      </defs>

      {/* background subtle */}
      <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="transparent" />

      {data.map((d,i)=>{
        const x = padding + i*(barWidth + barGap)
        const barH = (d.value / max) * (height - 80)
        const y = height - 40 - barH
        const lines = splitLabel(d.label, 3)
        const labelY = svgHeight - 12 - (lines.length - 1) * 18
        return (
          <g key={i}>
            <motion.rect x={x} y={y} width={barWidth} height={barH}
              fill={`url(#gBar)`}
              rx={8}
              initial={{scaleY:0}}
              style={{transformOrigin: `${x + barWidth/2}px ${svgHeight - 40}px`, transformBox: 'fill-box'}}
              animate={{scaleY:1}}
              transition={{duration:0.9, delay:0.12 + i*0.08, ease:'circOut'}}
            />

            <text x={x + barWidth/2} y={labelY} fontFamily="Orbitron, Inter, sans-serif" fontSize={10} fill="rgba(230,233,239,0.85)" textAnchor="middle">
              {lines.map((ln,li)=> (
                <tspan key={li} x={x + barWidth/2} dy={li===0?0:16}>{ln}</tspan>
              ))}
            </text>

            <text x={x + barWidth/2} y={y - 8} fontFamily="Orbitron, Inter, sans-serif" fontSize={14} fill="var(--cyan)" fontWeight={700} textAnchor="middle">
              {d.value}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// DonutProgress: circular progress ring for each metric (used for UNAD data)
function DonutProgress({value, size=120, stroke=12, index=0}){
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference * (value / 100)
  const gap = circumference - dash

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}>
      <defs>
        <linearGradient id={`gDonut${index}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--electric-blue)" />
          <stop offset="1" stopColor="var(--neon-purple)" />
        </linearGradient>
      </defs>

      <g transform={`translate(${size/2}, ${size/2})`}>
        {/* background ring */}
        <circle r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />

        {/* animated arc */}
        <motion.circle r={radius} fill="none" stroke={`url(#gDonut${index})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={circumference}
          initial={{strokeDashoffset: circumference}}
          animate={{strokeDashoffset: circumference - dash}}
          transition={{duration:0.9, delay:0.1 + index*0.08, ease:'circOut'}}
        />

        {/* center label */}
        <text y={4} textAnchor="middle" fontFamily="Orbitron, Inter, sans-serif" fontSize={18} fill="var(--cyan)" fontWeight={700}>{value}%</text>
      </g>
    </svg>
  )
}

export default function InfoSection(){
  return (
    <section id="boletin" className="info-section">
      {/* Sección nueva 1: La Inteligencia Artificial en la Transformación del Conocimiento Contemporáneo */}
      <motion.div className="info-block" initial={{opacity:0, y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
        <div className="info-title">La Inteligencia Artificial en la Transformación del Conocimiento Contemporáneo</div>
        <p className="info-paragraph" style={{marginTop:12}}>
          En las últimas décadas, la inteligencia artificial (IA) ha pasado de ser una aspiración conceptual a convertirse en un agente activo de transformación social y tecnológica. Este boletín, concebido como un espacio de reflexión informada, busca no solo presentar avances recientes, sino también situarlos dentro de un marco analítico que permita comprender mejor su impacto.
        </p>
        <p className="info-paragraph" style={{marginTop:8}}>
          Hoy, los sistemas inteligentes participan en procesos tan diversos como el diagnóstico clínico, la gestión de infraestructuras críticas y la creación de contenido digital a gran escala. Esta expansión plantea preguntas relevantes sobre ética, regulación y apropiación tecnológica, temas que abordamos a lo largo de estas secciones. Más que un simple compendio informativo, este documento pretende ser una invitación a explorar las dinámicas que configuran el ecosistema digital actual.
        </p>
      </motion.div>

      {/* Sección nueva 2: IA Generativa */}
      <motion.div className="info-block" initial={{opacity:0, y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7, delay:0.06}}>
        <div className="info-title">IA Generativa: Arquitecturas Emergentes y sus Implicaciones Socio-Tecnológicas</div>
        <p className="info-paragraph" style={{marginTop:12}}>
          La consolidación de modelos generativos avanzados —particularmente aquellos basados en arquitecturas transformadoras— ha redefinido las fronteras de lo posible en materia de automatización cognitiva. Estas tecnologías, capaces de producir texto, imágenes, código e incluso simulaciones complejas, han introducido una nueva etapa en la interacción hombre-máquina.
        </p>
        <p className="info-paragraph" style={{marginTop:8}}>
          Más allá de su capacidad para generar contenido, la IA generativa está impulsando una reconfiguración profunda de los flujos productivos. Organizaciones de todos los sectores incorporan estos sistemas para optimizar tareas, reducir la carga operativa y enriquecer la toma de decisiones estratégicas. No obstante, este crecimiento rápido también exige revisar las condiciones de transparencia, interpretabilidad y equidad algorítmica. La pregunta ya no es si estas tecnologías transformarán la estructura del trabajo, sino cómo lo harán y bajo qué marcos conceptuales podremos analizarlas críticamente.
        </p>
      </motion.div>

      {/* Sección existente: Impacto de la IA en Colombia (2025) */}
      <motion.div className="info-block" initial={{opacity:0, y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
        <div className="info-title">Impacto de la IA en Colombia (2025)</div>

        {/* Introductory text (4-6 lines) */}
        <p className="info-paragraph" style={{marginTop:12}}>
          La Inteligencia Artificial está remodelando los procesos educativos, la productividad laboral y la transformación digital en Colombia. Desde aulas que integran herramientas inteligentes hasta procesos administrativos automatizados, la IA impulsa velocidad y escalabilidad. Este compuesto visual muestra la adopción general y ejemplos concretos en la UNAD, revelando tanto avances en uso como brechas en formación formal.
        </p>

        {/* Charts layout: responsive grid to avoid overlap and stacking issues */}
        <div className="charts-grid">
          {/* Gráfico 1 — Bar Chart (Adopción General) */}
          <div style={{background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',padding:18,borderRadius:12,boxShadow:'var(--card-glow)',border:'1px solid rgba(255,255,255,0.03)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:'Orbitron, Inter, sans-serif',fontSize:16,color:'var(--neon-purple)'}}>Adopción General de IA en Colombia</div>
              <div style={{fontSize:12,color:'rgba(230,233,239,0.6)'}}>2025 — Encuesta compuesta</div>
            </div>
            <div style={{marginTop:12}}>
              <BarChart data={nacionalData} />
            </div>
          </div>

          {/* Gráfico 2 — Donut Progress for UNAD */}
          <div style={{background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',padding:18,borderRadius:12,boxShadow:'var(--card-glow)',border:'1px solid rgba(255,255,255,0.03)'}}>
            <div style={{fontFamily:'Orbitron, Inter, sans-serif',fontSize:16,color:'var(--neon-purple)'}}>IA en la UNAD</div>
            <div className="unad-grid">
              {unadData.map((u,i)=> (
                <div key={i} style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center',padding:8}}>
                  <div style={{width:84,height:84,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <DonutProgress value={u.value} index={i} />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--electric-blue)'}}>{u.label}</div>
                    <div style={{fontSize:12,color:'rgba(230,233,239,0.75)'}}>{u.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Narrativa analítica (8-10 líneas) */}
        <div style={{marginTop:18}} className="info-paragraph">
          <strong style={{color:'var(--neon-purple)'}}>Análisis:</strong> Los datos indican una adopción notablemente alta de herramientas de IA entre estudiantes y profesionales (91% y 95% respectivamente), lo que sugiere una penetración cultural y de uso muy amplia. Sin embargo, la formación formal en IA permanece limitada (10%), lo que plantea riesgos de uso impropio o asimetrías de conocimiento. En el contexto de la UNAD, la mayoría de estudiantes usan IA para estudiar (83%), pero la incorporación por parte del cuerpo docente y en los programas aún es parcial (42% y 27%), y la automatización administrativa está en etapas tempranas (35%).

          Estas cifras combinadas muestran un ecosistema donde el uso práctico y la curiosidad superan la formación estructurada; la brecha formativa es una oportunidad estratégica para políticas educativas y desarrollo curricular. Instituciones y empresas deben priorizar programas de capacitación y certificación, así como marcos éticos y de gobernanza para asegurar adopción responsable y equitativa.
        </div>
      </motion.div>

        {/* Horizon / Future Outlook section inserted here as requested */}
        <HorizonSection />
    </section>
  )
}
