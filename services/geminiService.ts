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
      description: "A short, encouraging response confirming the action taken (e.g., 'I've parsed your resume. Please verify the details.').",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-4 short actionable next steps.",
    },
    updatedResume: {
      type: Type.OBJECT,
      description: "The complete updated resume data structure.",
      properties: {
        fullName: { type: Type.STRING },
        title: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        summary: { type: Type.STRING },
        themeColor: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              dates: { type: Type.STRING },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
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
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
              link: { type: Type.STRING },
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

// Timeout wrapper for API calls
const withTimeout = <T>(promise: Promise<T>, ms: number = 60000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms))
    ]);
};

export const processResumeUpdate = async (
  currentResume: ResumeData,
  userMessage: string,
  fileData?: { data: string; mimeType: string }
): Promise<{ chatResponse: string; updatedResume: ResumeData; suggestions?: string[] }> => {
  
  const isParsing = !!fileData && (!currentResume.fullName || currentResume.fullName === "");

  // Build prompt instructions
  const promptText = isParsing 
    ? `TASK: EXTRACT info from the attached resume document into the JSON structure. 
       - Do NOT hallucinate. Map fields exactly.
       - If a field is missing, leave it empty or use a reasonable default.
       - Polish the summary slightly to be professional.`
    : `TASK: Update the resume JSON based on user input: "${userMessage}".
       - Improve phrasing to be professional (Action Verb + Result).
       - Maintain existing data unless instructed to change.`;

  const parts: any[] = [];

  // Important: Add file data FIRST for better context parsing
  if (fileData) {
    parts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data
      }
    });
  }

  // Add text prompt second
  parts.push({ 
      text: `
      You are Brio AI, a Resume Architect.
      ${promptText}
      
      CURRENT JSON STATE:
      ${JSON.stringify(currentResume)}
      ` 
  });

  try {
    const response = await withTimeout(ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        // Add thinking budget to help with complex PDF extraction
        thinkingConfig: { thinkingBudget: 2048 }
      }
    }), 45000); // 45s timeout

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      chatResponse: "I encountered an issue processing that file (it might be too large or complex). Please try pasting the text content instead.",
      updatedResume: currentResume,
      suggestions: ["Try converting to text", "Upload a smaller file"]
    };
  }
};

// --- New Feature: Smart Apply / Cover Letter Generation ---

const coverLetterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coverLetter: {
      type: Type.STRING,
      description: "A professional cover letter."
    }
  },
  required: ["coverLetter"]
};

export const generateCoverLetter = async (
  jobTitle: string,
  companyName: string,
  resumeFileData: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: resumeFileData.mimeType,
              data: resumeFileData.data
            }
          },
          { text: `Write a 200-word cover letter for ${jobTitle} at ${companyName} using this resume.` }
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
    throw new Error("No response");
  } catch (error) {
    console.error("Cover Letter Error:", error);
    return "Error generating cover letter.";
  }
};

// --- New Feature: Networking Assistant ---

const networkingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    message: { type: Type.STRING },
    subjectLine: { type: Type.STRING }
  },
  required: ["message"]
};

export const generateNetworkingMessage = async (
  targetName: string,
  targetCompany: string,
  relationshipType: string,
  purpose: string,
  userContext: string
): Promise<{ message: string; subjectLine?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: [{ text: `Draft a networking message to ${targetName} at ${targetCompany}. Relation: ${relationshipType}. Purpose: ${purpose}. Context: ${userContext}.` }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: networkingSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response");
  } catch (error) {
    return { message: "Hi, I'd love to connect." };
  }
};