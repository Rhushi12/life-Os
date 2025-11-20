
import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { GlowingEffect } from "./ui/glowing-effect"
import { ArrowRight, CheckCircle, Brain, Zap, BarChart3 } from "lucide-react"
import { Navbar } from "./Navbar"
import { View } from "../types"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

interface LandingPageProps {
    onNavigate: (view: View) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const progress = Math.min(scrollY / viewportHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linesOpacity = 1 - scrollProgress
  const linesScale = 1 - scrollProgress * 0.3

  const scrollToCapabilities = () => {
    const capabilitiesSection = document.getElementById("capabilities")
    if (capabilitiesSection) {
      capabilitiesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle local navigation behavior (scrolling vs route change)
  const handleLocalNav = (view: View) => {
      if (view === 'landing') {
        // If requesting landing page while on landing page, scroll to features (capabilities)
        scrollToCapabilities();
      } else {
        onNavigate(view);
      }
  };

  return (
    <main className="relative min-h-[200vh] bg-black text-white overflow-hidden w-full">
      <Navbar onNavigate={handleLocalNav} currentView="landing" />

      <div
        className="fixed inset-0 z-0 w-screen h-screen pointer-events-none transition-all duration-100"
        style={{
          opacity: linesOpacity,
          transform: `scale(${linesScale})`,
        }}
      >
        <div className="bg-lines-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2269"
            height="2108"
            viewBox="0 0 2269 2108"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M510.086 0.543457L507.556 840.047C506.058 1337.18 318.091 1803.4 1.875 2094.29"
              stroke="#4C00EC"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="100px 99999px"
              className="animate-line-race-1"
            />
            <path
              d="M929.828 0.543457L927.328 829.877C925.809 1334 737.028 1807.4 418.435 2106"
              stroke="#4C00EC"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="100px 99999px"
              className="animate-line-race-2"
            />
            <path
              d="M1341.9 0.543457L1344.4 829.876C1345.92 1334 1534.7 1807.4 1853.29 2106"
              stroke="#4C00EC"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="100px 99999px"
              className="animate-line-race-3"
            />
            <path
              d="M1758.96 0.543457L1761.49 840.047C1762.99 1337.18 1950.96 1803.4 2267.17 2094.29"
              stroke="#4C00EC"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeDasharray="100px 99999px"
              className="animate-line-race-4"
            />
            <path opacity="0.2" d="M929.828 0.543457L927.328 829.877C925.809 1334 737.028 1807.4 418.435 2106" stroke="white" strokeWidth="1" strokeMiterlimit="10" />
            <path opacity="0.2" d="M510.086 0.543457L507.556 840.047C506.058 1337.18 318.091 1803.4 1.875 2094.29" stroke="white" strokeWidth="1" strokeMiterlimit="10" />
            <path opacity="0.2" d="M1758.96 0.543457L1761.49 840.047C1762.99 1337.18 1950.96 1803.4 2267.17 2094.29" stroke="white" strokeWidth="1" strokeMiterlimit="10" />
            <path opacity="0.2" d="M1341.9 0.543457L1344.4 829.876C1345.92 1334 1534.7 1807.4 1853.29 2106" stroke="white" strokeWidth="1" strokeMiterlimit="10" />
          </svg>
        </div>
      </div>

      <div
        className="fixed right-0 top-0 w-full md:w-1/2 h-screen pointer-events-none z-10 opacity-50 md:opacity-100"
        style={{
          opacity: linesOpacity,
          transform: `scale(${linesScale})`,
        }}
      >
        <div className="track">
          {/* @ts-ignore */}
          <spline-viewer
            url="https://prod.spline.design/ZxKIijKh056svcM5/scene.splinecode"
            className="w-full h-full"
            style={{ position: "sticky", top: "0px", height: "100vh" }}
          />
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-6 lg:px-12 pt-32 pb-32 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-12 animate-fade-in">
            <div className="relative w-14 h-7 bg-gradient-to-r from-purple-500 to-[#5100fd] rounded-full">
              <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300" />
            </div>
            <span className="text-sm text-zinc-300">AI Agents Ready.</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-[1] animate-fade-in-up text-balance tracking-tight">
            Your Goals. <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Autonomously Planned.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 animate-fade-in-up animation-delay-200 max-w-2xl leading-relaxed">
            Life-OS researches, strategizes, and schedules your path to success. Turn any vague ambition into an adaptive, daily executable plan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              onClick={() => onNavigate('auth')}
              className="group bg-[#5100fd] hover:bg-[#6610ff] text-white px-8 py-8 text-lg rounded-full transition-all duration-[650ms] hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(81,0,253,0.5)]"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-[650ms] group-hover:rotate-90" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToCapabilities}
              className="group border-zinc-800 text-white hover:bg-white/5 px-8 py-8 text-lg rounded-full"
            >
              How it Works
            </Button>
          </div>
        </div>
      </div>

      <section id="capabilities" className="relative z-20 py-24 bg-zinc-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-12 p-12 rounded-3xl border border-zinc-800/50 bg-black/40 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-balance">Intelligence</h2>
                <p className="text-lg text-zinc-400 max-w-xl">
                    Three specialized AI agents work in unison to construct your perfect plan.
                </p>
            </div>
          </div>

          <Tabs defaultValue="research" className="w-full">
            <div className="flex justify-center mb-12">
                <TabsList className="bg-zinc-900/80 border border-zinc-800 p-1 rounded-full">
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
                <TabsTrigger value="execution">Execution</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="research">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-3xl border border-zinc-800 p-2 bg-zinc-900/20">
                  <GlowingEffect blur={20} spread={60} glow={true} disabled={false} />
                  <div className="relative bg-black rounded-2xl p-8 h-full">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                        <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-medium mb-4 text-white">Researcher Agent</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Identifies proven methods, success metrics, and verified data sources relevant to your specific goal. It ensures your plan is built on truth, not guesswork.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8">
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Market Analysis</h4>
                                <p className="text-zinc-500 text-sm">Scans verified sources for best practices.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Feasibility Check</h4>
                                <p className="text-zinc-500 text-sm">Validates if the goal is realistic within timeframe.</p>
                            </div>
                        </li>
                    </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strategy">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-3xl border border-zinc-800 p-2 bg-zinc-900/20">
                  <GlowingEffect blur={20} spread={60} glow={true} disabled={false} />
                  <div className="relative bg-black rounded-2xl p-8 h-full">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-medium mb-4 text-white">Strategist Agent</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Converts raw research into a structured, high-level roadmap. It defines milestones, Key Performance Indicators (KPIs), and critical paths.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8">
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-purple-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Milestone Mapping</h4>
                                <p className="text-zinc-500 text-sm">Breaks big goals into manageable chunks.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-purple-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">KPI Definition</h4>
                                <p className="text-zinc-500 text-sm">Sets clear metrics for success.</p>
                            </div>
                        </li>
                    </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="execution">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-3xl border border-zinc-800 p-2 bg-zinc-900/20">
                  <GlowingEffect blur={20} spread={60} glow={true} disabled={false} />
                  <div className="relative bg-black rounded-2xl p-8 h-full">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                        <Zap className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-medium mb-4 text-white">Planner Agent</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      The final architect. It takes the strategy and breaks it down into daily actionable tasks, fitting them into your actual schedule and life constraints.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8">
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Task Generation</h4>
                                <p className="text-zinc-500 text-sm">Creates specific, hourly tasks.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Adaptive Scheduling</h4>
                                <p className="text-zinc-500 text-sm">Adjusts based on your real-world progress.</p>
                            </div>
                        </li>
                    </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-900 bg-black">
        <div className="container mx-auto px-6 text-center">
            <p className="text-zinc-500 text-sm">© 2025 Life-OS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
