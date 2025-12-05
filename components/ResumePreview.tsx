import React, { useState, useMemo } from 'react';
import { ResumeData, Experience, Education } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  loading?: boolean;
  onUpdate: (data: ResumeData) => void;
}

// --- Icons ---
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

// --- Dashboard Icons (Optimized) ---
const AtsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const ImpactIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);

const KeywordIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.409.92 3.328 0l5.318-5.318a2.25 2.25 0 000-3.182l-9.58-9.58A3 3 0 009.568 2.25H5.25zM6 6a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

const ReadabilityIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.707 9.707 0 00-6 .783v11.135a9.707 9.707 0 016-.783c1.948 0 3.786.502 5.25 1.411V4.533zM12.75 4.533c1.464-.91 3.302-1.411 5.25-1.411 2.311 0 4.397.783 6 .783v11.135c-1.603 0-3.689-.783-6-.783a9.707 9.707 0 00-5.25.783V4.533z" />
    </svg>
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

// --- Advanced Analytics Logic ---

interface Metric {
    score: number; // 0-100
    label: string;
    details: string[];
}

interface AnalysisResult {
    totalScore: number;
    grade: string;
    metrics: {
        ats: Metric;
        impact: Metric;
        keywords: Metric;
        brevity: Metric;
    };
    actionPlan: string[];
}

const analyzeResume = (data: ResumeData): AnalysisResult => {
    const actionPlan: string[] = [];
    
    // 1. ATS Compatibility (Structure & Contact)
    let atsScore = 0;
    const atsDetails = [];
    if (data.fullName) atsScore += 20; else atsDetails.push("Missing Full Name");
    if (data.email) atsScore += 20; else atsDetails.push("Missing Email");
    if (data.phone) atsScore += 20; else atsDetails.push("Missing Phone Number");
    if (data.location) atsScore += 20; else atsDetails.push("Missing Location");
    if (data.experience.length > 0 && data.education.length > 0) atsScore += 20; 
    else atsDetails.push("Ensure both Experience and Education sections are present");
    
    if (atsScore < 100) actionPlan.push("Complete your contact information for ATS parsing.");

    // 2. Impact & Verbs (Strong verbs & Numbers)
    let impactScore = 0;
    const impactDetails = [];
    const strongVerbs = /^(spearheaded|orchestrated|architected|developed|managed|led|designed|implemented|increased|reduced|saved|achieved|launched|generated|optimized|transformed)/i;
    const numbersRegex = /\d+%|\$\d+|\d+x|\d+ users|\d+k|\d+m/i;
    
    let bulletCount = 0;
    let strongVerbCount = 0;
    let quantifiedCount = 0;

    data.experience.forEach(exp => {
        exp.description.forEach(desc => {
            bulletCount++;
            if (strongVerbs.test(desc)) strongVerbCount++;
            if (numbersRegex.test(desc)) quantifiedCount++;
        });
    });

    if (bulletCount === 0) {
        impactDetails.push("Add bullet points to your experience.");
    } else {
        // Calculate verb strength (target: 70% of bullets start with strong verb)
        const verbRatio = strongVerbCount / bulletCount;
        const verbPoints = Math.min(50, (verbRatio / 0.7) * 50);
        impactScore += verbPoints;
        if (verbRatio < 0.5) impactDetails.push("Start more bullet points with power verbs (e.g., 'Spearheaded', 'Optimized').");

        // Calculate quantification (target: 40% of bullets have numbers)
        const quantRatio = quantifiedCount / bulletCount;
        const quantPoints = Math.min(50, (quantRatio / 0.4) * 50);
        impactScore += quantPoints;
        if (quantRatio < 0.3) {
            impactDetails.push("Add more numbers (%, $) to demonstrate concrete results.");
            actionPlan.push("Quantify your impact: Add metrics to at least 1 in 3 bullet points.");
        }
    }
    if (impactScore < 50 && actionPlan.length < 2) actionPlan.push("Replace passive phrases like 'Responsible for' with active action verbs.");

    // 3. Keyword Density (Contextual usage)
    let keywordScore = 0;
    const keywordDetails = [];
    const allText = JSON.stringify(data.experience).toLowerCase() + (data.summary || "").toLowerCase();
    
    if (data.skills.length === 0) {
        keywordDetails.push("No skills listed.");
        actionPlan.push("Add a Skills section with 6-10 core competencies.");
    } else {
        let foundCount = 0;
        data.skills.forEach(skill => {
            if (allText.includes(skill.toLowerCase())) foundCount++;
        });
        
        // Score based on % of skills that appear in context (evidence)
        const utilization = foundCount / data.skills.length;
        keywordScore = Math.min(100, (utilization / 0.5) * 100); // Target 50% overlap

        if (utilization < 0.3) {
            keywordDetails.push("Many skills listed aren't mentioned in your experience.");
            actionPlan.push("Prove your skills: Mention your listed technologies within your job descriptions.");
        } else {
            keywordDetails.push("Good job connecting skills to experience.");
        }
    }

    // 4. Brevity & Readability
    let brevityScore = 100;
    const brevityDetails = [];
    
    // Check Summary Length
    const summaryWords = data.summary ? data.summary.split(' ').length : 0;
    if (summaryWords > 0 && (summaryWords < 30 || summaryWords > 100)) {
        brevityScore -= 20;
        brevityDetails.push("Summary should be between 30-100 words.");
        if(summaryWords > 100) actionPlan.push("Shorten your professional summary to be more punchy.");
    }

    // Check Bullet Length
    let longBullets = 0;
    let shortBullets = 0;
    data.experience.forEach(exp => {
        exp.description.forEach(desc => {
            const words = desc.split(' ').length;
            if (words > 40) longBullets++;
            if (words < 5) shortBullets++;
        });
    });

    if (longBullets > 0) {
        brevityScore -= (longBullets * 5);
        brevityDetails.push(`${longBullets} bullet points are too long (aim for < 2 lines).`);
        actionPlan.push("Split long bullet points to improve readability.");
    }
    if (shortBullets > 0) {
        brevityScore -= (shortBullets * 5);
        brevityDetails.push(`${shortBullets} bullet points are too short to be impactful.`);
    }

    // Calculate Total & Grade
    const totalScore = Math.round((atsScore * 0.2) + (impactScore * 0.35) + (keywordScore * 0.25) + (Math.max(0, brevityScore) * 0.2));
    
    let grade = 'F';
    if (totalScore >= 90) grade = 'S';
    else if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 70) grade = 'B';
    else if (totalScore >= 60) grade = 'C';
    else grade = 'D';

    return {
        totalScore,
        grade,
        metrics: {
            ats: { score: Math.round(atsScore), label: "ATS Check", details: atsDetails },
            impact: { score: Math.round(impactScore), label: "Impact", details: impactDetails },
            keywords: { score: Math.round(keywordScore), label: "Keywords", details: keywordDetails },
            brevity: { score: Math.max(0, Math.round(brevityScore)), label: "Readability", details: brevityDetails }
        },
        actionPlan: actionPlan.slice(0, 3) // Top 3 actions
    };
};


