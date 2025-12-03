import React, { useState } from 'react';
import { ResumeData } from '../types';

interface LandingPageProps {
  onStart: () => void;
  demos: ResumeData[];
  onLoadDemo: (demo: ResumeData) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, demos, onLoadDemo }) => {
  const [showDemos, setShowDemos] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A5A40] font-sans selection:bg-[#A3B18A] selection:text-white flex flex-col overflow-y-auto relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DAD7CD] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#A3B18A] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="w-full flex justify-between items-center p-6 md:p-10 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter cursor-pointer" onClick={onStart}>
          <div className="w-12 h-12 relative drop-shadow-sm text-[#3A5A40]">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Hexagon Border */}
                <path d="M50 5 L91 27 V73 L50 95 L9 73 V27 L50 5 Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
                {/* Bridge Structure */}
                <path d="M20 55 H80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M25 55 L50 35 L75 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 35 V55" stroke="currentColor" strokeWidth="3" />
                <path d="M37.5 45 V55" stroke="currentColor" strokeWidth="2" />
                <path d="M62.5 45 V55" stroke="currentColor" strokeWidth="2" />
                {/* Water */}
                <path d="M35 70 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M45 80 H55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
          </div>
          <span className="text-[#344E41]">Talent Bridge</span>
        </div>
        <div className="flex gap-6 items-center">
            <button onClick={onStart} className="hidden md:block text-[#588157] font-medium hover:text-[#3A5A40] transition-colors">How it works</button>
            <button 
            onClick={onStart} 
            className="px-5 py-2.5 text-[#FDFBF7] bg-[#3A5A40] rounded-full font-semibold text-sm hover:bg-[#344E41] transition-all shadow-lg shadow-[#3A5A40]/20 hover:shadow-xl hover:scale-105"
            >
            Get Started
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full pt-8 pb-20 relative z-10 gap-12">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[#A3B18A] rounded-full text-xs font-bold tracking-widest text-[#588157] bg-white shadow-sm uppercase animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-[#588157] animate-pulse"></span>
                AI-Powered Resume Architect
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-[#344E41]">
            Cultivate your <br/>
            career path <br/>
            <span className="font-serif italic text-[#588157] relative inline-block">
                organically.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#A3B18A] opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
            </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 text-[#588157] font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
            Stop wrestling with formatting. Chat with our intelligent architect to build a professional, ATS-friendly resume that stands out in the corporate landscape.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-[#FDFBF7] transition-all duration-200 bg-[#344E41] rounded-full hover:bg-[#283C32] hover:scale-105 focus:outline-none shadow-xl shadow-[#344E41]/30 flex items-center justify-center"
                >
                <span>Build My Resume</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
                <button 
                onClick={() => setShowDemos(true)}
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-[#344E41] transition-all duration-200 bg-white border border-[#A3B18A]/50 rounded-full hover:bg-[#FDFBF7] hover:border-[#344E41] flex items-center justify-center"
                >
                View Examples
                </button>
            </div>

             <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-[#588157]">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FDFBF7] bg-[#A3B18A] flex items-center justify-center text-[10px] text-white font-bold">
                             {String.fromCharCode(64+i)}
                        </div>
                    ))}
                </div>
                <p>Trusted by 10,000+ job seekers</p>
            </div>
        </div>

        {/* Right Visual (Abstract Representation) */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-full flex justify-center lg:justify-end">
            <div className="relative w-[320px] md:w-[400px] h-[450px]">
                {/* Resume Paper */}
                <div className="absolute top-0 right-0 w-[280px] md:w-[340px] h-[420px] bg-white rounded-xl shadow-2xl shadow-[#3A5A40]/10 border border-[#A3B18A]/20 p-6 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out z-10 flex flex-col">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-[#F3F4F6] rounded-full mb-3 flex items-center justify-center text-2xl">👤</div>
                        <div className="h-5 bg-[#F3F4F6] rounded w-1/2 mb-2 flex items-center justify-center"><span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Alex Morgan</span></div>
                        <div className="h-3 bg-[#F3F4F6] rounded w-1/3"></div>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                             <div className="h-2 bg-[#F3F4F6] rounded w-full"></div>
                             <div className="h-2 bg-[#F3F4F6] rounded w-full"></div>
                             <div className="h-2 bg-[#F3F4F6] rounded w-5/6"></div>
                        </div>
                         <div className="pt-2">
                             <div className="flex justify-between mb-2">
                                 <div className="h-3 bg-[#F3F4F6] rounded w-1/3"></div>
                                 <div className="h-3 bg-[#F3F4F6] rounded w-1/5"></div>
                             </div>
                             <div className="space-y-2">
                                <div className="h-2 bg-[#F3F4F6] rounded w-full"></div>
                                <div className="h-2 bg-[#F3F4F6] rounded w-11/12"></div>
                                <div className="h-2 bg-[#F3F4F6] rounded w-4/5"></div>
                             </div>
                        </div>
                         <div className="pt-2">
                             <div className="flex justify-between mb-2">
                                 <div className="h-3 bg-[#F3F4F6] rounded w-1/3"></div>
                                 <div className="h-3 bg-[#F3F4F6] rounded w-1/5"></div>
                             </div>
                             <div className="space-y-2">
                                <div className="h-2 bg-[#F3F4F6] rounded w-full"></div>
                                <div className="h-2 bg-[#F3F4F6] rounded w-10/12"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Chat Bubble */}
                <div className="absolute bottom-10 -left-4 md:-left-12 w-[260px] bg-[#344E41] rounded-2xl p-5 shadow-xl text-white z-20 animate-bounce-slow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#A3B18A] flex items-center justify-center text-xs font-bold">AI</div>
                        <div className="h-2 bg-[#A3B18A]/30 rounded w-20"></div>
                    </div>
                    <p className="text-sm font-light text-[#DAD7CD]">"I've optimized your summary for a Product Manager role. Shall we add your skills next?"</p>
                </div>

                {/* Decor elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#A3B18A]/20 to-transparent rounded-full blur-2xl"></div>
            </div>
        </div>

      </main>

      {/* Feature Strip */}
      <section className="w-full bg-white/50 backdrop-blur-sm border-y border-[#A3B18A]/10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Natural Conversation", desc: "Speak naturally. Our AI extracts achievements from your stories.", icon: "🌱" },
                    { title: "Real-time Preview", desc: "See your document evolve instantly as you chat.", icon: "👁️" },
                    { title: "ATS Optimized", desc: "Formats that pass the bots and impress the humans.", icon: "🎯" }
                ].map((feature, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#A3B18A]/20">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-[#344E41] mb-2">{feature.title}</h3>
                        <p className="text-[#588157] text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[#588157] text-sm bg-[#FDFBF7] border-t border-[#A3B18A]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="opacity-70">© {new Date().getFullYear()} Talent Bridge.</p>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            {team.map((member) => (
              <a 
                key={member.name}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#344E41] hover:underline underline-offset-4 transition-colors font-medium"
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
          <div className="absolute inset-0 bg-[#344E41]/80 backdrop-blur-sm" onClick={() => setShowDemos(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#344E41]">Select a Template</h2>
              <button 
                onClick={() => setShowDemos(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <p className="text-[#588157] mb-8 max-w-2xl">
              Choose an example resume to start with. You can then use the chat interface to customize details, rewrite summaries, or completely overhaul the experience sections to match your own.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {demos.map((demo, idx) => (
                <div 
                  key={idx} 
                  className="border border-[#A3B18A]/30 rounded-xl p-6 hover:shadow-xl hover:border-[#344E41] hover:-translate-y-1 transition-all duration-300 bg-[#FDFBF7] flex flex-col h-full"
                >
                  <img
                    src={profileImages[idx % profileImages.length]}
                    alt={demo.fullName}
                    className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white shadow-md"
                  />
                  <h3 className="text-xl font-bold text-[#344E41] mb-1">{demo.fullName}</h3>
                  <p className="text-sm font-semibold text-[#588157] uppercase tracking-wider mb-4">{demo.title}</p>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    <p className="text-sm text-gray-600 line-clamp-3 italic">"{demo.summary}"</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {demo.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] bg-white border border-[#A3B18A]/20 px-2 py-1 rounded-md text-[#588157]">
                          {s}
                        </span>
                      ))}
                      {demo.skills.length > 3 && (
                        <span className="text-[10px] px-2 py-1 text-[#588157]">+ {demo.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onLoadDemo(demo)}
                    className="w-full py-3 bg-[#344E41] text-white rounded-lg font-semibold hover:bg-[#283C32] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Edit this Resume</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              ))}
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
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;