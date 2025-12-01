import React, { useEffect, useState } from 'react'
import { speakNow } from '../utils/tts'
import './TTSWidget.css'

export default function TTSWidget(){
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(()=>{
    // Do NOT call playWelcomeOnce here to avoid duplicate playback.
    // Instead, check sessionStorage after a short delay — App will attempt autoplay once.
    let mounted = true
    const check = setTimeout(()=>{
      try{
        const played = sessionStorage.getItem('pandor_tts_played_v1')
        if(!mounted) return
        if(played){ setStatus('played'); setVisible(false) }
        else { setStatus('manual'); setVisible(true) }
      }catch(e){ if(mounted){ setStatus('manual'); setVisible(true) } }
    }, 1400)
    return ()=>{ mounted = false; clearTimeout(check) }
  },[])

  const handlePlay = async ()=>{
    setStatus('playing')
    const r = await speakNow()
    setStatus(r && r.played ? 'played' : 'error')
    // Keep the widget visible after manual play per request
  }

  if(!visible) return null

  return (
    <div className="tts-widget" role="region" aria-label="Control de audio de bienvenida">
      <button className="tts-widget__btn" onClick={handlePlay} title="Reproducir mensaje de bienvenida">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M5 3v18l14-9L5 3z" fill="currentColor" />
        </svg>
        <span className="tts-widget__label">Reproducir bienvenida</span>
      </button>
    </div>
  )
}
