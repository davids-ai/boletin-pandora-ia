import React, { useEffect, useRef } from 'react'

/*
  FuturisticBackground (Canvas)
  - Implementa partículas y líneas tipo "circuitos" usando un canvas nativo.
  - No depende de librerías externas; esto evita fallos en `npm install`.
  - Ajusta `NUM_PARTICLES` y `MAX_DISTANCE` para cambiar densidad y conexiones.
*/
export default function FuturisticBackground(){
  const canvasRef = useRef(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const NUM_PARTICLES = Math.max(24, Math.floor((w*h) / 6000)) // density relative to viewport
    const MAX_DISTANCE = Math.min(180, Math.max(80, (w+h)/12))

    const palette = ['#00d4ff', '#9b59ff', '#00ffd5']

    // generar partículas
    const particles = new Array(NUM_PARTICLES).fill(0).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      r: Math.random()*1.6+0.4,
      c: palette[Math.floor(Math.random()*palette.length)]
    }))

    let raf = null

    const draw = ()=>{
      ctx.clearRect(0,0,w,h)

      // faded background glow
      ctx.fillStyle = 'rgba(3,3,9,0.12)'
      ctx.fillRect(0,0,w,h)

      // draw lines
      for(let i=0;i<particles.length;i++){
        const p = particles[i]
        for(let j=i+1;j<particles.length;j++){
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if(dist < MAX_DISTANCE){
            const alpha = 0.18 * (1 - dist / MAX_DISTANCE)
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p.x,p.y)
            ctx.lineTo(q.x,q.y)
            ctx.stroke()
          }
        }
      }

      // draw particles
      for(const p of particles){
        ctx.beginPath()
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6)
        g.addColorStop(0, p.c)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fill()
      }

      // update
      for(const p of particles){
        p.x += p.vx
        p.y += p.vy
        // small wrapping
        if(p.x < -10) p.x = w + 10
        if(p.x > w+10) p.x = -10
        if(p.y < -10) p.y = h + 10
        if(p.y > h+10) p.y = -10
      }

      raf = requestAnimationFrame(draw)
    }

    // resize handling
    const onResize = ()=>{
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', onResize)
    draw()

    return ()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  },[])

  // pointer-events none para que no capture eventos
  return (
    <canvas ref={canvasRef} style={{position:'fixed',inset:0,width:'100vw',height:'100vh',zIndex:0,pointerEvents:'none',opacity:0.95}} aria-hidden />
  )
}
