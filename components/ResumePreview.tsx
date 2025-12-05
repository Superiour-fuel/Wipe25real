import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  loading?: boolean;
  onUpdate: (data: ResumeData) => void;
}

// --- Icons (Scaled Down) ---
const EditIcon = ({ className }: { className?: string }) => (
  <span 
    className={`ml-2 text-gray-300 group-hover:text-gray-400 transition-colors cursor-pointer inline-flex items-center justify-center opacity-0 group-hover:opacity-100 ${className}`} 
    title="Edit section"
    aria-hidden="true"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
    </svg>
  </span>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);

const AlertIcon = () => (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

// --- Editable Components ---

const EditableInput = ({ value, onChange, className, placeholder, style, ariaLabel, ...props }: any) => (
  <input
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className={`bg-transparent border border-dashed border-transparent hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded px-1.5 -mx-1.5 transition-all outline-none w-full placeholder:text-gray-300 placeholder:italic placeholder:font-normal ${className}`}
    placeholder={placeholder || "Click to add..."}
    aria-label={ariaLabel || placeholder || "Edit text"}
    spellCheck={true}
    style={style}
    {...props}
  />
);

const EditableTextarea = ({ value, onChange, className, placeholder, style, ariaLabel, ...props }: any) => {
    const adjustHeight = (el: any) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };
    return (
      <textarea
        value={value || ''}
        onChange={(e) => {
            onChange(e.target.value);
            adjustHeight(e.target);
        }}
        ref={(el) => { if(el) adjustHeight(el) }}
        className={`bg-transparent border border-dashed border-transparent hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded px-1.5 -mx-1.5 transition-all outline-none w-full resize-none overflow-hidden placeholder:text-gray-300 placeholder:italic placeholder:font-normal ${className}`}
        placeholder={placeholder || "Click to add content..."}
        aria-label={ariaLabel || placeholder || "Edit text block"}
        spellCheck={true}
        rows={1}
        style={style}
        {...props}
      />
    );
};

// --- Analytics Logic ---
const calculateResumeScore = (data: ResumeData) => {
    let score = 0;
    const checks = [];
    if (data.fullName) score += 5;
    if (data.email) score += 5;
    if (data.phone) score += 5;
    if (data.location) score += 5;
    const summaryWords = data.summary ? data.summary.split(' ').length : 0;
    if (summaryWords > 20 && summaryWords < 100) {
        score += 15;
        checks.push({ label: "Summary length is optimal", passed: true });
    } else {
        checks.push({ label: "Summary should be 20-100 words", passed: false });
        if (summaryWords > 0) score += 5;
    }
    if (data.experience.length > 0) {
        score += 10;
        let bullets = 0;
        let weakVerbs = 0;
        const strongVerbs = /^(Created|Developed|Managed|Led|Designed|Implemented|Increased|Reduced|Saved|Achieved|Launched)/i;
        data.experience.forEach(exp => {
            if (exp.description) {
                bullets += exp.description.length;
                exp.description.forEach(d => {
                    if (strongVerbs.test(d)) score += 2; 
                });
            }
        });
        if (bullets >= 3) {
             score += 10;
             checks.push({ label: "Good use of bullet points", passed: true });
        } else {
             checks.push({ label: "Add more bullet points to experience", passed: false });
        }
    } else {
        checks.push({ label: "Missing work experience", passed: false });
    }
    if (data.skills.length >= 5) {
        score += 15;
        checks.push({ label: "Strong skills section", passed: true });
    } else {
        if (data.skills.length > 0) score += 5;
        checks.push({ label: "Add at least 5 core skills", passed: false });
    }
    const numbersRegex = /\d+%|\$\d+|\d+x|\d+ hours|\d+ users/i;
    let quantifiedCount = 0;
    data.experience.forEach(exp => {
        exp.description?.forEach(d => {
            if (numbersRegex.test(d)) quantifiedCount++;
        });
    });
    if (quantifiedCount >= 2) {
        score += 15;
        checks.push({ label: "Includes quantified impact (%, $)", passed: true });
    } else {
        checks.push({ label: "Add numbers to show impact (e.g. 'Increased sales by 20%')", passed: false });
    }
    return { score: Math.min(100, score), checks };
};

