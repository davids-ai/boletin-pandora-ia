// Utilities for Text-to-Speech (Web Speech API primary, responsiveVoice fallback)
const WELCOME_TEXT = 'Bienvenido al Boletín del Semillero de Investigación Pandor-AI, donde la innovación y el conocimiento convergen.'
const STORAGE_KEY = 'pandor_tts_played_v1'
const INPROGRESS_KEY = 'pandor_tts_inprogress_v1'
const INPROGRESS_TTL_MS = 8000 // consider in-progress stale after 8s

function setInprogressFlag(){
  try{ sessionStorage.setItem(INPROGRESS_KEY, String(Date.now())) }catch(e){}
}

function clearInprogressFlag(){
  try{ sessionStorage.removeItem(INPROGRESS_KEY) }catch(e){}
}

function isInprogressRecent(){
  try{
    const v = sessionStorage.getItem(INPROGRESS_KEY)
    if(!v) return false
    const ts = Number(v)
    if(isNaN(ts)) return false
    return (Date.now() - ts) < INPROGRESS_TTL_MS
  }catch(e){ return false }
}

function supportsSpeechSynthesis(){
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

function pickVoice(voices){
  if(!voices || !voices.length) return null
  // prefer es-CO, then any es-*, then any voice with 'Spanish' or 'es' in lang/name
  let v = voices.find(v=>v.lang === 'es-CO')
  if(v) return v
  v = voices.find(v=>v.lang && v.lang.startsWith('es'))
  if(v) return v
  v = voices.find(v=>/spanish/i.test(v.name) || /es-/.test(v.lang))
  return v || voices[0]
}

function speakWithWebSpeech(text){
  return new Promise((resolve, reject)=>{
    try{
      const synth = window.speechSynthesis
      let voices = synth.getVoices()

      const doSpeak = ()=>{
        voices = synth.getVoices() || voices
        const voice = pickVoice(voices)
        const u = new SpeechSynthesisUtterance(text)
        u.lang = (voice && voice.lang) || 'es-ES'
        if(voice) u.voice = voice
        u.rate = 1
        u.pitch = 1
        u.volume = 1
        let started = false
        u.onstart = ()=>{ started = true }
        u.onend = ()=>{ try{ sessionStorage.setItem(STORAGE_KEY, '1') }catch(e){}; resolve({played:true}) }
        u.onerror = (err)=>{ resolve({played:false, error:err}) }
        try{
          synth.speak(u)
        }catch(err){
          resolve({played:false, error:err})
        }
        // fallback detector: if nothing started in 1.8s, resolve with played:false
        setTimeout(()=>{
          if(!started){ resolve({played:false, error:'not_started'}) }
        }, 1800)
      }

      if(voices && voices.length){
        doSpeak()
      }else{
        // voices may load asynchronously
        const onVoices = ()=>{
          synth.removeEventListener('voiceschanged', onVoices)
          doSpeak()
        }
        synth.addEventListener('voiceschanged', onVoices)
        // safety timeout
        setTimeout(()=>{ try{ synth.removeEventListener('voiceschanged', onVoices) }catch(e){}; if(!synth.speaking) resolve({played:false, error:'voices_timeout'}) }, 3000)
      }
    }catch(err){
      resolve({played:false, error:err})
    }
  })
}

function loadResponsiveVoice(){
  return new Promise((resolve, reject)=>{
    if(window.responsiveVoice) return resolve(window.responsiveVoice)
    const s = document.createElement('script')
    s.src = 'https://code.responsivevoice.org/responsivevoice.js'
    s.async = true
    s.onload = ()=>{ resolve(window.responsiveVoice) }
    s.onerror = (e)=>{ reject(e) }
    document.head.appendChild(s)
  })
}

function speakWithResponsiveVoice(text){
  return new Promise((resolve)=>{
    try{
      if(!window.responsiveVoice) return resolve({played:false, error:'no_responsive'})
      // prefer 'Spanish Latin American Female' if available, else 'Spanish Female' else null
      const voice = window.responsiveVoice.getVoices().find(v=>/spanish/i.test(v.name) && /latin/i.test(v.name)) || window.responsiveVoice.getVoices().find(v=>/spanish/i.test(v.name))
      window.responsiveVoice.speak(text, voice ? voice.name : undefined, {rate:1, pitch:1, volume:1})
      try{ sessionStorage.setItem(STORAGE_KEY, '1') }catch(e){}
      resolve({played:true})
    }catch(err){ resolve({played:false, error:err}) }
  })
}

export async function playWelcomeOnce(){
  try{
    if(typeof window === 'undefined') return {played:false, reason:'no_window'}
    // avoid repeated attempts in concurrent calls
    try{
      if(sessionStorage.getItem(STORAGE_KEY)) return {played:false, reason:'already_played'}
      if(isInprogressRecent()) return {played:false, reason:'in_progress'}
      setInprogressFlag()
    }catch(e){}

    if(supportsSpeechSynthesis()){
      const res = await speakWithWebSpeech(WELCOME_TEXT)
      if(res && res.played){
        try{ sessionStorage.setItem(STORAGE_KEY, '1') }catch(e){}
        clearInprogressFlag()
        return res
        return res
      }
    }

    // fallback: try responsiveVoice if available/allowed
    try{
      await loadResponsiveVoice()
      const res2 = await speakWithResponsiveVoice(WELCOME_TEXT)
      if(res2 && res2.played){
        try{ sessionStorage.setItem(STORAGE_KEY, '1') }catch(e){}
        clearInprogressFlag()
        return res2
      }
    }catch(e){}
    // Could not autoplay — clear in-progress flag and leave indicator for manual play
    clearInprogressFlag()
    return {played:false, reason:'no_playback'}
  }catch(err){
    clearInprogressFlag()
    return {played:false, error:err}
  }
}

export async function speakNow(){
  // Force a speak attempt regardless of session flag (used by manual control)
  if(supportsSpeechSynthesis()){
    return await speakWithWebSpeech(WELCOME_TEXT)
  }
  try{
    await loadResponsiveVoice()
    return await speakWithResponsiveVoice(WELCOME_TEXT)
  }catch(e){
    return {played:false, error:e}
  }
}

export function hasTTSSupport(){
  return supportsSpeechSynthesis() || typeof window !== 'undefined' && !!window.responsiveVoice
}
