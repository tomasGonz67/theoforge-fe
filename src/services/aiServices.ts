/* eslint-disable @typescript-eslint/no-explicit-any */
// services/aiServices.ts
import { getGuestId } from '../lib/guestIdentifier';

// Interface for messages
interface Message {
  role: string;
  content: string;
}

// Interface for the response
interface AIResponse {
  success: boolean;
  data?: {
    result: string;
    messageId?: string;
  };
  error?: string;
}

/**
 * Send a message to the AI service and get a response
 * @param prompt User's message
 * @param context Conversation history for context
 * @returns Promise with the AI response
 */
export async function sendMessage(
  prompt: string,
  context: Message[]
): Promise<AIResponse> {
  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  
  if (!apiKey) {
    console.error("API key is missing");
    return { 
      success: false, 
      error: "API configuration is missing. Please contact support." 
    };
  }

  try {
    // Log request for debugging (remove in production)
    console.debug("Sending request to AI service with context length:", context.length);
    
    // Send request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using a more capable model
        messages: context,
        max_tokens: 500,
        temperature: 0.7,
        user: getGuestId() // For API rate limiting per user
      })
    });
    
    // Handle unsuccessful response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      
      return { 
        success: false, 
        error: errorData?.error?.message || `API Error: ${response.statusText}` 
      };
    }
    
    // Parse successful response
    const data = await response.json();
    
    return { 
      success: true, 
      data: { 
        result: data.choices[0].message.content,
        messageId: data.id
      } 
    };
  } catch (error: any) {
    console.error("Error in sendMessage:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred" 
    };
  }
}

/**
 * Transcribe audio to text using a speech-to-text API
 * @param audioBlob Audio recording blob
 * @returns Promise with transcribed text
 */
export async function transcribeAudio(
  audioBlob: Blob
): Promise<AIResponse> {
  // Get API key from environment variables
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  
  if (!apiKey) {
    return { 
      success: false, 
      error: "API configuration is missing. Please contact support." 
    };
  }
  
  try {
    // Create aFormData object to send the audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Specify language if known
    
    // Send to OpenAI's Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData?.error?.message || `Transcription API Error: ${response.statusText}` 
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data: {
        result: data.text
      }
    };
  } catch (error: any) {
    console.error("Error in transcribeAudio:", error);
    return { 
      success: false, 
      error: error.message || "Failed to transcribe audio" 
    };
  }
}

export default {
  sendMessage,
  transcribeAudio
};