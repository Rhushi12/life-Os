
import React, { useEffect, useState } from "react"
import { LogoIcon } from "./icons"
import { View } from "../types"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const isLoggedIn = currentView !== 'landing' && currentView !== 'auth' && currentView !== 'pricing';

  return (
    <>
      <nav
        className={`fixed inset-x-0 mx-auto z-50 px-4 sm:px-6 w-full max-w-7xl transition-all duration-700 ease-in-out ${isVisible ? "top-4 sm:top-8 opacity-100" : "-top-24 opacity-0"
          }`}
      >
        <div className="bg-black/70 backdrop-blur-[12px] rounded-full px-6 py-3 flex items-center justify-between gap-4 md:gap-8 shadow-2xl border border-zinc-800 w-full max-w-full">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
          >
            <LogoIcon className="w-6 h-6 text-[#5100fd] transition-transform group-hover:rotate-180 duration-700" />
            <span className="text-white font-bold tracking-tight">Life-OS</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className={`text-sm font-medium transition-colors hover:text-[#5100fd] ${currentView === 'dashboard' ? 'text-white' : 'text-zinc-400'}`}>Mission Control</button>
                <button onClick={() => onNavigate('planner')} className={`text-sm font-medium transition-colors hover:text-[#5100fd] ${currentView === 'planner' ? 'text-white' : 'text-zinc-400'}`}>Planner</button>
                <button onClick={() => onNavigate('strategy')} className={`text-sm font-medium transition-colors hover:text-[#5100fd] ${currentView === 'strategy' ? 'text-white' : 'text-zinc-400'}`}>Strategy</button>
                <button onClick={() => onNavigate('feedback')} className={`text-sm font-medium transition-colors hover:text-[#5100fd] ${currentView === 'feedback' ? 'text-white' : 'text-zinc-400'}`}>Reflect</button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('landing')} className="text-sm text-zinc-400 hover:text-white transition-colors">Features</button>
                <button onClick={() => onNavigate('pricing')} className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</button>
              </>
            )}
          </div>

          {/* CTA Buttons & Mobile Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            {isLoggedIn && (
              <button onClick={() => onNavigate('settings')} className={`text-zinc-400 hover:text-white transition-colors hidden sm:block ${currentView === 'settings' ? 'text-white' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => onNavigate('auth')}
                className="text-sm font-medium text-white hover:text-[#5100fd] transition-colors hidden sm:block"
              >
                Log In
              </button>
            )}
            <Button
              size="sm"
              onClick={() => onNavigate(isLoggedIn ? 'goal-intake' : 'auth')}
              className="bg-[#5100fd] hover:bg-[#6610ff] text-white rounded-full px-6 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(81,0,253,0.5)] hidden sm:flex"
            >
              {isLoggedIn ? 'New Goal' : 'Get Started'}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-32 px-6 animate-fade-in md:hidden">
          <div className="flex flex-col gap-8 text-center">
            {isLoggedIn ? (
              <>
                <button onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Mission Control</button>
                <button onClick={() => { onNavigate('planner'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Planner</button>
                <button onClick={() => { onNavigate('strategy'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Strategy</button>
                <button onClick={() => { onNavigate('feedback'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Reflect</button>
                <button onClick={() => { onNavigate('settings'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Settings</button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('landing'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Features</button>
                <button onClick={() => { onNavigate('pricing'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Pricing</button>
                <button onClick={() => { onNavigate('auth'); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-white hover:text-[#5100fd]">Log In</button>
              </>
            )}
            <Button
              size="lg"
              onClick={() => { onNavigate(isLoggedIn ? 'goal-intake' : 'auth'); setIsMobileMenuOpen(false); }}
              className="bg-[#5100fd] hover:bg-[#6610ff] text-white rounded-full px-8 py-6 text-xl mt-4 shadow-[0_0_20px_-5px_rgba(81,0,253,0.5)]"
            >
              {isLoggedIn ? 'New Goal' : 'Get Started'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
