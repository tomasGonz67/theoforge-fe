export interface ChatMessage {
    role: 'user' | 'assistant' | 'system' | 'developer'; // ✅ Fixed the allowed roles
    content: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
    file?: string; // Add this optional property
  }
  
  
  
  
  export interface LLMResponse {
    message: string;
    error?: string;
  }
  