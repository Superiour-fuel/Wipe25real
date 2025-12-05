import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ResumePreview from './components/ResumePreview';
import LandingPage from './components/LandingPage';
import OpportunitiesPage from './components/OpportunitiesPage';
import SupportPage from './components/SupportPage';
import LimitPage from './components/LimitPage';
import ExamplesPage from './components/ExamplesPage';
import { ResumeData, ChatMessage } from './types';
import { processResumeUpdate } from './services/geminiService';
import { DEMO_RESUMES } from './data/demoResumes';

const INITIAL_RESUME: ResumeData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: []
};

type ViewState = 'landing' | 'app' | 'opportunities' | 'support' | 'limit' | 'examples';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [resumeData, setResumeData] = useState<ResumeData>(DEMO_RESUMES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userMajor, setUserMajor] = useState<string>("");

  // Check for usage limit on mount (24-hour cooldown)
  useEffect(() => {
    const lastUsage = localStorage.getItem('talent_bridge_usage_timestamp');
    if (lastUsage) {
        const lastUsageTime = parseInt(lastUsage, 10);
        const currentTime = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // If less than 24 hours have passed since last usage
        if (currentTime - lastUsageTime < oneDayInMs) {
            setCurrentView('limit');
        }
    }
  }, []);

  // Helper to convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get raw base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSendMessage = async (text: string, file?: File) => {
    // 1. Add user message to UI
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text || (file ? `Uploaded ${file.name}` : '')
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsProcessing(true);

    try {
      // 2. Prepare payload
      let fileData: { data: string; mimeType: string } | undefined = undefined;
      if (file) {
        const base64 = await fileToBase64(file);
        fileData = {
          data: base64,
          mimeType: file.type
        };
      }

      // 3. Call Gemini Service
      // We pass the *current* resume state so the AI knows what to update
      const response = await processResumeUpdate(resumeData, text, fileData);

      // 4. Update Resume State
      setResumeData(response.updatedResume);

      // 5. Add AI response to UI
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.chatResponse,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, newAiMsg]);

      // 6. Mark user as having used the app for today
      // Update the timestamp to now. This resets the 24h timer.
      localStorage.setItem('talent_bridge_usage_timestamp', Date.now().toString());

    } catch (error) {
      console.error("Error processing message:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error while processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeUpdate = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleLoadDemo = (demo: ResumeData) => {
    // Demo doesn't consume API immediately, but we might want to track it if they start editing
    setResumeData(demo);
    setMessages([
      {
        id: 'init-demo',
        role: 'model',
        text: `I've loaded the ${demo.title || 'selected'} example for ${demo.fullName}. You can now ask me to change details, add experience, or polish specific sections. What would you like to edit first?`,
        suggestions: ["Update contact info", "Rewrite summary", "Add a new skill"]
      }
    ]);
    setCurrentView('app');
  };

  const handleStartChat = () => {
      setResumeData(INITIAL_RESUME);
      setMessages([{
          id: 'init-scratch',
          role: 'model',
          text: "Great! Let's start building your resume. What is your full name and what professional title or role are you targeting for this resume?",
          suggestions: []
      }]);
  };

  const handleOpenOpportunities = (major: string) => {
    setUserMajor(major);
    setCurrentView('opportunities');
  };

  if (currentView === 'limit') {
    return <LimitPage onUnlock={() => setCurrentView('landing')} />;
  }

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onStart={() => setCurrentView('app')} 
        demos={DEMO_RESUMES}
        onLoadDemo={handleLoadDemo}
        onOpenOpportunities={handleOpenOpportunities}
        onOpenSupport={() => setCurrentView('support')}
        onOpenExamples={() => setCurrentView('examples')}
      />
    );
  }

  if (currentView === 'opportunities') {
    return (
      <OpportunitiesPage 
        major={userMajor} 
        onBack={() => setCurrentView('landing')} 
      />
    );
  }

  if (currentView === 'support') {
    return (
      <SupportPage 
        onBack={() => setCurrentView('landing')} 
      />
    );
  }

  if (currentView === 'examples') {
      return (
          <ExamplesPage 
            onSelect={handleLoadDemo}
            onBack={() => setCurrentView('landing')}
          />
      )
  }

  return (
    // Main App Container - We keep the blobs in the DOM but cover them with opaque divs for the split screen
    <div className="fixed inset-0 flex flex-col md:flex-row bg-[#4A0D18] font-sans overflow-hidden z-0">
      
      {/* Background Effects (Blobs & Noise) - These remain, but will be covered in 'app' view */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#751A2B] rounded-full blur-[120px] opacity-60 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#2E050D] rounded-full blur-[100px] opacity-80 animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] right-[30%] w-[500px] h-[500px] bg-[#9C1D3B] rounded-full blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Left Side: Chat Interface (Opaque Black) */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-[50vh] md:h-full border-r border-gray-800 relative z-10 bg-black">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onStartChat={handleStartChat}
          onOpenExamples={() => setCurrentView('examples')}
          isProcessing={isProcessing}
          resumeData={resumeData}
          onResumeUpdate={handleResumeUpdate}
          onGoHome={() => setCurrentView('landing')}
        />
      </div>

      {/* Right Side: Resume Preview (Opaque Gray) */}
      <div className="w-full md:w-[55%] lg:w-[60%] h-[50vh] md:h-full relative z-10 bg-gray-50">
        <ResumePreview 
          data={resumeData} 
          loading={isProcessing} 
          onUpdate={handleResumeUpdate}
        />
        
        {/* Mobile Toggle Indicator */}
        <div className="md:hidden absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
      </div>

      <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
      `}</style>
    </div>
  );
}

export default App;