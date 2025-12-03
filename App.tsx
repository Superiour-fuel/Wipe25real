import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ResumePreview from './components/ResumePreview';
import LandingPage from './components/LandingPage';
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

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleLoadDemo = (demo: ResumeData) => {
    setResumeData(demo);
    setMessages([
      {
        id: 'init-demo',
        role: 'model',
        text: `I've loaded the ${demo.title} example for ${demo.fullName}. You can now ask me to change details, add experience, or polish specific sections. What would you like to edit first?`,
        suggestions: ["Update contact info", "Rewrite summary", "Add a new skill"]
      }
    ]);
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <LandingPage 
        onStart={() => setShowLanding(false)} 
        demos={DEMO_RESUMES}
        onLoadDemo={handleLoadDemo}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* Left Side: Chat Interface */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-[50vh] md:h-full border-r border-gray-800">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>

      {/* Right Side: Resume Preview */}
      <div className="w-full md:w-[55%] lg:w-[60%] h-[50vh] md:h-full relative">
        <ResumePreview data={resumeData} loading={isProcessing} />
        
        {/* Mobile Toggle Indicator (Optional visual cue) */}
        <div className="md:hidden absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-20"></div>
      </div>
    </div>
  );
}

export default App;