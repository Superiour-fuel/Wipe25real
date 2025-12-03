import React, { useState } from 'react';
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
      
      {/* Background Gradients & Noise */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#DA7756] opacity-[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900 opacity-[0.08] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* Navigation */}
      <nav className="w-full flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter cursor-pointer group" onClick={onStart}>
          <div className="w-10 h-10 relative text-white transition-transform group-hover:scale-110 duration-300">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M50 5 L91 27 V73 L50 95 L9 73 V27 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M20 55 H80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M25 55 L50 35 L75 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
          <span className="text-white tracking-tight">Talent Bridge</span>
        </div>
        <div className="flex gap-6 items-center">
            <button onClick={onStart} className="hidden md:block text-gray-400 font-medium hover:text-white transition-colors text-sm">How it works</button>
            <button 
            onClick={onStart} 
            className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all transform hover:scale-105"
            >
            Get Started
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full pt-10 pb-20 relative z-10 gap-16 lg:gap-24">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-gray-800 rounded-full text-[10px] font-bold tracking-widest text-[#DA7756] bg-gray-900/50 backdrop-blur-sm uppercase animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA7756] animate-pulse"></span>
                AI-Powered Architect v2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            Architect your <br/>
            professional <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DA7756] to-orange-200">identity.</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 text-gray-400 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
            Stop struggling with templates. Our intelligent architect interviews you to build a precision-engineered, ATS-friendly resume in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 flex-wrap">
                <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#DA7756] rounded-full hover:bg-[#b85c3f] hover:shadow-[0_0_20px_rgba(218,119,86,0.3)] focus:outline-none flex items-center justify-center"
                >
                <span>Build Resume</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </button>
                
                <button 
                  onClick={() => setShowMajorModal(true)}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-transparent border border-gray-700 rounded-full hover:bg-white hover:text-black hover:border-white flex items-center justify-center group"
                >
                  <span>Explore Network</span>
                </button>
            </div>
            
            <div className="mt-8 flex justify-center lg:justify-start">
               <button 
                onClick={() => setShowDemos(true)}
                className="text-sm text-gray-500 hover:text-white underline underline-offset-4 decoration-gray-700 hover:decoration-white transition-all"
               >
                 View example resumes
               </button>
            </div>
        </div>

        {/* Right Visual (Tech/Modern) */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl relative flex justify-center lg:justify-end perspective-1000">
             {/* Main Card */}
             <div className="relative w-full aspect-[4/5] bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 overflow-hidden">
                {/* Header UI */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                         </div>
                         <div>
                            <div className="h-2 w-24 bg-gray-700 rounded mb-1.5"></div>
                            <div className="h-2 w-16 bg-gray-800 rounded"></div>
                         </div>
                    </div>
                    <div className="px-2 py-1 bg-[#DA7756]/10 border border-[#DA7756]/30 rounded text-[#DA7756] text-[10px] font-bold">
                        ATS SCORE: 98
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-6 flex-1 opacity-60">
                     <div className="space-y-2">
                        <div className="h-2 bg-gray-700 rounded w-full"></div>
                        <div className="h-2 bg-gray-800 rounded w-11/12"></div>
                        <div className="h-2 bg-gray-800 rounded w-full"></div>
                     </div>
                     
                     <div className="pt-2">
                        <div className="flex justify-between mb-2">
                            <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-800 rounded w-1/5"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-700 rounded w-full"></div>
                            <div className="h-2 bg-gray-800 rounded w-10/12"></div>
                        </div>
                     </div>
                     
                     <div className="pt-2">
                        <div className="flex justify-between mb-2">
                            <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-800 rounded w-1/5"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-700 rounded w-full"></div>
                            <div className="h-2 bg-gray-800 rounded w-9/12"></div>
                            <div className="h-2 bg-gray-800 rounded w-10/12"></div>
                        </div>
                     </div>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DA7756]/5 to-transparent h-[100%] w-full animate-scan pointer-events-none"></div>
             </div>

             {/* Floating Elements */}
             <div className="absolute top-[20%] -left-[10%] bg-black border border-gray-800 p-4 rounded-xl shadow-xl z-20 animate-float">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-300">Optimizing Keywords...</span>
                </div>
             </div>
             
             <div className="absolute bottom-[20%] -right-[5%] bg-black border border-gray-800 p-4 rounded-xl shadow-xl z-20 animate-float-delayed">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#DA7756] flex items-center justify-center text-white text-xs font-bold">AI</div>
                    <div className="text-xs text-gray-300">
                        <div className="font-bold text-white mb-0.5">Summary Updated</div>
                        <div>+15% Impact Score</div>
                    </div>
                </div>
             </div>
        </div>

      </main>

      {/* Feature Strip */}
      <section className="w-full bg-neutral-900/50 border-t border-white/5 py-16 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Smart Extraction", desc: "Our AI extracts achievements from your casual conversation.", icon: "⚡" },
                    { title: "Real-time Architecture", desc: "Watch your document structure evolve instantly as you speak.", icon: "🏗️" },
                    { title: "ATS Precision", desc: "Formats engineered to pass bots and impress recruiters.", icon: "🎯" }
                ].map((feature, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl bg-black border border-white/10 hover:border-[#DA7756]/50 transition-all duration-300">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm bg-black border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="opacity-70">© {new Date().getFullYear()} Talent Bridge.</p>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            {team.map((member) => (
              <a 
                key={member.name}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#DA7756] transition-colors"
              >
                {member.name}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDemos(false)}></div>
          <div className="relative bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Select a Template</h2>
              <button 
                onClick={() => setShowDemos(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <p className="text-gray-400 mb-8 max-w-2xl">
              Choose an example resume to start with. Customize details using our AI architect.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {demos.map((demo, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-800 bg-[#111] rounded-xl p-6 hover:shadow-xl hover:border-[#DA7756] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                >
                  <img
                    src={profileImages[idx % profileImages.length]}
                    alt={demo.fullName}
                    className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-gray-700 group-hover:border-[#DA7756] transition-colors"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{demo.fullName}</h3>
                  <p className="text-xs font-bold text-[#DA7756] uppercase tracking-wider mb-4">{demo.title}</p>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    <p className="text-sm text-gray-400 line-clamp-3 italic">"{demo.summary}"</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {demo.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onLoadDemo(demo)}
                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Edit this Resume</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Major Selection Modal */}
      {showMajorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowMajorModal(false)}></div>
          <div className="relative bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
             <div className="text-center">
               <div className="w-16 h-16 bg-[#DA7756]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                 🎓
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">What is your Major?</h2>
               <p className="text-gray-400 mb-6">
                 Tell us what you are studying to unlock tailored career paths and network connections.
               </p>
               
               <form onSubmit={handleMajorSubmit}>
                 <input 
                   type="text" 
                   value={majorInput}
                   onChange={(e) => setMajorInput(e.target.value)}
                   placeholder="e.g. Computer Science, Marketing..."
                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-[#DA7756] focus:ring-1 focus:ring-[#DA7756] mb-6 text-white placeholder-gray-600"
                   autoFocus
                 />
                 <button 
                   type="submit"
                   className="w-full py-3 bg-[#DA7756] text-white rounded-xl font-bold hover:bg-[#b85c3f] transition-colors"
                 >
                   Explore Opportunities
                 </button>
               </form>
               
               <button 
                 onClick={() => setShowMajorModal(false)}
                 className="mt-4 text-sm text-gray-500 hover:text-white"
               >
                 Cancel
               </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
            animation: float 4s ease-in-out infinite 2s;
        }
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 4s linear infinite;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;