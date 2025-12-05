import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ResumeData } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from "@google/genai";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, file?: File) => void;
  onStartChat: () => void;
  onOpenExamples: () => void;
  isProcessing: boolean;
  resumeData: ResumeData;
  onResumeUpdate: (data: ResumeData) => void;
  onGoHome: () => void;
}

// --- Icons & Loaders (Scaled Down) ---

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

const BrioLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
    const moonDim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
    const border = size === 'sm' ? 'border-[1.5px]' : 'border-2';
    
    return (
        <div className={`relative ${dim} flex items-center justify-center`}>
            {/* Spinning Ring */}
            <div className={`absolute inset-0 rounded-full ${border} border-white/10 border-t-[#D93058] animate-spin`}></div>
            {/* Moon Icon */}
            <div className={`${moonDim} relative z-10 drop-shadow-sm`}>
                <MoonIcon />
            </div>
        </div>
    )
}

// Modern Action Icons (Scaled Down)
const EditPencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

const ChatStartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
);

const ImportDocIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

// --- Audio Helpers ---

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm' });
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Tool Definition ---

const updateResumeTool: FunctionDeclaration = {
  name: "updateResume",
  description: "Updates the resume data with information gathered from the user conversation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fullName: { type: Type.STRING },
      title: { type: Type.STRING },
      email: { type: Type.STRING },
      phone: { type: Type.STRING },
      location: { type: Type.STRING },
      summary: { type: Type.STRING },
      themeColor: { type: Type.STRING },
      experience: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, company: { type: Type.STRING }, dates: { type: Type.STRING }, description: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
      education: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, school: { type: Type.STRING }, degree: { type: Type.STRING }, dates: { type: Type.STRING }, details: { type: Type.STRING } } } },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["fullName", "experience", "education", "skills"]
  }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onStartChat, onOpenExamples, isProcessing, resumeData, onResumeUpdate, onGoHome }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live API State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const team = [
    { name: 'Rishel', link: 'https://www.linkedin.com/in/rishel-lijesh-7643a4377/' },
    { name: 'Manoj', link: 'https://www.linkedin.com/in/manoj07ar/' },
    { name: 'Sai', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
    { name: 'Milan', link: 'https://www.linkedin.com/in/sai-harshit-thota-a756a3264/' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isProcessing) return;
    onSendMessage(inputText, selectedFile || undefined);
    setInputText('');
    setSelectedFile(null);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isProcessing) return;
    onSendMessage(suggestion);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onSendMessage("Please analyze my uploaded resume and help me polish it.", file);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // --- Live API Implementation ---
  const startLiveSession = async () => {
    if (isLiveActive || isLiveConnecting) return;
    setIsLiveConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } });
      mediaStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            setIsLiveConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) { int16[i] = inputData[i] * 32768; }
              const base64Data = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(session => { session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: base64Data } }); });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
            }
            if (message.toolCall) {
                for (const fc of message.toolCall.functionCalls) {
                    if (fc.name === 'updateResume') {
                        const newResumeData = fc.args as unknown as ResumeData;
                        onResumeUpdate(newResumeData);
                        sessionPromise.then(session => { session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "Resume updated." } } }); });
                    }
                }
            }
            if (message.serverContent?.interrupted) {
                 sourcesRef.current.forEach(source => { try { source.stop(); } catch(e) {} });
                 sourcesRef.current.clear();
                 nextStartTimeRef.current = 0;
             }
          },
          onclose: () => { setIsLiveActive(false); },
          onerror: (err) => { setIsLiveActive(false); setIsLiveConnecting(false); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: "You are Brio AI, an expert Resume Architect. Listen to user inputs and call updateResume immediately.",
          tools: [{ functionDeclarations: [updateResumeTool] }]
        }
      });
      sessionRef.current = sessionPromise;
    } catch (error) { setIsLiveConnecting(false); alert("Microphone access failed."); }
  };

  const stopLiveSession = () => {
    if (sessionRef.current) { sessionRef.current.then((session: any) => session.close()); sessionRef.current = null; }
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(track => track.stop()); mediaStreamRef.current = null; }
    if (inputAudioContextRef.current) { inputAudioContextRef.current.close(); inputAudioContextRef.current = null; }
    if (outputAudioContextRef.current) { outputAudioContextRef.current.close(); outputAudioContextRef.current = null; }
    setIsLiveActive(false);
    setIsLiveConnecting(false);
  };

  // Render "Home Page" selection if no messages
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
        {/* Home Button - Decreased Size */}
        <div className="absolute top-6 left-6 z-50">
           <button 
             onClick={onGoHome} 
             className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-transform hover:scale-105 shadow-xl border border-gray-100"
             title="Back to Landing Page"
           >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
           </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
           
           {/* Logo / Branding - Decreased */}
           <div className="mb-10 flex flex-col items-center animate-fade-in-up">
              <div className="w-20 h-20 relative mb-4 text-white">
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                    <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                    <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                    <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-center">Talent Bridge</h1>
              <p className="text-gray-400 mt-2 text-center max-w-lg text-lg">How would you like to build your resume today?</p>
           </div>

           {/* Option Cards - Decreased */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
              
              {/* Option 1: Edit Example (Triggers Page Switch) */}
              <button 
                onClick={onOpenExamples}
                disabled={isProcessing}
                className="group relative p-6 rounded-2xl bg-[#1E1E1E] border border-gray-800 hover:border-[#D93058] hover:bg-[#252525] transition-all duration-300 text-left flex flex-col gap-4 shadow-xl"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-[#D93058] group-hover:to-[#9f2340] border border-gray-700 group-hover:border-[#ff4e7a] flex items-center justify-center transition-all">
                  <EditPencilIcon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Edit Example</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">Choose from our gallery and customize.</p>
                </div>
              </button>

              {/* Option 2: Start from Scratch */}
              <button 
                onClick={onStartChat}
                disabled={isProcessing}
                className="group relative p-6 rounded-2xl bg-[#1E1E1E] border border-gray-800 hover:border-blue-500 hover:bg-[#252525] transition-all duration-300 text-left flex flex-col gap-4 shadow-xl"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-blue-600 group-hover:to-blue-800 border border-gray-700 group-hover:border-blue-400 flex items-center justify-center transition-all">
                  <ChatStartIcon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Start from Scratch</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">Clear the resume and build it step-by-step.</p>
                </div>
              </button>

              {/* Option 3: Import Resume */}
              <button 
                onClick={() => importInputRef.current?.click()}
                disabled={isProcessing}
                className="group relative p-6 rounded-2xl bg-[#1E1E1E] border border-gray-800 hover:border-[#3A5A40] hover:bg-[#252525] transition-all duration-300 text-left flex flex-col gap-4 shadow-xl md:col-span-2"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-[#3A5A40] group-hover:to-[#273d2b] border border-gray-700 group-hover:border-[#5cb86b] flex items-center justify-center transition-all">
                  <ImportDocIcon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Import Resume</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">Upload your existing CV (PDF or Image). I'll parse and polish it.</p>
                </div>
                <input 
                  type="file" 
                  ref={importInputRef}
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={handleImportClick}
                />
              </button>

           </div>
           
           {isProcessing && (
             <div className="mt-8 text-[#D93058] font-medium animate-pulse flex items-center gap-2 text-lg">
               <BrioLoader size="sm" />
               Initializing Brio AI...
             </div>
           )}

           {/* Team Credits Footer - Decreased */}
           <div className="mt-10 text-gray-500 text-sm flex gap-4 flex-wrap justify-center">
              <span className="opacity-50">Team:</span>
              {team.map((member) => (
                <a 
                  key={member.name}
                  href={member.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#D93058] transition-colors"
                >
                  {member.name}
                </a>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // Standard Chat Interface
  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/* Header - Decreased */}
      <div className="p-4 border-b border-gray-900/50 flex items-center">
         {/* Home Button */}
         <button 
            onClick={onGoHome} 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-transform hover:scale-105 mr-4 shrink-0 shadow-lg"
            title="Back to Landing Page"
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
         </button>

        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mr-auto">
          Brio AI
          <span className="text-xs font-normal text-gray-500 bg-gray-900 px-3 py-1 rounded-full">AI Powered</span>
        </h1>
        
        {/* Live Status Indicator - Decreased */}
        {isLiveActive && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-500/30 rounded-full animate-pulse ml-auto">
                 <span className="w-2 h-2 rounded-full bg-red-500"></span>
                 <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Voice</span>
             </div>
        )}
      </div>

      {/* Messages Area - Decreased Text Sizes */}
      <div className="flex-1 overflow-y-auto px-5 py-4 dark-scrollbar">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'bg-transparent text-gray-200 pl-0'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2 text-[#D93058] font-bold text-xs uppercase tracking-wide">
                     {/* Brio Moon Icon Small */}
                     <div className="w-4 h-4">
                        <MoonIcon />
                     </div>
                    Brio AI
                  </div>
                )}
                {msg.text}
              </div>
              
              {/* Suggestions - Decreased */}
              {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 pl-2 flex flex-wrap gap-2 max-w-[85%]">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isProcessing || isLiveActive}
                      className="px-4 py-2 text-xs font-medium text-[#D93058] border border-[#D93058]/30 bg-[#D93058]/5 rounded-full hover:bg-[#D93058]/10 hover:border-[#D93058]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isProcessing && (
             <div className="flex flex-col items-start">
               <div className="max-w-[85%] px-5 py-4 text-sm">
                 <div className="flex items-center gap-2 text-[#D93058] text-xs font-bold mb-2">
                    <BrioLoader size="sm" />
                    Thinking
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Decreased Sizes */}
      <div className="p-4 bg-black">
        {selectedFile && (
          <div className="mb-2 px-3 py-1.5 bg-gray-800 rounded-full inline-flex items-center text-xs text-gray-300">
            <span className="mr-2 text-sm">📎</span>
            {selectedFile.name}
            <button 
              onClick={() => setSelectedFile(null)} 
              className="ml-2 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-white rounded-2xl border border-gray-200 focus-within:border-gray-400 transition-colors flex items-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            title="Upload context or image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          {/* Microphone Button (Live API Toggle) */}
          <button
            type="button"
            onClick={isLiveActive ? stopLiveSession : startLiveSession}
            disabled={isLiveConnecting}
            className={`ml-3 p-2 rounded-full transition-all ${
                isLiveActive 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : isLiveConnecting 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
            }`}
            title={isLiveActive ? "Stop Voice Chat" : "Start Voice Chat"}
          >
             {isLiveConnecting ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                      <BrioLoader size="sm" />
                  </div>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill={isLiveActive ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
             )}
          </button>

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isLiveActive ? "Listening..." : "Type your reply..."}
            className="w-full bg-transparent text-gray-900 placeholder-gray-500 px-4 py-4 focus:outline-none resize-none max-h-40 overflow-y-auto text-lg"
            disabled={isProcessing || isLiveActive}
            rows={1}
            spellCheck={true}
          />

          <button
            type="submit"
            disabled={(!inputText && !selectedFile) || isProcessing || isLiveActive}
            className={`mr-3 p-2 rounded-full transition-all ${
              (!inputText && !selectedFile) || isProcessing || isLiveActive
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;