// --- Radial Progress Component ---
const RadialProgress = ({ score, label, icon: Icon, color }: { score: number, label: string, icon: any, color: string }) => {
    // Increased size and stroke width
    const radius = 36;
    const strokeWidth = 8; 
    const size = 100;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors w-full group">
            <div className="relative mb-3 flex items-center justify-center" style={{ width: size, height: size }}>
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track - Consistent dark gray */}
                    <circle 
                        cx={center} cy={center} r={radius} 
                        stroke="#27272a" 
                        strokeWidth={strokeWidth} 
                        fill="transparent" 
                    />
                    {/* Colored Progress */}
                    <circle 
                        cx={center} cy={center} r={radius} 
                        stroke={color} 
                        strokeWidth={strokeWidth} 
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                    />
                </svg>
                {/* Content Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-gray-400 mb-0.5"><Icon className="w-5 h-5" /></div>
                    <span className="text-2xl font-bold leading-none tracking-tight">{score}</span>
                </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{label}</span>
        </div>
    );
};


// --- Main Component ---

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, loading, onUpdate }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);
  
  const hasContent = data.fullName || data.experience.length > 0 || data.education.length > 0;
  const themeColor = data.themeColor || "#374151";
  
  const analytics = useMemo(() => analyzeResume(data), [data]);

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
      {/* Toolbar */}
      <div className="absolute top-4 right-6 z-20 flex gap-4" data-html2canvas-ignore="true">
        {/* Analytics Button */}
        <button
            onClick={() => setShowAnalytics(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-all transform active:scale-95 group`}
        >
            <div className={`w-3 h-3 rounded-full ${analytics.totalScore >= 80 ? 'bg-green-500' : analytics.totalScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-sm">Score: {analytics.totalScore}</span>
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
              <span className="text-sm font-medium">PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start dark-scrollbar">
        <div 
          id="resume-preview-content"
          className={`a4-paper bg-white p-10 transition-all duration-500 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.1)] relative`}
        >
          {/* LOADING OVERLAY */}
          {loading && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all duration-300 rounded-sm" data-html2canvas-ignore="true">
                 {/* Dashed Border Box */}
                 <div className="absolute inset-4 border-[3px] border-black border-dashed rounded-xl opacity-80 animate-pulse"></div>
                 
                 {/* Floating Status Pill */}
                 <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700 animate-in zoom-in fade-in duration-300 relative z-10">
                      <div className="flex space-x-1.5">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                      </div>
                      <span className="font-bold text-xs uppercase tracking-widest">Brio AI is working on it</span>
                 </div>
             </div>
          )}

          {/* Wrapper for content dimming */}
          <div className={`h-full relative ${loading ? 'opacity-30 blur-[1px] pointer-events-none' : 'opacity-100'} transition-all duration-300`}>

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
      </div>

      {/* DASHBOARD MODAL - Dark Theme Redesign */}
      {showAnalytics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowAnalytics(false)}>
              <div 
                  className="bg-[#1A0509] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" 
                  onClick={e => e.stopPropagation()}
              >
                  {/* Dashboard Header */}
                  <div className="p-6 border-b border-white/5 flex justify-between items-start bg-black/20">
                      <div>
                          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                             Resume Analytics
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">Real-time analysis of your resume's effectiveness.</p>
                      </div>
                      <button onClick={() => setShowAnalytics(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  <div className="overflow-y-auto p-6 scrollbar-hide">
                      {/* Top Score Section */}
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="flex flex-col items-center justify-center relative">
                              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-5xl font-black shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                                  analytics.grade === 'S' || analytics.grade === 'A' ? 'border-green-500 text-green-500 bg-green-500/10 shadow-green-500/20' : 
                                  analytics.grade === 'B' ? 'border-blue-500 text-blue-500 bg-blue-500/10 shadow-blue-500/20' : 
                                  analytics.grade === 'C' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 shadow-yellow-500/20' : 
                                  'border-red-500 text-red-500 bg-red-500/10 shadow-red-500/20'
                              }`}>
                                  {analytics.grade}
                              </div>
                          </div>
                          <div className="flex-1 text-center md:text-left">
                              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Overall Performance</h3>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                  {analytics.grade === 'S' ? "Outstanding! Your resume is highly optimized for both ATS and human readers." :
                                   analytics.grade === 'A' ? "Great job! Minor tweaks could make this a top-tier resume." :
                                   analytics.grade === 'B' ? "Solid foundation, but there's room to improve impact and keywords." :
                                   "Your resume needs significant improvements to be competitive."}
                              </p>
                          </div>
                      </div>

                      {/* Metrics Grid - Synchronized Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          <RadialProgress score={analytics.metrics.ats.score} label="ATS Check" icon={AtsIcon} color="#3B82F6" />
                          <RadialProgress score={analytics.metrics.impact.score} label="Impact" icon={ImpactIcon} color="#D93058" />
                          <RadialProgress score={analytics.metrics.keywords.score} label="Keywords" icon={KeywordIcon} color="#10B981" />
                          <RadialProgress score={analytics.metrics.brevity.score} label="Readability" icon={ReadabilityIcon} color="#8B5CF6" />
                      </div>

                      {/* Action Plan - Fixed Alignment */}
                      {analytics.actionPlan.length > 0 ? (
                          <div className="mb-6">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 pb-2 border-b border-white/5">Priority Improvements</h3>
                              <div className="space-y-3">
                                  {analytics.actionPlan.map((action, idx) => (
                                      <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#D93058]/30 transition-colors">
                                          <div className="shrink-0 w-6 h-6 rounded-full bg-[#D93058] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-red-900/40">
                                              {idx + 1}
                                          </div>
                                          <p className="text-sm font-medium text-gray-300 pt-0.5 leading-relaxed">{action}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ) : (
                          <div className="text-center py-6 bg-green-500/10 rounded-xl border border-green-500/20 mb-6">
                              <p className="text-green-400 font-bold">🎉 No critical issues found. You're ready to apply!</p>
                          </div>
                      )}
                      
                      {/* Details Expander (Visual Only for now) */}
                      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                           <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Detailed Feedback</h4>
                           <ul className="space-y-2">
                                {[
                                    ...analytics.metrics.ats.details,
                                    ...analytics.metrics.impact.details,
                                    ...analytics.metrics.keywords.details,
                                    ...analytics.metrics.brevity.details
                                ].slice(0, 3).map((detail, i) => (
                                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                        <span className="text-gray-600 mt-1.5">•</span>
                                        {detail}
                                    </li>
                                ))}
                           </ul>
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
          /* Hide scrollbar for cleaner UI in modal */
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
      `}</style>
    </div>
  );
};

export default ResumePreview;