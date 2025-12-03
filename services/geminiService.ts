import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the structured output
const resumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chatResponse: {
      type: Type.STRING,
      description: "A conversational response. If parsing a resume, say 'I've analyzed your resume. Here is the preview. What would you like to improve?'. If building, ask for the next missing piece of information.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-4 short, actionable text suggestions.",
    },
    updatedResume: {
      type: Type.OBJECT,
      description: "The complete updated resume data structure.",
      properties: {
        fullName: { type: Type.STRING },
        title: { type: Type.STRING, description: "Professional job title" },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        summary: { type: Type.STRING, description: "A professional summary (2-3 sentences)" },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique ID (can be generated)" },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              dates: { type: Type.STRING },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of bullet points for achievements/responsibilities"
              }
            }
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              school: { type: Type.STRING },
              degree: { type: Type.STRING },
              dates: { type: Type.STRING },
              details: { type: Type.STRING }
            }
          }
        },
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["fullName", "experience", "education", "skills"]
    }
  },
  required: ["chatResponse", "updatedResume", "suggestions"]
};

export const processResumeUpdate = async (
  currentResume: ResumeData,
  userMessage: string,
  fileData?: { data: string; mimeType: string }
): Promise<{ chatResponse: string; updatedResume: ResumeData; suggestions?: string[] }> => {
  
  const isParsing = !!fileData && (!currentResume.fullName || currentResume.fullName === "");

  const prompt = `
    You are an expert Resume Architect AI.
    
    TASK:
    ${isParsing 
      ? "The user has uploaded an existing resume. EXTRACT all information from the provided document accurately into the JSON structure. Polish the summary and experience bullet points to be more professional and action-oriented immediately."
      : "You are interviewing the user to build their resume. Analyze their input and update the JSON structure."}

    CURRENT RESUME STATE:
    ${JSON.stringify(currentResume)}

    USER INPUT:
    "${userMessage}"

    INSTRUCTIONS:
    1. Update the 'updatedResume' object.
    2. If extracting from a file, ensure no data is lost. Map fields intelligently.
    3. Improve phrasing to be professional (Action Verb + Task + Result).
    4. Generate a helpful 'chatResponse'.
    5. Provide 'suggestions' for next steps.
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (fileData) {
    parts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      chatResponse: "I'm having trouble analyzing that right now. Please try again.",
      updatedResume: currentResume,
      suggestions: ["Try Again"]
    };
  }
};

// --- New Feature: Smart Apply / Cover Letter Generation ---

const coverLetterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coverLetter: {
      type: Type.STRING,
      description: "A professional, concise cover letter (approx 200 words) tailored to the specific job and company, highlighting relevant skills from the resume."
    }
  },
  required: ["coverLetter"]
};

export const generateCoverLetter = async (
  jobTitle: string,
  companyName: string,
  resumeFileData: { data: string; mimeType: string }
): Promise<string> => {
  const prompt = `
    You are a professional career coach.
    
    TASK:
    Write a compelling, concise cover letter for the position of "${jobTitle}" at "${companyName}".
    
    SOURCE MATERIAL:
    Use the attached resume to extract relevant skills, experience, and achievements that match this role.
    
    TONE:
    Professional, enthusiastic, and confident. Keep it under 250 words.
    
    OUTPUT:
    Return strictly JSON with the cover letter text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: resumeFileData.mimeType,
              data: resumeFileData.data
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: coverLetterSchema,
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return result.coverLetter;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    return "Dear Hiring Manager,\n\nI am writing to express my interest in this position. Please find my resume attached.\n\nSincerely,\nCandidate";
  }
};