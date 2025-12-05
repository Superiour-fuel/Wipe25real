import React from 'react';
import { ResumeData } from '../types';
import { DEMO_RESUMES } from '../data/demoResumes';

interface ExamplesPageProps {
  onSelect: (data: ResumeData) => void;
  onBack: () => void;
}

const COLORS = [
    { name: 'Professional Blue', hex: '#2563EB' },
    { name: 'Executive Black', hex: '#111827' },
    { name: 'Creative Red', hex: '#D93058' },
    { name: 'Growth Green', hex: '#059669' },
    { name: 'Royal Purple', hex: '#7C3AED' },
    { name: 'Vibrant Orange', hex: '#EA580C' },
];

const ExamplesPage: React.FC<ExamplesPageProps> = ({ onSelect, onBack }) => {
  // Create variations by mixing demos and colors
  const templates = COLORS.map((color, idx) => {
      const base = DEMO_RESUMES[idx % DEMO_RESUMES.length];
      return {
          ...base,
          themeColor: color.hex,
          // Generate a display name for the template
          templateName: `${color.name} ${base.title.split(' ')[0]}`, 
          id: `template-${idx}`
      };
  });

  return (
    <div className="min-h-screen bg-[#4A0D18] text-white font-sans flex flex-col relative overflow-hidden">
        {/* Background Gradients (Consistent with Landing Page) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#751A2B] rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2E050D] rounded-full blur-[90px] opacity-80"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Navbar - Decreased */}
        <nav className="relative z-50 py-6 px-6 flex items-center justify-between max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
                <div className="w-10 h-10 text-white">
                     <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                         <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                         <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                         <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                     </svg>
                 </div>
                 <span className="font-bold text-2xl tracking-tight">Talent Bridge</span>
            </div>
            <button onClick={onBack} className="text-gray-300 hover:text-white font-medium transition-colors text-base">
                 Back to Home
            </button>
        </nav>

        {/* Header - Decreased */}
        <div className="relative z-10 text-center py-12 px-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose a Template</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Select a design to start building. Our AI will help you customize content and formatting instantly.
            </p>
        </div>

        {/* Grid - Decreased */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <div 
                        key={template.id}
                        className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-xl"
                        onClick={() => onSelect(template)}
                    >
                        {/* Mini Resume Preview - Decreased */}
                        <div className="h-[340px] bg-white relative p-6 overflow-hidden select-none text-left">
                            {/* Color Bar */}
                            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: template.themeColor }}></div>
                            
                            {/* Header */}
                            <div className="mb-4 mt-2 border-b border-gray-100 pb-3">
                                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{template.fullName}</h2>
                                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: template.themeColor }}>{template.title}</p>
                                <div className="flex flex-wrap gap-x-2 text-[8px] text-gray-500 font-medium">
                                    <span>{template.location}</span>
                                    <span>•</span>
                                    <span>{template.email}</span>
                                </div>
                            </div>
                            
                            {/* Summary */}
                            <div className="mb-3">
                                <h4 className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1">Profile</h4>
                                <p className="text-[8px] leading-relaxed text-gray-600 text-justify line-clamp-3">
                                    {template.summary}
                                </p>
                            </div>

                            {/* Experience */}
                            <div className="mb-3">
                                <h4 className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-2 pb-0.5 border-b border-gray-100">Experience</h4>
                                {template.experience.slice(0, 2).map((exp, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="text-[9px] font-bold text-gray-800">{exp.title}</span>
                                            <span className="text-[7px] text-gray-400">{exp.dates}</span>
                                        </div>
                                        <div className="text-[8px] font-semibold mb-0.5" style={{ color: template.themeColor }}>{exp.company}</div>
                                        <ul className="list-disc ml-3 text-[7px] text-gray-500 leading-relaxed space-y-0.5">
                                            {exp.description.slice(0, 2).map((pt, j) => (
                                                <li key={j} className="line-clamp-1">{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Education (If space permits) */}
                            <div className="mb-3">
                                <h4 className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-2 pb-0.5 border-b border-gray-100">Education</h4>
                                {template.education.slice(0, 1).map((edu, i) => (
                                     <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[9px] font-bold text-gray-800">{edu.school}</span>
                                            <span className="text-[7px] text-gray-400">{edu.dates}</span>
                                        </div>
                                        <span className="text-[7px] text-gray-500">{edu.degree}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5">
                                {template.skills.slice(0, 4).map((skill, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[7px] font-medium">{skill}</span>
                                ))}
                                <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded text-[7px] font-medium">+4 more</span>
                            </div>

                             {/* Fade Out Overlay */}
                             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#4A0D18]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <span className="px-6 py-3 bg-white text-[#4A0D18] font-bold text-base rounded-lg transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                                    Use This Design
                                </span>
                            </div>
                        </div>

                        {/* Card Footer - Decreased */}
                        <div className="bg-[#1A0509] p-4 border-t border-white/10 relative z-20">
                            <h3 className="font-bold text-lg text-white">{template.templateName}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.themeColor }}></div>
                                <span className="text-xs text-gray-400">ATS Optimized • {template.title}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ExamplesPage;