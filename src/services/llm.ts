import { LLMResponse, Message, ChatMessage } from '../lib/types';


const HISTORY_STORAGE_KEY = 'chat_history';

// ✅ Function to save chat history
function saveChatHistory(messages: Message[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages));
  }
}

// ✅ Function to load chat history
function loadChatHistory(): Message[] {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) as Message[] : [];
  }
  return [];
}

// ✅ Calls OpenAI API and retains memory
export async function getLLMResponse(userInput: string): Promise<LLMResponse> {
  const API_KEY = process.env.VITE_OPENAI_API_KEY;
  const MODEL = process.env.VITE_OPENAI_MODEL || "gpt-4-turbo";
  const SYSTEM_PROMPT = process.env.VITE_SYSTEM_PROMPT || "You are a helpful AI assistant. Remember the conversation history.";

  if (!API_KEY) {
    console.error("❌ ERROR: Missing OpenAI API key.");
    return { message: "Error: API key is missing.", error: "API key is missing in environment variables." };
  }

  // ✅ Load conversation history
  const conversationHistory: Message[] = loadChatHistory();

  // ✅ Append new user message (explicitly typed as `Message`)
  const userMessage: Message = {
    id: `${Date.now()}-user`,
    content: userInput,
    sender: "user", // ✅ Explicitly set sender
    timestamp: new Date().toISOString(),
  };

  const updatedHistory: Message[] = [...conversationHistory, userMessage];

  // ✅ Format messages for OpenAI API
  const messages: ChatMessage[] = [
    { role: 'system' as 'system', content: SYSTEM_PROMPT },
    ...updatedHistory.map(msg => ({
      role: msg.sender === 'user' ? ('user' as 'user') : ('assistant' as 'assistant'),
      content: msg.content
    }))
  ];

  try {
    console.log("🚀 Sending request to OpenAI API with memory:", messages);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response Data:", data);

    // ✅ Store bot response in history
    const botMessage: Message = {
      id: `${Date.now()}-bot`,
      content: data.choices[0].message.content,
      sender: "bot", // ✅ Explicitly set sender
      timestamp: new Date().toISOString(),
    };

    // ✅ Save updated chat history
    saveChatHistory([...updatedHistory, botMessage]);

    return { message: botMessage.content };
  } 
  catch (error) {
    console.error("❌ Error in getLLMResponse:", error);
    return { message: "Sorry, I encountered an error processing your request.", error: error instanceof Error ? error.message : "Unknown error" };
  }
}
