export interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  description: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  dates: string;
  details?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  imageUrl?: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects?: Project[];
  skills: string[];
  themeColor?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  suggestions?: string[];
}

export interface GenAIResponse {
  chatResponse: string;
  updatedResume: ResumeData;
  suggestions?: string[];
}