import React, { useState } from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  loading?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, loading }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const hasContent = data.fullName || data.experience.length > 0 || data.education.length > 0;

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

  return (
    <div className="h-full flex flex-col bg-gray-100 relative">
      {/* Download Toolbar */}
      <div className="absolute top-6 right-8 z-20">
        <button
          onClick={handleDownloadPdf}
          disabled={!hasContent || loading || isDownloading}
          className={`flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${!hasContent ? 'hidden' : ''}`}
          title="Download as PDF"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
        <div 
          id="resume-preview-content"
          className={`a4-paper bg-white p-12 transition-all duration-500 ease-in-out shadow-2xl ${loading ? 'opacity-90 blur-[1px]' : 'opacity-100 blur-0'}`}
        >
          {!hasContent ? (
            <div className="h-full w-full flex flex-col relative">
                {/* Skeleton / Demo View */}
                <div className="animate-pulse space-y-8 opacity-40">
                    {/* Header */}
                    <div className="border-b-2 border-gray-200 pb-6">
                        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="flex gap-4">
                             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-6">
                        <div className="h-4 bg-gray-300 rounded w-1/4 border-b border-gray-200 pb-2"></div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/6"></div>
                                </div>
                                <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                                <div className="space-y-2 pl-4">
                                    <div className="h-2 bg-gray-50 rounded w-full"></div>
                                    <div className="h-2 bg-gray-50 rounded w-[90%]"></div>
                                    <div className="h-2 bg-gray-50 rounded w-[95%]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overlay Message */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-xl text-center max-w-sm">
                        <div className="w-16 h-16 bg-[#3A5A40]/10 text-[#3A5A40] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Build</h3>
                        <p className="text-gray-500">
                            I'm ready to craft your resume. Share your details or upload an existing CV to the chat on the left.
                        </p>
                    </div>
                </div>
            </div>
          ) : (
            <div className="text-gray-800">
              {/* Header */}
              <header className="border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-2">
                  {data.fullName || "Your Name"}
                </h1>
                <h2 className="text-xl font-medium text-gray-600 mb-4">
                  {data.title || "Target Role"}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {data.email && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {data.email}
                    </span>
                  )}
                  {data.phone && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {data.phone}
                    </span>
                  )}
                  {data.location && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {data.location}
                    </span>
                  )}
                </div>
              </header>

              {/* Summary */}
              {data.summary && (
                <section className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {data.summary}
                  </p>
                </section>
              )}

              {/* Skills */}
              {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Core Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b pb-2">Experience</h3>
                  <div className="space-y-5">
                    {data.experience.map((exp, idx) => (
                      <div key={exp.id || idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-900">{exp.title}</h4>
                          <span className="text-xs text-gray-500 font-medium">{exp.dates}</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
                        <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
                          {exp.description && exp.description.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education && data.education.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b pb-2">Education</h3>
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div key={edu.id || idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-900">{edu.school}</h4>
                          <span className="text-xs text-gray-500 font-medium">{edu.dates}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">{edu.degree}</span>
                          {edu.details && <span className="text-gray-500"> - {edu.details}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;