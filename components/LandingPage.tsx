import React, { useState, useEffect } from 'react';
import { ResumeData } from '../types';

interface LandingPageProps {
  onStart: () => void;
  demos: ResumeData[];
  onLoadDemo: (demo: ResumeData) => void;
  onOpenOpportunities: (major: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, demos, onLoadDemo, onOpenOpportunities }) => {
  const [showDemos, setShowDemos] = useState(false);
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [majorInput, setMajorInput] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const team = [
    { name: 'Rishel', link: 'https://www.linkedin.com/in/rishel-lijesh-7643a4377/' },
    { name: 'Manoj', link: 'https://www.linkedin.com/in/manoj07ar/' },
    { name: 'Sai', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
    { name: 'Milan', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
  ];

  const profileImages = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  ];

  const handleMajorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (majorInput.trim()) {
      onOpenOpportunities(majorInput);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#DA7756] selection:text-white flex flex-col relative overflow-x-hidden">
        {/* Abstract Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#DA7756]/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Sticky Glass Navbar */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={onStart}>
                     <div className="w-8 h-8 text-white transition-transform group-hover:scale-110 duration-300">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                            <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                            <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                            <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                            <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Talent Bridge</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Templates', 'About'].map((item) => (
                        <button key={item} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{item}</button>
                    ))}
                    <button 
                        onClick={onStart}
                        className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Launch App
                    </button>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 lg:pt-40 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#DA7756]/30 rounded-full bg-[#DA7756]/10 backdrop-blur-md animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA7756] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DA7756]"></span>
                    </span>
                    <span className="text-xs font-bold text-[#DA7756] tracking-wide uppercase">AI Architect v2.0 Live</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up delay-100">
                    Your career story, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DA7756] via-[#FFB088] to-white">architected by AI.</span>
                </h1>

                <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
                    Stop wrestling with templates. Our AI interviews you like a recruiter, uncovers your hidden achievements, and builds a ATS-optimized resume in real-time.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                    <button 
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-[#DA7756] rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(218,119,86,0.6)]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            Build My Resume
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </button>
                    <button 
                         onClick={() => setShowMajorModal(true)}
                         className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    >
                        Find Opportunities
                    </button>
                </div>
            </div>

            {/* Right: 3D App Preview */}
            <div className="flex-1 w-full max-w-[600px] perspective-[2000px] animate-fade-in-up delay-200">
                <div className="relative group transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out-expo">
                     {/* Glow Effect */}
                     <div className="absolute -inset-1 bg-gradient-to-r from-[#DA7756] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                     
                     {/* The Card */}
                     <div className="relative bg-[#0F0F0F] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Browser Header */}
                        <div className="h-10 bg-[#151515] border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                            </div>
                            <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-500 font-mono bg-black/50 px-3 py-1 rounded">
                                <span>ai_architect.exe</span>
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                        </div>

                        {/* Split Interface Content */}
                        <div className="flex h-[380px] md:h-[450px]">
                            {/* Left: Chat Simulation */}
                            <div className="w-[45%] border-r border-white/5 bg-black/50 p-4 flex flex-col relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-10"></div>
                                <div className="space-y-4">
                                    <div className="flex gap-3 animate-fade-in-up">
                                        <div className="w-8 h-8 rounded-full bg-[#DA7756] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="bg-[#1A1A1A] p-3 rounded-2xl rounded-tl-none text-xs text-gray-300 border border-white/5">
                                            I've analyzed your project at TechFlow. Shall we highlight the 40% efficiency gain?
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse animate-fade-in-up delay-75">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                                        <div className="bg-[#DA7756] p-3 rounded-2xl rounded-tr-none text-xs text-white">
                                            Yes, definitely.
                                        </div>
                                    </div>
                                    <div className="flex gap-3 animate-fade-in-up delay-150">
                                        <div className="w-8 h-8 rounded-full bg-[#DA7756] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="bg-[#1A1A1A] p-3 rounded-2xl rounded-tl-none text-xs text-gray-300 border border-white/5 flex items-center gap-2">
                                            <span>Updating resume</span>
                                            <span className="flex space-x-1">
                                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></span>
                                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Resume Preview Simulation */}
                            <div className="w-[55%] bg-white p-6 relative overflow-hidden">
                                <div className="space-y-4 opacity-90 scale-[0.85] origin-top-left w-[120%]">
                                    <div className="border-b-2 border-gray-800 pb-4">
                                        <div className="h-6 w-1/2 bg-gray-900 mb-2 rounded-sm"></div>
                                        <div className="h-3 w-1/3 bg-gray-500 mb-3 rounded-sm"></div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-16 bg-gray-300 rounded-sm"></div>
                                            <div className="h-2 w-16 bg-gray-300 rounded-sm"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="h-3 w-1/4 bg-gray-400 rounded-sm"></div>
                                        <div className="h-2 w-full bg-gray-200 rounded-sm"></div>
                                        <div className="h-2 w-full bg-gray-200 rounded-sm"></div>
                                        <div className="h-2 w-3/4 bg-gray-200 rounded-sm"></div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="h-3 w-1/4 bg-gray-400 rounded-sm"></div>
                                        
                                        <div className="pl-2 border-l-2 border-[#DA7756]/30">
                                            <div className="flex justify-between mb-1">
                                                <div className="h-3 w-1/3 bg-gray-800 rounded-sm"></div>
                                                <div className="h-2 w-16 bg-gray-400 rounded-sm"></div>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-sm mb-1"></div>
                                            {/* Highlighted change */}
                                            <div className="h-2 w-[90%] bg-[#DA7756]/20 rounded-sm border border-[#DA7756]/50"></div>
                                        </div>

                                        <div className="pl-2">
                                            <div className="flex justify-between mb-1">
                                                <div className="h-3 w-1/3 bg-gray-800 rounded-sm"></div>
                                                <div className="h-2 w-16 bg-gray-400 rounded-sm"></div>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-sm mb-1"></div>
                                            <div className="h-2 w-[80%] bg-gray-100 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 right-6 bg-[#DA7756] text-white p-3 rounded-lg shadow-xl shadow-[#DA7756]/30 flex items-center gap-3 animate-bounce-subtle z-20">
                                    <div className="text-xl">✨</div>
                                    <div>
                                        <div className="text-[10px] font-medium opacity-80">Impact Score</div>
                                        <div className="text-xs font-bold">Excellent (98/100)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </section>

        {/* Features Bento Grid */}
        <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-white/10 flex-1"></div>
                <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Why Talent Bridge?</h2>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
                {/* 1. Main Feature: Real-time */}
                <div className="md:col-span-2 md:row-span-2 bg-[#0F0F0F] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#DA7756]/30 transition-all">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#DA7756]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DA7756]/20 transition-all duration-700"></div>
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#DA7756] group-hover:text-white transition-colors">⚡</div>
                        <h3 className="text-3xl font-bold mb-3">Live Architecture</h3>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Watch your document evolve instantly. As you speak, our AI structures your chaotic thoughts into bullet points, corrects grammar, and formats perfectly.
                        </p>
                        <div className="mt-auto relative w-full h-40 bg-black/50 border border-white/5 rounded-xl overflow-hidden">
                             <div className="absolute top-4 left-4 right-4 space-y-2">
                                  <div className="h-2 bg-white/10 rounded w-3/4 animate-pulse"></div>
                                  <div className="h-2 bg-white/10 rounded w-1/2 animate-pulse delay-75"></div>
                                  <div className="h-2 bg-white/10 rounded w-full animate-pulse delay-150"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. ATS Feature */}
                <div className="md:col-span-1 md:row-span-1 bg-[#0F0F0F] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-4xl mb-4 text-blue-500">🎯</div>
                    <h3 className="text-xl font-bold mb-2">ATS Precision</h3>
                    <p className="text-xs text-gray-400">Formats engineered to pass bots. Keywords optimized.</p>
                </div>

                {/* 3. Smart Import */}
                <div className="md:col-span-1 md:row-span-1 bg-[#0F0F0F] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
                     <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="text-4xl mb-4 text-green-500">📥</div>
                     <h3 className="text-xl font-bold mb-2">Smart Import</h3>
                     <p className="text-xs text-gray-400">Upload any PDF. We parse and polish it instantly.</p>
                </div>

                {/* 4. Templates Library (Clickable) */}
                <div 
                    onClick={() => setShowDemos(true)}
                    className="md:col-span-2 md:row-span-1 bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex items-center justify-between cursor-pointer group hover:bg-[#252525] transition-all relative overflow-hidden"
                >
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                     <div className="relative z-10">
                         <h3 className="text-2xl font-bold mb-1">Template Library</h3>
                         <p className="text-sm text-gray-400">Explore successful resumes from top companies.</p>
                     </div>
                     <div className="relative z-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 bg-black py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 text-white">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                            <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                            <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                            <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                            <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                        </svg>
                    </div>
                    <span className="font-bold text-lg">Talent Bridge</span>
                </div>
                <div className="flex gap-8 text-sm text-gray-500">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
                <div className="flex gap-4">
                     {team.map((member) => (
                        <a 
                            key={member.name}
                            href={member.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#DA7756] transition-colors text-sm"
                        >
                            {member.name}
                        </a>
                    ))}
                </div>
            </div>
        </footer>

        {/* Demo Modal (Modernized) */}
        {showDemos && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={() => setShowDemos(false)}></div>
                <div className="relative bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-start mb-8 sticky top-0 bg-[#0F0F0F] z-10 pb-4 border-b border-white/5">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">Success Stories</h2>
                            <p className="text-gray-400">Select a template to analyze or edit.</p>
                        </div>
                        <button 
                            onClick={() => setShowDemos(false)}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {demos.map((demo, idx) => (
                            <div 
                                key={idx} 
                                className="group relative bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 hover:border-[#DA7756] transition-all duration-300 flex flex-col h-full overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-[#DA7756] flex items-center justify-center text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4">
                                     <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                                        <img
                                            src={profileImages[idx % profileImages.length]}
                                            alt={demo.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-white">{demo.fullName}</h3>
                                         <p className="text-xs text-[#DA7756] uppercase font-bold tracking-wider">{demo.title}</p>
                                     </div>
                                </div>
                                
                                <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1 leading-relaxed">"{demo.summary}"</p>
                                
                                <button
                                    onClick={() => onLoadDemo(demo)}
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-white hover:bg-white hover:text-black hover:border-white transition-all"
                                >
                                    Use Template
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Major Modal (Modernized) */}
        {showMajorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowMajorModal(false)}></div>
                <div className="relative bg-[#0F0F0F] border border-white/10 rounded-3xl p-10 max-w-lg w-full shadow-2xl animate-fade-in-up">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#DA7756] to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/50 transform -rotate-3 hover:rotate-0 transition-transform">
                            <span className="text-4xl">🎓</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Your Journey</h2>
                        <p className="text-gray-400 mb-8">
                            Enter your field of study to unlock curated opportunities and network connections.
                        </p>
                        
                        <form onSubmit={handleMajorSubmit} className="space-y-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={majorInput}
                                    onChange={(e) => setMajorInput(e.target.value)}
                                    placeholder="e.g. Computer Science, Law..."
                                    className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 rounded-xl focus:outline-none focus:border-[#DA7756] focus:ring-1 focus:ring-[#DA7756] text-white placeholder-gray-600 transition-all text-lg"
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-transform active:scale-95"
                            >
                                Explore Opportunities
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}

        <style>{`
            .animate-pulse-slow {
                animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                opacity: 0;
                transform: translateY(20px);
            }
            .ease-out-expo {
                transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .animate-float {
                animation: float 5s ease-in-out infinite;
            }
            .animate-bounce-subtle {
                animation: bounce-subtle 3s infinite;
            }
            @keyframes bounce-subtle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            /* Custom Scrollbar for global page */
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                background: #000;
            }
            ::-webkit-scrollbar-thumb {
                background: #333;
                border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #444;
            }
        `}</style>
    </div>
  );
};

export default LandingPage;