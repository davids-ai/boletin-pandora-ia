import React from 'react'
import TopBanner from './components/TopBanner'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import InfoSection from './components/InfoSection'
import HeroQuote from './components/HeroQuote'
import MembersSection from './components/MembersSection'
import FuturisticBackground from './components/FuturisticBackground'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import './components/LoadingScreen.css'
import TTSWidget from './components/TTSWidget'
import { playWelcomeOnce } from './utils/tts'
import logoPng from './assets/logo.png'

// App principal que organiza la landing
export default function App(){
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // simulate readiness for demo: mark ready after slight delay
    const t = setTimeout(() => setIsReady(true), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(()=>{
    // Try to play welcome message once when app first becomes ready
    if(isReady){
      // fire-and-forget; widget will show if autoplay blocked
      playWelcomeOnce().catch(()=>{})
    }
  },[isReady])

  return (
    <div className="app-root">
      <LoadingScreen isAppReady={isReady} minDurationMs={900} />
      {/* Fondo global con partículas y lineas */}
      <FuturisticBackground />

      <TopBanner />

      <main>
        <HeroSection />
        <HeroQuote />
        <StatsSection />
        <InfoSection />
        <MembersSection />
      </main>

      <TTSWidget />

      <footer className="app-footer">
        <div className="footer-inner">
          <span>© Pandor-AI — Boletín Futurista</span>
          <img src={logoPng} alt="Pandor-AI logo" className="footer-logo" />
        </div>
      </footer>
    </div>
  )
}
