import React, { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingScreen.css'

/*
  LoadingScreen
  - Fullscreen loading overlay with cyberpunk visuals.
  - Props:
    - isAppReady (boolean): signal from parent that app finished loading
    - minDurationMs (number): minimum time the loader remains visible
    - onFinish (fn): optional callback when loader fully hidden
*/
export default function LoadingScreen({ isAppReady=false, minDurationMs=900, onFinish }){
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const startRef = useRef(Date.now())
  const reduce = useReducedMotion()

  const statuses = [
    'Inicializando sistema…',
    'Informando tu conexión al semillero...',
    'Informando tu conexión al semillero...',
    'Estableciendo protocolos…',
    'Listo.'
  ]

  // rotate status text periodically until app signals ready
  useEffect(()=>{
    if(reduce) return // respect reduced motion
    const iv = setInterval(()=>{
      setStatusIndex(i=> Math.min(i+1, statuses.length-1))
    }, 1000)
    return ()=> clearInterval(iv)
  },[reduce])

  // react to isAppReady: ensure min duration then exit
  useEffect(()=>{
    if(!isAppReady) return
    const elapsed = Date.now() - startRef.current
    const wait = Math.max(0, minDurationMs - elapsed)
    const t = setTimeout(()=>{
      // set final status briefly
      setStatusIndex(statuses.length-1)
      // start exit animation
      setTimeout(()=> setExiting(true), 180)
    }, wait)
    return ()=> clearTimeout(t)
  },[isAppReady,minDurationMs])

  // after exit animation, unmount
  useEffect(()=>{
    if(!exiting) return
    const t = setTimeout(()=>{
      setVisible(false)
      onFinish && onFinish()
    }, 820) // match CSS exit duration
    return ()=> clearTimeout(t)
  },[exiting,onFinish])

  if(!visible) return null

  return (
    <motion.div className={`loading-screen ${exiting? 'ls-exit': ''}`} aria-hidden={false} role="status" aria-live="polite">
      <div className="ls-overlay" />

      <div className="ls-stage">
        <motion.div className="ls-core" animate={ reduce ? {} : { rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}>
          <div className="ls-core-inner" />
        </motion.div>

        <div className="ls-circuits" aria-hidden>
          <span className="circuit c1" />
          <span className="circuit c2" />
          <span className="circuit c3" />
        </div>

        <svg className="ls-scan-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <g className="scan-lines">
            {Array.from({length:8}).map((_,i)=>(
              <line key={i} x1="0" x2="100" y1={`${10+i*11}`} y2={`${10+i*11}`} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
            ))}
          </g>
        </svg>

        <div className="ls-status">
          <span className="ls-status-text">{statuses[statusIndex]}</span>
          <span className="ls-status-glitch" aria-hidden>{statuses[statusIndex]}</span>
        </div>

        <div className="ls-particles" aria-hidden />
      </div>
    </motion.div>
  )
}
