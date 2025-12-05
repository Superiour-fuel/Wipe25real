import React, { useState, useRef } from 'react';
import { generateCoverLetter, generateNetworkingMessage } from '../services/geminiService';

interface OpportunitiesPageProps {
  major: string;
  onBack: () => void;
}

interface Opportunity {
  id: string;
  type: 'INTERNSHIP' | 'FULL-TIME' | 'CONTRACT' | 'PART-TIME';
  title: string;
  company: string;
  location: string;
  salary?: string;
  posted?: string;
  description: string[];
  tags: string[];
}

interface Peer {
  id: string;
  name: string;
  role: string;
  school: string;
  image: string;
  common: string;
}

const MoonIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
     <path d="M72 45C72 63.2254 57.2254 78 39 78C20.7746 78 6 63.2254 6 45C6 29.8 16 17 30 13C27 17 25 22 25 28C25 46.2254 39.7746 61 58 61C64 61 69 59 73 56C72.5 52 72 48 72 45Z" fill="#FFFBEB" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
     <ellipse cx="32" cy="42" rx="2.5" ry="3.5" fill="#1F2937"/>
     <ellipse cx="48" cy="42" rx="2.5" ry="3.5" fill="#1F2937"/>
     <circle cx="28" cy="50" r="3" fill="#F472B6" opacity="0.5"/>
     <circle cx="52" cy="50" r="3" fill="#F472B6" opacity="0.5"/>
     <path d="M37 52Q40 55 43 52" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
     <path d="M82 20L84 26L90 28L84 30L82 36L80 30L74 28L80 26L82 20Z" fill="#FCD34D" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round"/>
     <circle cx="88" cy="15" r="2" fill="#FCD34D"/>
  </svg>
);

