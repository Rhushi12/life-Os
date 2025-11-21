import React, { useEffect, useState } from "react"
import { LogoIcon } from "./icons"
import { View } from "../types"
import { Button } from "./ui/button"
import { Menu, X, LogOut, Settings as SettingsIcon } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface NavbarProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const { user, logout } = useAuth();
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

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('landing');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('settings')}
                  className="group relative focus:outline-none"
                  title="Settings"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className={`w-8 h-8 rounded-full border transition-all duration-300 ${currentView === 'settings' ? 'border-[#5100fd] shadow-[0_0_10px_rgba(81,0,253,0.5)]' : 'border-zinc-700 group-hover:border-zinc-500'}`} />
                  ) : (
                    <div className={`w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white border transition-all duration-300 ${currentView === 'settings' ? 'border-[#5100fd]' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="text-zinc-500 hover:text-white transition-colors hidden sm:block p-2 hover:bg-zinc-800/50 rounded-full"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-2xl font-light text-zinc-500 hover:text-white">Log Out</button>
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
