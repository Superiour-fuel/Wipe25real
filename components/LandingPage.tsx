import React, { useState, useEffect, useRef } from 'react';
import { ResumeData } from '../types';

interface LandingPageProps {
  onStart: () => void;
  demos: ResumeData[];
  onLoadDemo: (demo: ResumeData) => void;
  onOpenOpportunities: (major: string) => void;
  onOpenSupport: () => void;
  onOpenExamples: () => void;
}

// --- Showcase Resume Component ---
interface ShowcaseResumeProps {
  data: ResumeData;
  layout: 'standard' | 'classic' | 'modern' | 'sidebar' | 'minimal';
  isActive: boolean;
  isSide?: boolean; // New prop to handle side card styling specifics
  onClick?: () => void;
}

const ShowcaseResume: React.FC<ShowcaseResumeProps> = ({ data, layout, isActive, isSide, onClick }) => {
  const themeColor = data.themeColor || '#000';
  
  // Helper for rendering description bullets
  const renderDesc = (desc: string[]) => (
      <ul className="list-disc ml-3 space-y-0.5 opacity-90 text-left">
        {desc.map((d, j) => <li key={j} className="text-[7px] leading-tight mb-0.5">{d}</li>)}
      </ul>
  );

  // Base classes for the card
  const cardClasses = `
    w-[360px] h-[580px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-pointer 
    flex-shrink-0 relative text-gray-800 select-none transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform
    ${isActive ? 'ring-4 ring-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.03] hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)] z-10' : ''}
    ${isSide ? 'shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : ''}
  `;

  // Font sizing for readable card - Scaled down
  const textBase = "text-[8px] leading-relaxed";
  const textHeader = "text-lg";
  
  const LayoutContent = () => {
    switch(layout) {
      case 'sidebar':
        return (
          <div className={`flex h-full ${textBase}`}>
             <div className="w-[35%] h-full p-3 text-white flex flex-col gap-3" style={{ backgroundColor: themeColor }}>
                 <div className="text-center">
                     <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2 font-serif">
                         {data.fullName.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div className="font-bold text-[9px] uppercase tracking-widest mb-0.5 leading-tight">{data.fullName}</div>
                     <div className="text-[7px] opacity-75">{data.title}</div>
                 </div>
                 
                 <div className="space-y-1.5 opacity-80 mt-1 text-[7px]">
                     <div className="flex items-center gap-1"><span className="opacity-50">✉</span> <span className="truncate">{data.email}</span></div>
                     <div className="flex items-center gap-1"><span className="opacity-50">📞</span> {data.phone}</div>
                     <div className="flex items-center gap-1"><span className="opacity-50">📍</span> {data.location}</div>
                 </div>
 
                 <div className="mt-3">
                     <div className="font-bold border-b border-white/30 mb-1.5 pb-0.5 tracking-wider text-[8px]">EDUCATION</div>
                     {data.education.map((edu, i) => (
                         <div key={i} className="mb-2 text-[7px]">
                             <div className="font-bold">{edu.school}</div>
                             <div className="opacity-75">{edu.degree}</div>
                             <div className="opacity-50 italic mb-0.5">{edu.dates}</div>
                         </div>
                     ))}
                 </div>

                 <div className="mt-auto">
                     <div className="font-bold border-b border-white/30 mb-1.5 pb-0.5 tracking-wider text-[8px]">SKILLS</div>
                     <div className="flex flex-wrap gap-1">
                         {data.skills.slice(0, 8).map((s,i) => <span key={i} className="opacity-90 bg-white/10 px-1 py-0.5 rounded-[2px] text-[6px]">{s}</span>)}
                     </div>
                 </div>
             </div>
             <div className="w-[65%] p-3 flex flex-col gap-2 overflow-hidden">
                  <div>
                     <div className="font-bold text-[8px] uppercase tracking-wider mb-0.5 text-gray-400">Professional Summary</div>
                     <p className="text-justify text-[7px] leading-relaxed">{data.summary}</p>
                  </div>
                  <div>
                     <div className="font-bold text-[8px] uppercase tracking-wider mb-1.5 text-gray-400">Experience</div>
                     {data.experience.map((exp, i) => (
                         <div key={i} className="mb-2">
                             <div className="font-bold text-[8px]">{exp.title}</div>
                             <div className="text-[7px] text-gray-500 mb-0.5 font-semibold">{exp.company} <span className="font-normal text-gray-400">| {exp.dates}</span></div>
                             {renderDesc(exp.description)}
                         </div>
                     ))}
                  </div>
             </div>
          </div>
        );

      case 'modern':
        return (
          <div className={`h-full flex flex-col ${textBase}`}>
             <div className="p-4 pb-6" style={{ backgroundColor: themeColor }}>
                 <h2 className={`${textHeader} font-bold text-white tracking-tight`}>{data.fullName}</h2>
                 <p className="text-[10px] text-white/90 font-medium mt-0.5 uppercase tracking-wider">{data.title}</p>
             </div>
             <div className="px-4 -mt-4 relative z-10 flex gap-3">
                  <div className="bg-white p-2 shadow-md rounded-lg flex-1 text-center border border-gray-100">
                     <div className="font-bold text-[7px] text-gray-400 uppercase">Contact</div>
                     <div className="font-medium text-[8px]">{data.email}</div>
                  </div>
                  <div className="bg-white p-2 shadow-md rounded-lg flex-1 text-center border border-gray-100">
                     <div className="font-bold text-[7px] text-gray-400 uppercase">Location</div>
                     <div className="font-medium text-[8px]">{data.location}</div>
                  </div>
             </div>
             <div className="p-4 flex-1 flex flex-col gap-3 mt-0.5 overflow-hidden">
                  <div>
                     <div className="font-bold text-[8px] uppercase mb-0.5 border-b pb-0.5 tracking-wider text-gray-900 border-gray-100">Summary</div>
                     <p className="text-gray-600 text-[7px]">{data.summary}</p>
                  </div>
                  <div>
                     <div className="font-bold text-[8px] uppercase mb-1.5 border-b pb-0.5 tracking-wider text-gray-900 border-gray-100">Experience</div>
                     {data.experience.map((exp, i) => (
                         <div key={i} className="mb-2">
                              <div className="flex justify-between font-bold items-baseline">
                                 <span className="text-[8px] text-gray-800">{exp.title}</span>
                                 <span className="text-[6px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">{exp.dates}</span>
                              </div>
                              <div className="text-[7px] mb-0.5 font-semibold text-gray-600">{exp.company}</div>
                              {renderDesc(exp.description)}
                         </div>
                     ))}
                  </div>
             </div>
          </div>
        );

      default: // Standard
        return (
          <div className={`h-full p-6 flex flex-col gap-3 ${textBase}`}>
             <div className="border-b-2 pb-3" style={{ borderColor: themeColor }}>
                 <h2 className="text-2xl font-bold text-gray-900 leading-none uppercase tracking-tighter">{data.fullName}</h2>
                 <div className="text-[10px] font-medium text-gray-600 mt-1">{data.title}</div>
                 <div className="text-[7px] text-gray-400 mt-1.5 flex gap-2 font-medium">
                     <span>{data.location}</span> • <span>{data.email}</span> • <span>{data.phone}</span>
                 </div>
             </div>
             <div>
                  <div className="font-bold text-[8px] uppercase tracking-wider mb-0.5" style={{ color: themeColor }}>Summary</div>
                  <p className="text-justify text-gray-700 text-[7px] leading-relaxed">{data.summary}</p>
             </div>
             <div className="overflow-hidden">
                  <div className="font-bold text-[8px] uppercase tracking-wider mb-1.5" style={{ color: themeColor }}>Experience</div>
                  {data.experience.map((exp, i) => (
                     <div key={i} className="mb-2.5">
                         <div className="flex justify-between items-baseline">
                             <span className="font-bold text-[9px] text-gray-800">{exp.title}</span>
                             <span className="text-gray-500 font-medium text-[7px]">{exp.dates}</span>
                         </div>
                         <div className="font-semibold text-[8px] mb-0.5 text-gray-700">{exp.company}</div>
                         <ul className="list-disc ml-3 space-y-0.5 text-gray-600 text-[7px]">
                           {exp.description.map((d, j) => <li key={j}>{d}</li>)}
                         </ul>
                     </div>
                  ))}
             </div>
             <div>
                 <div className="font-bold text-[8px] uppercase tracking-wider mb-0.5" style={{ color: themeColor }}>Education</div>
                 {data.education.map((edu, i) => (
                     <div key={i} className="mb-1.5">
                         <div className="flex justify-between items-baseline text-[7px] mb-0.5">
                             <span className="font-bold text-gray-800">{edu.school}</span>
                             <span className="text-gray-500">{edu.dates}</span>
                         </div>
                         <div className="text-[7px] font-medium text-gray-700">{edu.degree}</div>
                     </div>
                 ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div onClick={onClick} className={cardClasses}>
      <LayoutContent />
      {/* Click Overlay (Only if not active) */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors z-20" />
      )}
    </div>
  );
};


const LandingPage: React.FC<LandingPageProps> = ({ onStart, demos, onLoadDemo, onOpenOpportunities, onOpenSupport, onOpenExamples }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- 3D Carousel State ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Define the resumes for the showcase
  const showcaseData: { data: ResumeData, layout: 'standard' | 'classic' | 'modern' | 'sidebar' | 'minimal' }[] = [
    { data: demos[0], layout: 'modern' }, // Alex Chen (Center initially)
    { data: demos[1], layout: 'standard' }, // Sarah Jenkins
    { data: demos[2], layout: 'sidebar' }, // Jordan Lee
    { data: { ...demos[0], fullName: 'Michael Scott' }, layout: 'minimal' },
    { data: { ...demos[1], fullName: 'Pam Beesly' }, layout: 'classic' },
  ];

  // Auto-rotation Logic
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseData.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [isHovered, showcaseData.length]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 3D Style Calculation
  const getCardStyle = (index: number) => {
    const total = showcaseData.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;
    
    const isCenter = offset === 0;
    const isRight = offset === 1;
    const isLeft = offset === -1 || offset === total - 1;

    let style: React.CSSProperties = {
        position: 'absolute',
        transition: 'all 0.8s cubic-bezier(0.25, 1, 0.3, 1)', // Smooth transition for 3D layout
        transformStyle: 'preserve-3d',
        top: 0,
        left: '50%',
        marginLeft: '-180px', // Half of card width (360px)
    };

    if (isCenter) {
        style = {
            ...style,
            zIndex: 30,
            opacity: 1,
            transform: 'translateX(0) scale(1) rotateY(0deg)',
            filter: 'brightness(100%)',
            pointerEvents: 'auto',
        };
    } else if (isRight) {
        style = {
            ...style,
            zIndex: 20,
            opacity: 0.7,
            // Move right, scale down, rotate towards center
            transform: 'translateX(65%) scale(0.8) rotateY(-25deg)',
            filter: 'brightness(70%) blur(0.5px)',
            pointerEvents: 'auto',
            cursor: 'pointer'
        };
    } else if (isLeft) {
         style = {
            ...style,
            zIndex: 20,
            opacity: 0.7,
            // Move left, scale down, rotate towards center
            transform: 'translateX(-65%) scale(0.8) rotateY(25deg)',
            filter: 'brightness(70%) blur(0.5px)',
            pointerEvents: 'auto',
            cursor: 'pointer'
        };
    } else {
        style = {
            ...style,
            zIndex: 0,
            opacity: 0,
            transform: 'translateX(0) scale(0.5) rotateY(0deg)',
            pointerEvents: 'none'
        };
    }

    return style;
  };

  return (
    <div className="min-h-screen bg-[#4A0D18] text-white font-sans selection:bg-[#FFB088] selection:text-[#4A0D18] flex flex-col relative overflow-x-hidden">
        
        {/* Fixed Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-[#751A2B] rounded-full blur-[100px] opacity-60 animate-blob"></div>
            <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-[#9C1D3B] rounded-full blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2E050D] rounded-full blur-[90px] opacity-80 animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Navbar */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#4A0D18]/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-4'}`}>
            <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={onStart}>
                     {/* Logo */}
                     <div className="w-8 h-8 text-white transition-transform group-hover:scale-110 duration-300">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                            <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                            <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight opacity-90">Talent Bridge</span>
                </div>
                
                <div className="hidden md:flex items-center gap-4 ml-auto">
                    <button 
                        onClick={onOpenSupport}
                        className="px-4 py-2 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        Contact Support
                    </button>
                    <button 
                        onClick={onStart}
                        className="relative overflow-hidden px-5 py-2 bg-[#D93058] text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-red-900/40 group"
                    >
                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                         <span className="relative z-10">Build Resume</span>
                    </button>
                </div>
            </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-6 px-4 text-center">
            
            {/* Announcement Pill */}
            <div className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-6 animate-fade-in-up">
                <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#5C1523_0%,#ffffff_50%,#5C1523_100%)]" />
                <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#5C1523] px-5 py-1.5 backdrop-blur-3xl">
                    <span className="text-[#FFD700] mr-2 text-base animate-pulse">⚡</span>
                    <span className="text-sm font-medium text-gray-200">Talent Bridge AI v2.0 is now live</span>
                </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05] max-w-4xl mx-auto animate-fade-in-up delay-100">
                Launch your <span className="relative inline-block text-white">
                  career
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#D93058] overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-draw-line" />
                  </svg>
                </span> at<br className="hidden md:block" />
                top companies.
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 mb-8 animate-fade-in-up delay-300">
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                    <button 
                        onClick={onStart}
                        className="relative overflow-hidden px-8 py-3.5 bg-[#D93058] rounded-xl font-bold text-lg text-white transition-all shadow-[0_0_20px_-5px_rgba(217,48,88,0.4)] transform hover:scale-105 active:scale-95 w-full sm:w-auto min-w-[180px] group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />
                        Get Started
                    </button>
                    <button 
                         onClick={() => onOpenOpportunities('')}
                         className="group px-8 py-3.5 bg-transparent border border-white/20 rounded-xl font-bold text-lg text-white hover:bg-white/5 transition-all flex flex-col items-center justify-center leading-none transform hover:scale-105 active:scale-95 w-full sm:w-auto min-w-[180px]"
                    >
                        <span>Match with Jobs</span>
                    </button>
                </div>
            </div>

            {/* Brio AI Badge - PROMINENT & RESTORED WITH GLOW (Smaller Version) */}
            <div className="mb-20 animate-fade-in-up delay-400 relative z-20 group animate-float">
                 <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-b from-[#262626] to-[#0a0a0a] border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-105 cursor-pointer ring-1 ring-white/30">
                      {/* Custom Moon Icon */}
                      <div className="relative w-8 h-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-md">
                             <path d="M72 45C72 63.2254 57.2254 78 39 78C20.7746 78 6 63.2254 6 45C6 29.8 16 17 30 13C27 17 25 22 25 28C25 46.2254 39.7746 61 58 61C64 61 69 59 73 56C72.5 52 72 48 72 45Z" fill="#FFFBEB" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                             <ellipse cx="32" cy="42" rx="2.5" ry="3.5" fill="#1F2937"/>
                             <ellipse cx="48" cy="42" rx="2.5" ry="3.5" fill="#1F2937"/>
                             <circle cx="28" cy="50" r="3" fill="#F472B6" opacity="0.5"/>
                             <circle cx="52" cy="50" r="3" fill="#F472B6" opacity="0.5"/>
                             <path d="M37 52Q40 55 43 52" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
                             <path d="M82 20L84 26L90 28L84 30L82 36L80 30L74 28L80 26L82 20Z" fill="#FCD34D" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round"/>
                             <circle cx="88" cy="15" r="2" fill="#FCD34D"/>
                          </svg>
                      </div>
                      <span className="text-lg font-medium text-gray-200 tracking-wide pr-1 drop-shadow-sm">Supercharged by <span className="text-white font-bold">Brio AI</span></span>
                 </div>
            </div>

            {/* Floating Left Widget 1 - Job Match */}
            <div className="hidden xl:block absolute top-[20%] left-10 animate-float-slow pointer-events-none z-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform -rotate-6 w-64">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-lg">JD</div>
                        <div>
                            <div className="text-white font-bold text-sm">John Doe</div>
                            <div className="text-green-300 text-xs font-bold uppercase tracking-wide">Offer Accepted</div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-200 italic leading-relaxed">
                        "The AI suggestions helped me land a Senior role at TechCorp in 2 weeks!"
                    </div>
                </div>
            </div>

            {/* Floating Left Widget 2 - Interview */}
            <div className="hidden xl:block absolute top-[55%] left-16 animate-float-delayed pointer-events-none z-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform rotate-3 w-60">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">Interview Invite</div>
                            <div className="text-blue-200 text-xs">Netflix • Senior UI Eng</div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between text-xs text-gray-200">
                        <span>Tomorrow, 2:00 PM</span>
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Confirmed</span>
                    </div>
                </div>
            </div>

            {/* Floating Right Widget 1 - ATS Score */}
            <div className="hidden xl:block absolute top-[25%] right-10 animate-float-delayed pointer-events-none z-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform rotate-6 w-56">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-200 text-xs font-bold uppercase tracking-wider">Resume Score</span>
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">98/100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-3">
                        <div className="bg-gradient-to-r from-green-400 to-green-300 h-1.5 rounded-full w-[98%] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    </div>
                    <div className="space-y-1.5">
                         <div className="flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                             <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[8px]">✓</div>
                             Keywords Optimized
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                             <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[8px]">✓</div>
                             Formatting Fixed
                         </div>
                    </div>
                </div>
            </div>

             {/* Floating Right Widget 2 - Salary/Growth */}
            <div className="hidden xl:block absolute top-[60%] right-12 animate-float-slow pointer-events-none z-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform -rotate-2 w-52">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">Profile Views</div>
                            <div className="text-purple-200 text-xs">Last 7 days</div>
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">452</span>
                        <span className="text-green-400 text-sm font-bold mb-1 flex items-center">
                            <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            28%
                        </span>
                    </div>
                </div>
            </div>

            {/* 3D CAROUSEL SHOWCASE - Updated 3-Card Layout */}
            <div 
              className="relative w-full max-w-[1200px] h-[650px] mx-auto flex items-center justify-center perspective-1000 mb-16 animate-fade-in-up delay-500"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-full h-full transform-style-3d">
                  {showcaseData.map((item, index) => {
                    const style = getCardStyle(index);
                    const total = showcaseData.length;
                    let offset = (index - activeIndex + total) % total;
                    if (offset > total / 2) offset -= total;
                    const isSide = offset !== 0;

                    return (
                      <div 
                        key={index}
                        style={style}
                        onClick={() => setActiveIndex(index)}
                      >
                        <ShowcaseResume 
                          data={item.data}
                          layout={item.layout as any}
                          isActive={index === activeIndex}
                          isSide={isSide}
                          onClick={() => onLoadDemo(item.data)}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="md:hidden absolute inset-0 bg-[#4A0D18] z-50 flex flex-col items-center overflow-y-auto py-6 gap-4">
                     <p className="text-white/50 text-xs uppercase tracking-widest sticky top-0 bg-[#4A0D18] py-2 w-full text-center z-10">Swipe to view templates</p>
                     {showcaseData.map((item, index) => (
                        <div key={index} className="scale-90 origin-top">
                           <ShowcaseResume 
                            data={item.data}
                            layout={item.layout as any}
                            isActive={true}
                            onClick={() => onLoadDemo(item.data)}
                          />
                        </div>
                     ))}
                </div>
            </div>

        </section>

        {/* SOCIAL PROOF STRIP */}
        <div className="relative z-10 border-y border-white/5 bg-[#1A0509]/50 py-10 animate-on-scroll">
             <div className="max-w-6xl mx-auto px-5 text-center">
                 <p className="text-gray-400 text-xs font-medium tracking-widest uppercase mb-6 opacity-80">Trusted by students at 50+ Universities</p>
                 <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 hover:opacity-100 transition-all duration-500">
                     <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:scale-110 transition-transform cursor-default">Stanford</span>
                     <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:scale-110 transition-transform cursor-default">Berkeley</span>
                     <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:scale-110 transition-transform cursor-default">MIT</span>
                     <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:scale-110 transition-transform cursor-default">Harvard</span>
                     <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:scale-110 transition-transform cursor-default">Georgia Tech</span>
                 </div>
             </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <section className="relative z-10 py-24 px-5 bg-[#2E050D]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for your success</h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg">
                        Three simple steps to transform your career trajectory.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="animate-on-scroll bg-[#4A0D18]/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-500 delay-100">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#D93058] opacity-10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-20 transition-opacity"></div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md shadow-white/5 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">1. Collaborate, Don't Type</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Forget staring at a blank cursor. Chat with our AI architect like you're talking to a career coach.
                        </p>
                    </div>
                    {/* Step 2 */}
                    <div className="animate-on-scroll bg-[#4A0D18]/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-500 delay-200">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500 opacity-10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-20 transition-opacity"></div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md shadow-white/5 group-hover:scale-110 transition-transform">
                           <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">2. Polish to Perfection</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Watch your rough notes transform into professional bullet points. Our engine targets high-value keywords.
                        </p>
                    </div>
                    {/* Step 3 */}
                    <div className="animate-on-scroll bg-[#4A0D18]/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-500 delay-300">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-green-500 opacity-10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-20 transition-opacity"></div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md shadow-white/5 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                         </div>
                        <h3 className="text-xl font-bold mb-2">3. Apply with Confidence</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Match with roles that fit your new resume. We’ll even draft a tailored cover letter for each application.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ & TRUST */}
        <section className="relative z-10 py-20 px-5 bg-[#1A0509] border-t border-white/5">
            <div className="max-w-3xl mx-auto">
                {/* Trust Icons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center animate-on-scroll">
                    <div className="flex flex-col items-center group">
                        <div className="w-12 h-12 bg-[#D93058]/10 text-[#D93058] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h4 className="font-bold mb-1 text-lg group-hover:text-white transition-colors">Private by Design</h4>
                        <p className="text-sm text-gray-500">We never sell your personal data.</p>
                    </div>
                    <div className="flex flex-col items-center group">
                         <div className="w-12 h-12 bg-[#D93058]/10 text-[#D93058] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                        </div>
                        <h4 className="font-bold mb-1 text-lg group-hover:text-white transition-colors">Secure Cloud Storage</h4>
                        <p className="text-sm text-gray-500">Save edits for your next role.</p>
                    </div>
                    <div className="flex flex-col items-center group">
                         <div className="w-12 h-12 bg-[#D93058]/10 text-[#D93058] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className="font-bold mb-1 text-lg group-hover:text-white transition-colors">Fast & No-Nonsense</h4>
                        <p className="text-sm text-gray-500">No watermarks on free downloads.</p>
                    </div>
                </div>

                {/* FAQ */}
                <h3 className="text-3xl font-bold text-center mb-10 animate-on-scroll">Frequently Asked Questions</h3>
                <div className="space-y-4 animate-on-scroll delay-200">
                    {[
                        { q: "Is Talent Bridge really free?", a: "Yes! You can build, customize, and download your resume as a PDF completely for free. We offer one professional template that is always free." },
                        { q: "Will these resumes pass ATS scanners?", a: "Absolutely. Our templates are engineered specifically to be readable by Applicant Tracking Systems (ATS) while still looking great to human recruiters." },
                        { q: "Can I import my LinkedIn profile?", a: "Yes, you can upload an existing PDF or paste your LinkedIn history to get a head start." }
                    ].map((item, i) => (
                        <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => toggleFaq(i)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors group"
                            >
                                <span className="font-bold text-lg group-hover:text-[#D93058] transition-colors">{item.q}</span>
                                <span className="text-[#D93058] text-xl transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>{openFaq === i ? '−' : '+'}</span>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 py-4 bg-white/5 text-gray-300 text-sm leading-relaxed border-t border-white/5">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-10 bg-[#0F0205] pt-12 pb-8 px-5 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 text-white">
                                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                        <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                                        <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                                    </svg>
                                </div>
                            <span className="font-bold text-xl">Talent Bridge</span>
                        </div>
                        <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
                            Empowering students and professionals to craft career-defining resumes with the power of Artificial Intelligence.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <a href="https://www.linkedin.com/in/manoj07ar/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#0077B5] transition-colors text-lg hover:scale-110 transform">in</a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><button onClick={onStart} className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Resume Builder</button></li>
                            <li><button onClick={() => onOpenOpportunities('')} className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Opportunities</button></li>
                            <li><button onClick={onOpenExamples} className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Examples</button></li>
                            <li><a href="#" className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">Legal</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#D93058] transition-colors hover:translate-x-1 transform duration-200 block">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Talent Bridge AI. All rights reserved.</p>
                    <div className="flex gap-6">
                         <span className="text-gray-600 text-xs">Made with ❤️ for students</span>
                    </div>
                </div>
            </div>
        </footer>
        <style>{`
          .animate-fade-in-up {
              animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
              transform: translateY(20px);
          }
          .animate-gradient-x {
              background-size: 200% auto;
              animation: gradientX 3s linear infinite;
          }
          .animate-draw-line {
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
              animation: drawLine 2.5s ease-out infinite alternate;
          }
          @keyframes drawLine {
              0% { stroke-dashoffset: 100; }
              40% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 0; }
          }
          @keyframes fadeInUp {
              to { opacity: 1; transform: translateY(0); }
          }
          @keyframes gradientX {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
          }
        `}</style>
    </div>
  );
};

export default LandingPage;