const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ major, onBack }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'network'>('jobs');
  const [searchKeyword, setSearchKeyword] = useState(major || '');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Smart Apply State
  const [showSmartApplyModal, setShowSmartApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Opportunity | null>(null);
  const [applyStep, setApplyStep] = useState<'upload' | 'generating' | 'review' | 'success'>('upload');
  const [coverLetterText, setCoverLetterText] = useState('');
  
  // Networking Assistant State
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [networkTarget, setNetworkTarget] = useState({ name: '', company: '', relation: 'Stranger' });
  const [networkPurpose, setNetworkPurpose] = useState('Advice');
  const [networkMessage, setNetworkMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  // Mock Job Data
  const ALL_JOBS: Opportunity[] = [
      {
          id: '1',
          type: 'FULL-TIME',
          title: 'Software Engineer, Frontend',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          salary: '$120,000 - $160,000 a year',
          posted: '2 days ago',
          description: [
              "Build and maintain responsive web applications using React and TypeScript.",
              "Collaborate with UX designers to implement pixel-perfect interfaces.",
              "Optimize application performance for maximum speed and scalability."
          ],
          tags: ['React', 'TypeScript', 'Remote Hybrid']
      },
      {
          id: '2',
          type: 'INTERNSHIP',
          title: 'Product Management Intern',
          company: 'InnovateInc',
          location: 'New York, NY',
          salary: '$40 - $50 an hour',
          posted: 'Just posted',
          description: [
              "Assist in defining product requirements and user stories.",
              "Conduct market research and competitive analysis.",
              "Work closely with engineering teams to track sprint progress."
          ],
          tags: ['Summer 2024', 'Product', 'Entry Level']
      },
      {
          id: '3',
          type: 'FULL-TIME',
          title: 'Data Scientist',
          company: 'DataFlow Systems',
          location: 'Austin, TX',
          salary: '$110,000 - $145,000 a year',
          posted: '5 days ago',
          description: [
              "Develop machine learning models to predict user behavior.",
              "Analyze large datasets using Python and SQL.",
              "Create visualizations to communicate findings to stakeholders."
          ],
          tags: ['Python', 'Machine Learning', 'SQL']
      },
      {
          id: '4',
          type: 'CONTRACT',
          title: 'UX/UI Designer',
          company: 'Creative Studio',
          location: 'Remote',
          salary: '$80 - $100 an hour',
          posted: '1 week ago',
          description: [
              "Design intuitive user interfaces for mobile and web applications.",
              "Create wireframes, prototypes, and high-fidelity mockups.",
              "Conduct user testing to validate design decisions."
          ],
          tags: ['Figma', 'Remote', 'Design System']
      },
      {
        id: '5',
        type: 'FULL-TIME',
        title: 'Marketing Specialist',
        company: 'Growth Hype',
        location: 'Chicago, IL',
        salary: '$70,000 - $90,000 a year',
        posted: '3 days ago',
        description: [
            "Execute digital marketing campaigns across social media channels.",
            "Analyze campaign performance metrics and optimize ROI.",
            "Draft engaging content for blog posts and newsletters."
        ],
        tags: ['SEO', 'Content Marketing', 'Social Media']
    }
  ];

  const getNetwork = (): Peer[] => {
      const schools = ['Stanford', 'MIT', 'UC Berkeley', 'Georgia Tech', 'University of Michigan'];
      const images = [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      ];
      const names = ['Sarah Miller', 'David Chen', 'Emily Johnson', 'Michael Ross', 'Jessica Wu'];
      
      return Array.from({ length: 5 }).map((_, i) => ({
          id: `p${i}`,
          name: names[i],
          role: `Alumni`,
          school: schools[i],
          image: images[i],
          common: `Working at Target Company`
      }));
  };

  const network = getNetwork();

  // Filter Jobs logic
  const filteredJobs = ALL_JOBS.filter(job => {
      const matchKeyword = !searchKeyword || 
          job.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
          job.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          job.tags.some(t => t.toLowerCase().includes(searchKeyword.toLowerCase()));
      
      const matchLocation = !searchLocation || 
          job.location.toLowerCase().includes(searchLocation.toLowerCase());

      return matchKeyword && matchLocation;
  });

  const startSmartApply = (job: Opportunity) => {
    setSelectedJob(job);
    setApplyStep('upload');
    setShowSmartApplyModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedJob) {
      const file = e.target.files[0];
      setApplyStep('generating');
      
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          const generatedLetter = await generateCoverLetter(selectedJob.title, selectedJob.company, { data: base64, mimeType: file.type });
          setCoverLetterText(generatedLetter);
          setApplyStep('review');
        };
      } catch (error) {
        setApplyStep('upload');
      }
    }
  };

  const openNetworkingModal = (peer?: Peer) => {
      if (peer) {
          setNetworkTarget({ name: peer.name, company: peer.school, relation: 'Peer/Student' });
      } else {
          setNetworkTarget({ name: '', company: '', relation: 'Stranger' });
      }
      setNetworkMessage('');
      setShowNetworkModal(true);
  };

  const handleGenerateMessage = async () => {
      setIsGeneratingMessage(true);
      try {
          const result = await generateNetworkingMessage(
              networkTarget.name || 'Hiring Manager',
              networkTarget.company || 'Target Company',
              networkTarget.relation,
              networkPurpose,
              `I am a student interested in opportunities.`
          );
          setNetworkMessage(result.message);
      } catch (e) {
          setNetworkMessage("Error generating message.");
      } finally {
          setIsGeneratingMessage(false);
      }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#4A0D18] font-sans text-white relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-[#751A2B] rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#2E050D] rounded-full blur-[90px] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#4A0D18] border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer gap-3" onClick={onBack}>
                 <div className="w-8 h-8 text-white">
                     <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                        <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                        <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                    </svg>
                 </div>
                 <span className="font-bold text-xl tracking-tight">Talent Bridge</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => setActiveTab('jobs')} className={`text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'jobs' ? 'text-[#D93058]' : 'text-gray-400 hover:text-white'}`}>Job Search</button>
              <button onClick={() => setActiveTab('network')} className={`text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'network' ? 'text-[#D93058]' : 'text-gray-400 hover:text-white'}`}>Network</button>
            </div>

            <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">HOME</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 py-8">
        
        {/* Job Search View */}
        {activeTab === 'jobs' && (
            <div className="animate-fade-in-up">
                {/* Search Header */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 backdrop-blur-md shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">What</label>
                            <input 
                                type="text" 
                                placeholder="Job title, keywords, or company" 
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D93058] transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                             <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Where</label>
                             <input 
                                type="text" 
                                placeholder="City, state, or 'Remote'" 
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D93058] transition-colors"
                             />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full md:w-auto bg-[#D93058] hover:bg-[#b02243] text-white font-bold px-8 py-2.5 rounded-lg transition-all shadow-md active:scale-95">
                                Find Jobs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-400 font-medium">
                    Showing {filteredJobs.length} jobs
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <div key={job.id} className="bg-[#1A0509]/80 border border-white/10 rounded-xl p-6 hover:border-[#D93058]/50 transition-all group backdrop-blur-sm relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-white group-hover:underline decoration-[#D93058] underline-offset-4">{job.title}</h3>
                                            {job.posted === 'Just posted' && <span className="bg-[#D93058]/20 text-[#D93058] text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>}
                                        </div>
                                        <div className="text-gray-300 text-sm mb-2">{job.company} • {job.location}</div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                             {job.salary && <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 font-medium">{job.salary}</span>}
                                             <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 font-medium">{job.type}</span>
                                        </div>

                                        <ul className="list-disc ml-4 text-sm text-gray-400 mb-4 space-y-1">
                                            {job.description.slice(0, 2).map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                                         <button 
                                            onClick={() => startSmartApply(job)}
                                            className="bg-[#D93058] hover:bg-[#b02243] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-md shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                                         >
                                            <div className="w-5 h-5 relative -top-[1px]"><MoonIcon /></div> Smart Apply
                                         </button>
                                         <button className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-6 py-2.5 rounded-lg border border-white/10 transition-colors text-sm">
                                            Save Job
                                         </button>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 font-medium">
                                    Posted {job.posted}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                            <p className="text-gray-400">Try adjusting your search keywords or location.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Network View */}
        {activeTab === 'network' && (
             <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-8">
                     <h2 className="text-2xl font-bold text-white">Recommended Connections</h2>
                     <button onClick={() => openNetworkingModal()} className="px-5 py-2.5 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 border border-white/10 transition-colors">+ Custom Outreach</button>
                 </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {network.map((peer) => (
                        <div key={peer.id} className="bg-[#1A0509]/80 rounded-xl p-6 shadow-md border border-white/10 hover:border-[#D93058]/50 transition-all backdrop-blur-sm flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={peer.image} alt={peer.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">{peer.name}</h3>
                                    <p className="text-sm text-gray-400">{peer.school}</p>
                                </div>
                            </div>
                            <div className="mb-6 flex-1">
                                <div className="text-base font-semibold text-gray-200 mb-1">{peer.role}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>{peer.common}</div>
                            </div>
                            
                            <div className="flex gap-3 mt-auto">
                                <button className="flex-1 py-2 bg-[#0077b5] hover:bg-[#005582] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.32c0-4.613 5.432-5.185 5.432 0v8.32h5v-9.409c0-6.142-7.07-5.816-10.464-2.93v-2.281z"/></svg>
                                    Connect
                                </button>
                                <button onClick={() => openNetworkingModal(peer)} className="px-4 py-2 bg-white text-[#4A0D18] font-bold text-xs hover:bg-gray-200 transition-colors rounded-lg shadow-sm flex items-center gap-1" title="Draft Message with AI">
                                    <div className="w-4 h-4 relative -top-[1px]"><MoonIcon /></div> Draft
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
        )}
      </main>

      {/* Networking Modal */}
      {showNetworkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowNetworkModal(false)}>
              <div className="bg-[#1A0509] border border-[#D93058]/30 rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <h2 className="text-2xl font-bold text-white mb-6">Networking Assistant</h2>
                  <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Target Name</label>
                              <input value={networkTarget.name} onChange={e => setNetworkTarget({...networkTarget, name: e.target.value})} placeholder="e.g. Jane Doe" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#D93058] outline-none text-sm text-white transition-colors" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Company/School</label>
                              <input value={networkTarget.company} onChange={e => setNetworkTarget({...networkTarget, company: e.target.value})} placeholder="e.g. Google" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#D93058] outline-none text-sm text-white transition-colors" />
                          </div>
                      </div>
                      <button onClick={handleGenerateMessage} disabled={isGeneratingMessage} className="w-full py-3 bg-[#D93058] text-white font-bold rounded-lg hover:bg-[#b02243] disabled:opacity-50 text-base shadow-lg shadow-red-900/40 transition-colors">{isGeneratingMessage ? 'Drafting...' : 'Generate Message'}</button>
                  </div>
                  {networkMessage && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Drafted Message</label>
                          <textarea value={networkMessage} readOnly className="w-full h-32 bg-transparent resize-none outline-none text-sm text-gray-300 leading-relaxed" />
                      </div>
                  )}
              </div>
          </div>
      )}
      
      {/* Smart Apply Modal */}
      {showSmartApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowSmartApplyModal(false)}>
              <div className="bg-[#1A0509] border border-[#D93058]/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="text-center">
                     <h2 className="text-2xl font-bold mb-4 text-white">Smart Apply: {selectedJob.title}</h2>
                     {applyStep === 'upload' && (
                         <div className="py-6">
                             <p className="text-gray-300 mb-6 text-sm">Upload your resume to generate a tailored cover letter.</p>
                             <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D93058] file:text-white hover:file:bg-[#b02243] cursor-pointer bg-white/5 rounded-full border border-white/10"/>
                        </div>
                     )}
                     {applyStep === 'generating' && <div className="py-8 animate-pulse text-lg text-[#D93058] font-bold">Generating Cover Letter...</div>}
                     {applyStep === 'review' && (
                         <div className="py-4">
                             <textarea value={coverLetterText} onChange={e => setCoverLetterText(e.target.value)} className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-xl mb-4 text-sm text-white resize-none outline-none focus:border-[#D93058] transition-colors leading-relaxed" />
                             <button onClick={() => setApplyStep('success')} className="bg-[#D93058] text-white px-8 py-3 rounded-xl text-base font-bold hover:bg-[#b02243] shadow-lg shadow-red-900/30 transition-all">Submit Application</button>
                         </div>
                     )}
                     {applyStep === 'success' && <div className="py-6"><div className="text-green-500 text-5xl mb-3">✓</div><p className="text-xl font-bold text-white">Application Sent!</p><button onClick={() => setShowSmartApplyModal(false)} className="mt-6 text-sm text-gray-400 hover:text-white underline">Close</button></div>}
                  </div>
              </div>
          </div>
      )}

      <style>{`
          .animate-fade-in-up {
              animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
              transform: translateY(20px);
          }
          @keyframes fadeInUp {
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default OpportunitiesPage;