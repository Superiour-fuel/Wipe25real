import React from 'react';

interface SupportPageProps {
  onBack: () => void;
}

const team = [
  { name: 'Rishel', link: 'https://www.linkedin.com/in/rishel-lijesh-7643a4377/' },
  { name: 'Manoj', link: 'https://www.linkedin.com/in/manoj07ar/' },
  { name: 'Sai', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
  { name: 'Milan', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
];

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#4A0D18] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#751A2B] rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2E050D] rounded-full blur-[80px] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navbar - Decreased */}
      <nav className="relative z-50 py-6 px-6 flex items-center justify-between max-w-6xl mx-auto w-full">
         <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
             <div className="w-10 h-10 text-white">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                    <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                    <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                    <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight opacity-90">Talent Bridge</span>
         </div>
         <button onClick={onBack} className="text-gray-300 hover:text-white font-medium transition-colors text-base">
            Back to Home
         </button>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">Contact Support</h1>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl animate-fade-in-up delay-100">
          Meet the team behind Talent Bridge. Connect with us on LinkedIn for support or inquiries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full animate-fade-in-up delay-200">
          {team.map((member, idx) => {
            const isTopSupport = member.name === 'Manoj' || member.name === 'Sai';
            
            return (
              <a 
                key={idx} 
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-[#2E050D] border p-8 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center relative ${
                    isTopSupport 
                        ? 'border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.15)] hover:border-[#FDB931]' 
                        : 'border-[#852839] hover:border-[#D93058]'
                }`}
              >
                {/* Top Support Badge */}
                {isTopSupport && (
                    <div className="absolute -top-3 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#4A0D18] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border-2 border-[#4A0D18] z-20">
                        Top Support
                    </div>
                )}

                <div className={`w-20 h-20 rounded-full mb-6 flex items-center justify-center text-3xl transition-colors shadow-lg font-bold ${
                    isTopSupport 
                        ? 'bg-[#FFD700] text-[#4A0D18] ring-2 ring-[#FFD700]/50 ring-offset-2 ring-offset-[#2E050D]' 
                        : 'bg-[#751A2B] group-hover:bg-[#D93058] text-white'
                }`}>
                  {member.name[0]}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                
                <p className={`text-sm font-medium uppercase tracking-wider mb-6 transition-colors ${
                    isTopSupport ? 'text-[#FFD700]' : 'text-[#D93058] group-hover:text-white'
                }`}>
                    LinkedIn Profile
                </p>
                
                <div className={`mt-auto px-6 py-2.5 rounded-full border text-sm transition-colors font-semibold ${
                    isTopSupport
                        ? 'bg-[#FFD700] text-[#4A0D18] border-[#FFD700] hover:bg-white hover:text-black hover:border-white'
                        : 'border-white/20 group-hover:bg-white group-hover:text-[#4A0D18]'
                }`}>
                  Connect
                </div>
              </a>
            );
          })}
        </div>
      </div>
      
       <style>{`
            .animate-fade-in-up {
                animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                opacity: 0;
                transform: translateY(20px);
            }
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .delay-100 { animation-delay: 100ms; }
            .delay-200 { animation-delay: 200ms; }
        `}</style>
    </div>
  );
};

export default SupportPage;