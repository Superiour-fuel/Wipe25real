import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, file?: File) => void;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isProcessing) return;
    
    onSendMessage(inputText, selectedFile || undefined);
    setInputText('');
    setSelectedFile(null);
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
    }
  };

  const handleStartScratch = () => {
    onSendMessage("I want to build a resume from scratch. Let's start with my name and role.");
  };

  // Render "Home Page" selection if no messages
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
           
           {/* Logo / Branding */}
           <div className="mb-12 flex flex-col items-center animate-fade-in-up">
              <div className="w-20 h-20 relative mb-6 text-white">
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Hexagon Frame */}
                    <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                    {/* Bridge Architecture */}
                    <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                    {/* Water Reflection Lines */}
                    <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                    <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-center">Talent Bridge</h1>
              <p className="text-gray-400 mt-2 text-center max-w-md">How would you like to build your resume today?</p>
           </div>

           {/* Option Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              
              {/* Option 1: Chat to Build */}
              <button 
                onClick={handleStartScratch}
                disabled={isProcessing}
                className="group relative p-8 rounded-2xl bg-[#1E1E1E] border border-gray-800 hover:border-[#DA7756] hover:bg-[#252525] transition-all duration-300 text-left flex flex-col gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-[#DA7756] flex items-center justify-center text-2xl transition-colors">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Chat to Build</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">Start from scratch. I'll interview you and build it step-by-step.</p>
                </div>
              </button>

              {/* Option 2: Import Resume */}
              <button 
                onClick={() => importInputRef.current?.click()}
                disabled={isProcessing}
                className="group relative p-8 rounded-2xl bg-[#1E1E1E] border border-gray-800 hover:border-[#3A5A40] hover:bg-[#252525] transition-all duration-300 text-left flex flex-col gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-[#3A5A40] flex items-center justify-center text-2xl transition-colors">
                  📄
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
             <div className="mt-8 text-[#DA7756] font-medium animate-pulse flex items-center gap-2">
               <span className="w-2 h-2 bg-[#DA7756] rounded-full"></span>
               Initializing Architect...
             </div>
           )}

           {/* Team Credits Footer */}
           <div className="mt-12 text-gray-500 text-xs flex gap-4 flex-wrap justify-center">
              <span className="opacity-50">Team:</span>
              {team.map((member) => (
                <a 
                  key={member.name}
                  href={member.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#DA7756] transition-colors"
                >
                  {member.name}
                </a>
              ))}
           </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DA7756] opacity-5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3A5A40] opacity-5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
      </div>
    );
  }

  // Standard Chat Interface
  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-900/50">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Resume Architect
          <span className="text-xs font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">AI Powered</span>
        </h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 dark-scrollbar">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'bg-transparent text-gray-200 pl-0'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-1 text-[#DA7756] font-bold text-xs uppercase tracking-wide">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C12 0 14 8 20 8C20 8 14 10 14 18C14 18 10 12 4 12C4 12 10 10 12 0Z" fill="#DA7756"/>
                    </svg>
                    Resume Architect
                  </div>
                )}
                {msg.text}
              </div>
              
              {/* Suggestions */}
              {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 pl-4 flex flex-wrap gap-2 max-w-[85%]">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 text-xs font-medium text-[#DA7756] border border-[#DA7756]/30 bg-[#DA7756]/5 rounded-full hover:bg-[#DA7756]/10 hover:border-[#DA7756]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
               <div className="max-w-[85%] px-5 py-3 text-sm">
                 <div className="flex items-center gap-2 text-[#DA7756] text-xs font-bold mb-1">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-[#DA7756]"></span>
                    Thinking
                 </div>
                 <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black">
        {selectedFile && (
          <div className="mb-2 px-3 py-1 bg-gray-800 rounded-full inline-flex items-center text-xs text-gray-300">
            <span className="mr-2">📎</span>
            {selectedFile.name}
            <button 
              onClick={() => setSelectedFile(null)} 
              className="ml-2 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-white rounded-2xl border border-gray-200 focus-within:border-gray-400 transition-colors"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Upload context or image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your reply..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-500 px-14 py-4 focus:outline-none"
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={(!inputText && !selectedFile) || isProcessing}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
              (!inputText && !selectedFile) || isProcessing
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