// --- Main Component ---

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, loading, onUpdate }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);
  
  const hasContent = data.fullName || data.experience.length > 0 || data.education.length > 0;
  const themeColor = data.themeColor || "#374151";
  const { score, checks } = calculateResumeScore(data);

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) return;
    setIsDownloading(true);
    const opt = {
      margin: 0,
      filename: `${(data.fullName || 'Resume').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      // @ts-ignore
      if (window.html2pdf) {
        // @ts-ignore
        await window.html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF generator is loading, please try again in a moment.");
      }
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const updateExperience = (index: number, field: keyof Experience, val: any) => {
      const newExp = [...data.experience];
      newExp[index] = { ...newExp[index], [field]: val };
      onUpdate({ ...data, experience: newExp });
  };
  const updateExpDesc = (expIndex: number, descIndex: number, val: string) => {
      const newExp = [...data.experience];
      const newDesc = [...newExp[expIndex].description];
      newDesc[descIndex] = val;
      newExp[expIndex].description = newDesc;
      onUpdate({ ...data, experience: newExp });
  };
  const updateEducation = (index: number, field: keyof Education, val: any) => {
      const newEdu = [...data.education];
      newEdu[index] = { ...newEdu[index], [field]: val };
      onUpdate({ ...data, education: newEdu });
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Toolbar - Decreased Size */}
      <div className="absolute top-4 right-6 z-20 flex gap-4" data-html2canvas-ignore="true">
        {/* Analytics Button */}
        <button
            onClick={() => setShowAnalytics(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-all transform active:scale-95`}
        >
            <div className={`w-3 h-3 rounded-full ${score > 80 ? 'bg-[#059669]' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-sm">{score}% Score</span>
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={!hasContent || loading || isDownloading}
          className={`flex items-center gap-2 bg-[#D93058] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#b02243] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${!hasContent ? 'hidden' : ''}`}
          title="Download as PDF"
        >
          {isDownloading ? (
            <span className="text-sm font-medium">Saving...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Download PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start dark-scrollbar">
        <div 
          id="resume-preview-content"
          className={`a4-paper bg-white p-10 transition-all duration-500 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.1)] ${loading ? 'opacity-90 blur-[1px]' : 'opacity-100 blur-0'} relative`}
        >
          {/* Sample CV Badge */}
          <div className="absolute top-0 right-0 p-4" data-html2canvas-ignore="true">
             <span className="inline-block bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-md border border-gray-200">
                Sample CV
             </span>
          </div>

          {!hasContent ? (
            <div className="h-full w-full flex flex-col relative items-center justify-center opacity-50">
               <div className="animate-pulse space-y-4 w-full max-w-sm">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                  <div className="space-y-3 pt-8">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center p-6 bg-white/90 rounded-xl shadow-lg border border-gray-100">
                       <p className="font-bold text-gray-800 text-lg mb-1">Your Resume Canvas</p>
                       <p className="text-gray-500 text-sm">Start chatting to build your resume</p>
                   </div>
               </div>
            </div>
          ) : (
            <div className="text-gray-800">
              <header className="border-b-2 pb-6 mb-6 group relative" style={{ borderColor: themeColor }}>
                <div className="absolute -right-4 top-0">
                    <EditIcon />
                </div>
                <EditableInput
                    value={data.fullName}
                    onChange={(v: string) => onUpdate({ ...data, fullName: v })}
                    className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2"
                    placeholder="Your Full Name"
                    ariaLabel="Full Name"
                />
                <EditableInput
                    value={data.title}
                    onChange={(v: string) => onUpdate({ ...data, title: v })}
                    className="text-lg font-medium mb-4"
                    style={{ color: themeColor }}
                    placeholder="Target Job Title"
                    ariaLabel="Job Title"
                />
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 items-center">
                  <div className="flex items-center flex-1 min-w-[150px]">
                    <span className="opacity-50 mr-1.5">✉</span>
                    <EditableInput
                        value={data.email}
                        onChange={(v: string) => onUpdate({ ...data, email: v })}
                        placeholder="email@example.com"
                    />
                  </div>
                  <div className="flex items-center flex-1 min-w-[100px]">
                    <span className="opacity-50 mr-1.5">📞</span>
                    <EditableInput
                        value={data.phone}
                        onChange={(v: string) => onUpdate({ ...data, phone: v })}
                        placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex items-center flex-1 min-w-[100px]">
                    <span className="opacity-50 mr-1.5">📍</span>
                    <EditableInput
                        value={data.location}
                        onChange={(v: string) => onUpdate({ ...data, location: v })}
                        placeholder="City, State"
                    />
                  </div>
                </div>
              </header>

              <section className="mb-6 group relative">
                  <div className="flex items-center mb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: themeColor }}>Professional Summary</h3>
                      <EditIcon />
                  </div>
                  <EditableTextarea
                    value={data.summary}
                    onChange={(v: string) => onUpdate({ ...data, summary: v })}
                    className="text-gray-700 leading-relaxed text-xs"
                    placeholder="Briefly describe your professional background..."
                  />
              </section>

              <section className="mb-6 group">
                  <div className="flex items-center mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: themeColor }}>Core Competencies</h3>
                    <EditIcon />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills && data.skills.length > 0 ? (
                        data.skills.map((skill, index) => (
                        <div 
                            key={index} 
                            onMouseEnter={() => setHoveredSkillIndex(index)}
                            onMouseLeave={() => setHoveredSkillIndex(null)}
                            style={{
                                backgroundColor: hoveredSkillIndex === index ? `${themeColor}26` : undefined, // ~15% opacity (hex 26)
                                borderColor: hoveredSkillIndex === index ? themeColor : 'transparent',
                                color: hoveredSkillIndex === index ? themeColor : undefined
                            }}
                            className="bg-gray-100 text-gray-800 rounded text-xs font-medium flex items-center group/skill focus-within:ring-2 focus-within:ring-blue-500/20 transition-all border border-transparent"
                        >
                             <input 
                                value={skill}
                                onChange={(e) => {
                                    const newSkills = [...data.skills];
                                    newSkills[index] = e.target.value;
                                    onUpdate({ ...data, skills: newSkills });
                                }}
                                style={{
                                    color: 'inherit'
                                }}
                                className="bg-transparent border-none outline-none w-auto min-w-[60px] max-w-[200px] px-3 py-1.5 text-center placeholder:text-gray-400 placeholder:italic"
                             />
                        </div>
                        ))
                    ) : (
                        <div className="text-gray-400 text-xs italic p-2 border border-dashed border-gray-200 rounded w-full">No skills listed.</div>
                    )}
                  </div>
              </section>

              <section className="mb-6">
                  <div className="flex items-center mb-4 border-b pb-2 group" style={{ borderColor: themeColor }}>
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: themeColor }}>Experience</h3>
                      <EditIcon />
                  </div>
                  <div className="space-y-6">
                    {data.experience && data.experience.map((exp, idx) => (
                        <div key={exp.id || idx} className="group relative">
                            <div className="flex justify-between items-baseline mb-1 gap-4">
                                <div className="flex items-center flex-1">
                                <EditableInput 
                                    value={exp.title} 
                                    onChange={(v: string) => updateExperience(idx, 'title', v)}
                                    className="font-bold text-gray-900 text-sm"
                                    placeholder="Job Title"
                                />
                                <EditIcon className="ml-2" />
                                </div>
                            <div className="w-32 shrink-0">
                                <EditableInput 
                                    value={exp.dates} 
                                    onChange={(v: string) => updateExperience(idx, 'dates', v)}
                                    className="text-xs text-gray-500 font-medium text-right"
                                    placeholder="Dates"
                                />
                            </div>
                            </div>
                            <EditableInput 
                                value={exp.company} 
                                onChange={(v: string) => updateExperience(idx, 'company', v)}
                                className="text-xs font-semibold mb-2"
                                style={{ color: themeColor }}
                                placeholder="Company Name"
                            />
                            <ul className="list-disc list-outside ml-4 text-xs text-gray-600 space-y-1">
                            {exp.description && exp.description.map((point, pIdx) => (
                                <li key={pIdx}>
                                    <EditableTextarea
                                        value={point}
                                        onChange={(v: string) => updateExpDesc(idx, pIdx, v)}
                                        placeholder="Detail..."
                                    />
                                </li>
                            ))}
                            </ul>
                        </div>
                    ))}
                  </div>
                </section>

                <section className="mb-6">
                  <div className="flex items-center mb-4 border-b pb-2 group" style={{ borderColor: themeColor }}>
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: themeColor }}>Education</h3>
                      <EditIcon />
                  </div>
                  <div className="space-y-4">
                    {data.education && data.education.map((edu, idx) => (
                        <div key={edu.id || idx} className="group relative">
                            <div className="flex justify-between items-baseline mb-1 gap-4">
                            <div className="flex items-center flex-1">
                                <EditableInput 
                                    value={edu.school} 
                                    onChange={(v: string) => updateEducation(idx, 'school', v)}
                                    className="font-bold text-gray-900 text-sm"
                                    placeholder="School Name"
                                />
                                <EditIcon className="ml-2" />
                            </div>
                            <div className="w-32 shrink-0">
                                <EditableInput 
                                    value={edu.dates} 
                                    onChange={(v: string) => updateEducation(idx, 'dates', v)}
                                    className="text-xs text-gray-500 font-medium text-right"
                                    placeholder="Dates"
                                />
                            </div>
                            </div>
                            <div className="text-xs text-gray-700 flex flex-col md:flex-row gap-2">
                            <EditableInput 
                                value={edu.degree} 
                                onChange={(v: string) => updateEducation(idx, 'degree', v)}
                                className="font-semibold"
                                style={{ color: themeColor }}
                                placeholder="Degree"
                            />
                            <EditableInput 
                                value={edu.details} 
                                onChange={(v: string) => updateEducation(idx, 'details', v)}
                                className="text-gray-500"
                                placeholder="Details..."
                            />
                            </div>
                        </div>
                    ))}
                  </div>
                </section>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Modal - Decreased */}
      {showAnalytics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAnalytics(false)}>
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                          <span>📊</span> Resume Score
                      </h2>
                      <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                  </div>
                  <div className="p-8">
                      <div className="flex flex-col items-center mb-8">
                          <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center text-4xl font-bold bg-white ${
                              score > 80 ? 'border-[#059669] text-[#059669]' : score > 50 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'
                          }`}>
                              {score}
                          </div>
                          <p className="mt-3 text-sm text-gray-400 font-medium uppercase tracking-wide">Optimization Level</p>
                      </div>

                      <div className="space-y-3 mb-8">
                          {checks.map((check, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  {check.passed ? <CheckIcon /> : <AlertIcon />}
                                  <span className={`text-sm ${check.passed ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{check.label}</span>
                              </div>
                          ))}
                      </div>

                      <div className="bg-[#D93058]/5 p-4 rounded-xl border border-[#D93058]/20 text-sm text-[#D93058]">
                          <strong>Pro Tip:</strong> Using action verbs and numbers (e.g. "Increased revenue by 20%") drastically improves your chances with ATS systems.
                      </div>
                  </div>
              </div>
          </div>
      )}
      <style>{`
          .animate-fade-in-up {
              animation: fadeInUp 0.3s ease-out forwards;
              opacity: 0;
              transform: translateY(10px);
          }
          @keyframes fadeInUp {
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default ResumePreview;