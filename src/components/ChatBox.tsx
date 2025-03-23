import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  MicrophoneIcon,
  StopIcon,
  TrashIcon,
  UserCircleIcon,
  LockClosedIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Spinner,
  Chip,
  Badge
} from "@material-tailwind/react";
import { getGuestId, getStorageKeyForGuest } from '../lib/guestIdentifier';
import { colors } from '@material-tailwind/react/types/generic';

// Enhanced guest identification
interface GuestInfo {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  interests?: string[];
  firstVisit: string;
  lastVisit: string;
  sessionCount: number;
  questionsAnswered: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isQuestion?: boolean;
  questionId?: string;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  theme?: 'light' | 'dark';
  onGuestIdentified?: (guestInfo: GuestInfo) => void;
  companyName?: string;
  logoUrl?: string;
  accentColor?: string;
}

// Constants
const AI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const SYSTEM_PROMPT = "You are a helpful, friendly AI assistant for Theoforge, a company that specializes in ETL Solutions, Knowledge Graphs, and Custom LLM Training. Your goal is to be helpful, gather information about the guest to better assist them, and ultimately help convert them to customers. Ask questions one at a time to learn about their needs. Be concise but friendly.";

// Questions to ask guests (in sequence)
const GUEST_QUESTIONS = [
  { id: 'name', question: "Before we continue, may I know your name?" },
  { id: 'company', question: "Thanks! What company are you with?" },
  { id: 'interests', question: "What specific data or AI challenges is your company facing that brought you here today?" },
  { id: 'email', question: "Would you like to receive a detailed resource about how Theoforge can help with your challenges? If so, I'd be happy to have someone send it to your email." }
];

export function ChatBox({ 
  isOpen, 
  onClose, 
  initialPrompt, 
  theme = 'light', 
  onGuestIdentified,
  companyName = "Theoforge",
  logoUrl = "/logo.png",
  accentColor = "teal"
}: ChatBoxProps) {
  // Guest identification
  const guestId = useRef<string>(getGuestId());
  const CHAT_STORAGE_KEY = useRef<string>(getStorageKeyForGuest('theoforge_chat', guestId.current));
  const GUEST_INFO_KEY = useRef<string>(getStorageKeyForGuest('theoforge_guest_info', guestId.current));
  
  // Guest info state
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    id: guestId.current,
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    sessionCount: 1,
    questionsAnswered: []
  });
  
  // Current question being asked
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  
  // Initial welcome message
  const INITIAL_MESSAGES: Message[] = [
    {
      id: generateId(),
      role: 'system',
      content: SYSTEM_PROMPT,
      timestamp: new Date().toISOString()
    },
    {
      id: generateId(),
      role: 'assistant',
      content: `Hello! I'm your AI assistant from ${companyName}. How can I help you with your data and AI needs today?`,
      timestamp: new Date().toISOString()
    }
  ];

  // Generate a unique ID for messages
  function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Chat state management
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingEffect, setTypingEffect] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string>('');
  const [fullMessageContent, setFullMessageContent] = useState<string>('');
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(true);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // UI state for resizing and minimization
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 380, height: 580 });
  const [isResizing, setIsResizing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Typing effect interval
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typingIntervalRef = useRef<any>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, typingEffect, currentTypingMessage]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && !isAwaitingAnswer) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized, isAwaitingAnswer]);

  // Filter out system messages for display
  useEffect(() => {
    setVisibleMessages(messages.filter(msg => msg.role !== 'system'));
  }, [messages]);

  // Load chat history and guest info on mount
  useEffect(() => {
    try {
      // Load chat history
      const stored = localStorage.getItem(CHAT_STORAGE_KEY.current);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (Array.isArray(data) && data.length > 0) {
            // Ensure we have a system prompt
            if (!data.some(msg => msg.role === 'system')) {
              data.unshift({
                id: generateId(),
                role: 'system',
                content: SYSTEM_PROMPT,
                timestamp: new Date().toISOString()
              });
            }
            setMessages(data);
            setShowIntroduction(false);
          }
        } catch (error) {
          console.error("Failed to parse chat history:", error);
        }
      }
      
      // Load guest info
      const storedGuestInfo = localStorage.getItem(GUEST_INFO_KEY.current);
      if (storedGuestInfo) {
        try {
          const data = JSON.parse(storedGuestInfo);
          setGuestInfo({
            ...data,
            lastVisit: new Date().toISOString(),
            sessionCount: (data.sessionCount || 0) + 1
          });
          
          // Notify parent component about guest info
          if (onGuestIdentified) {
            onGuestIdentified({
              ...data,
              lastVisit: new Date().toISOString(),
              sessionCount: (data.sessionCount || 0) + 1
            });
          }
        } catch (error) {
          console.error("Failed to parse guest info:", error);
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage:", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist chat history on every update
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY.current, JSON.stringify(messages));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    }
  }, [messages]);
  
  // Persist guest info on every update
  useEffect(() => {
    if (guestInfo) {
      try {
        localStorage.setItem(GUEST_INFO_KEY.current, JSON.stringify(guestInfo));
        
        // Notify parent component about guest info
        if (onGuestIdentified) {
          onGuestIdentified(guestInfo);
        }
      } catch (e) {
        console.warn("Could not save guest info:", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestInfo]);

  // Initial prompt handling
  useEffect(() => {
    if (initialPrompt && messages.length === INITIAL_MESSAGES.length) {
      handleSend(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);
  
  // Decision maker for when to ask questions
  useEffect(() => {
    if (messages.length > 3 && !isThinking && !isAwaitingAnswer) {
      const shouldAskQuestion = Math.random() > 0.5; // 50% chance to ask a question
      
      if (shouldAskQuestion && !currentQuestion) {
        const nextQuestion = getNextQuestionToAsk();
        if (nextQuestion) {
          setTimeout(() => {
            askGuestQuestion(nextQuestion);
          }, 1000);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isThinking]);
  
  // Typing effect for AI messages
  useEffect(() => {
    if (typingEffect && fullMessageContent) {
      let currentIndex = 0;
      
      clearInterval(typingIntervalRef.current);
      
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex <= fullMessageContent.length) {
          setCurrentTypingMessage(fullMessageContent.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingIntervalRef.current);
          setTypingEffect(false);
          
          // If this was a question, set awaiting answer flag
          if (currentQuestion) {
            setIsAwaitingAnswer(true);
          }
        }
      }, 15); // Speed of typing
      
      return () => clearInterval(typingIntervalRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingEffect, fullMessageContent]);

  // Get the next question to ask based on what's already been answered
  const getNextQuestionToAsk = () => {
    if (!guestInfo.questionsAnswered) return GUEST_QUESTIONS[0];
    
    for (const question of GUEST_QUESTIONS) {
      if (!guestInfo.questionsAnswered.includes(question.id)) {
        return question;
      }
    }
    
    return null; // All questions have been asked
  };
  
  // Ask a specific question to the guest
  const askGuestQuestion = (question: { id: string, question: string }) => {
    setCurrentQuestion(question.id);
    
    const questionMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: question.question,
      timestamp: new Date().toISOString(),
      isQuestion: true,
      questionId: question.id
    };
    
    // Use typing effect for the question
    setFullMessageContent(question.question);
    setCurrentTypingMessage('');
    setTypingEffect(true);
    
    setMessages(prev => [...prev, questionMessage]);
  };
  
  // Process the answer to a question
  const processQuestionAnswer = (questionId: string, answer: string) => {
    // Update guest info based on the question
    const updatedInfo = { ...guestInfo };
    
    switch (questionId) {
      case 'name':
        updatedInfo.name = answer;
        break;
      case 'company':
        updatedInfo.company = answer;
        break;
      case 'interests':
        updatedInfo.interests = answer.split(/,\s*/).map(i => i.trim());
        break;
      case 'email':
        // Only store email if it appears to be valid
        if (answer.includes('@') && answer.includes('.')) {
          updatedInfo.email = answer;
        }
        break;
    }
    
    // Mark this question as answered
    if (!updatedInfo.questionsAnswered.includes(questionId)) {
      updatedInfo.questionsAnswered.push(questionId);
    }
    
    setGuestInfo(updatedInfo);
    setCurrentQuestion(null);
    setIsAwaitingAnswer(false);
    
    // Return a contextual response based on the question
    let response = "";
    
    switch (questionId) {
      case 'name':
        response = `Nice to meet you, ${answer}! I'll remember your name for future conversations.`;
        break;
      case 'company':
        response = `Thanks for letting me know you're with ${answer}. That helps me provide more relevant information for your industry.`;
        break;
      case 'interests':
        response = `I appreciate you sharing your data and AI challenges. ${companyName} has expertise in those areas and can definitely help address them.`;
        break;
      case 'email':
        if (answer.includes('@') && answer.includes('.')) {
          response = `Perfect! Someone from our team will send resources about our solutions to ${answer} shortly. In the meantime, is there anything specific you'd like to know more about?`;
        } else {
          response = `No problem. You can always request information later if you change your mind. Is there anything specific about our services you'd like to know more about?`;
        }
        break;
      default:
        response = "Thank you for sharing that information. How else can I assist you today?";
    }
    
    return response;
  };

  // RESIZING HANDLERS
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startSizeRef.current = { ...chatSize };
    
    // Add event listeners
    const handleMouseMove = (e: MouseEvent) => handleResize(e);
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    const deltaW = e.clientX - startPosRef.current.x;
    const deltaH = e.clientY - startPosRef.current.y;
    setChatSize({
      width: Math.max(320, startSizeRef.current.width + deltaW),
      height: Math.max(400, startSizeRef.current.height + deltaH)
    });
  };

  // Toggle minimization of the chatbox
  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  // Utility: Format timestamp
  const formatTime = (timestamp: string) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get AI response using sendMessage
  const getAIResponse = async (context: Message[]): Promise<string> => {
    setIsThinking(true);
    setError(null);
    
    try {
      // If this was in response to a question, process the answer
      if (currentQuestion) {
        const userMessage = context.find(m => m.role === 'user');
        if (userMessage) {
          const questionResponse = processQuestionAnswer(currentQuestion, userMessage.content);
          return questionResponse;
        }
      }
      
      // Prepare messages for the API
      const apiMessages = context.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      // Add guest info to system message if available
      if (guestInfo.name || guestInfo.company || guestInfo.interests) {
        let guestContext = "Current guest information:\n";
        if (guestInfo.name) guestContext += `- Name: ${guestInfo.name}\n`;
        if (guestInfo.company) guestContext += `- Company: ${guestInfo.company}\n`;
        if (guestInfo.interests && guestInfo.interests.length > 0) {
          guestContext += `- Interests: ${guestInfo.interests.join(', ')}\n`;
        }
        
        // Add this context to the first system message
        apiMessages[0].content = `${SYSTEM_PROMPT}\n\n${guestContext}`;
      }
      
      // Use environment variable for API key
      const apiKey = process.env.VITE_OPENAI_API_KEY || '';
      console.log("API: ", apiKey);
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: apiMessages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error generating AI response:", error);
      setError(error.message || "Failed to get response from AI service");
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    } finally {
      setIsThinking(false);
    }
  };

  // Clear the chat history
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages(INITIAL_MESSAGES);
      setCurrentQuestion(null);
      setIsAwaitingAnswer(false);
      setShowIntroduction(true);
      try {
        localStorage.removeItem(CHAT_STORAGE_KEY.current);
      } catch (e) {
        console.warn("Could not access localStorage:", e);
      }
    }
  };

  // Handler for sending text messages
  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input.trim();
    if (!textToSend) return;
    
    // Hide introduction once user starts chatting
    if (showIntroduction) {
      setShowIntroduction(false);
    }
    
    setInput('');
    
    // Create a new user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    
    // Update messages state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Context limitation - use last 15 messages for context (including system prompt)
    const context = updatedMessages.slice(-15);
    
    // Ensure system prompt is included
    if (!context.some(msg => msg.role === 'system')) {
      context.unshift({
        id: generateId(),
        role: 'system',
        content: SYSTEM_PROMPT,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get AI response
    const aiReply = await getAIResponse(context);
    
    // Add AI response to messages
    const aiMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: aiReply,
      timestamp: new Date().toISOString()
    };
    
    // Use typing effect for AI response
    setFullMessageContent(aiReply);
    setCurrentTypingMessage('');
    setTypingEffect(true);
    
    setMessages([...updatedMessages, aiMessage]);
  };

  // Allow sending message with Enter key (without Shift)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // VOICE RECORDING FUNCTIONS
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Could not access your microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Voice-to-text processing (simulated)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const processAudioToText = async (_audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      // Simulate a delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If we're awaiting an answer to a specific question, provide a tailored response
      if (isAwaitingAnswer && currentQuestion) {
        switch (currentQuestion) {
          case 'name':
            setInput("John Smith");
            break;
          case 'company':
            setInput("Acme Corp");
            break;
          case 'interests':
            setInput("Knowledge graphs, data integration, AI model training");
            break;
          case 'email':
            setInput("john.smith@acmecorp.com");
            break;
          default:
            setInput(`Can you tell me more about ${companyName}'s Knowledge Graph solutions?`);
        }
      } else {
        // Default speech transcription
        setInput(`Can you tell me more about ${companyName}'s Knowledge Graph solutions?`);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError("Failed to transcribe your voice message.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Quick replies/suggestions
  const handleQuickReply = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(text), 100);
  };

  // Render the minimized chat button
  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleMinimize}
          className={`bg-${accentColor}-500 text-white p-4 rounded-full shadow-lg hover:bg-${accentColor}-600 transition transform hover:scale-105 flex items-center justify-center`}
          aria-label="Open chat"
        >
          <Badge content={visibleMessages.length > 2 ? "1" : "0"} color="red">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </Badge>
          <span className="sr-only">Open chat</span>
        </button>
      </div>
    );
  }

  // Determine theme-based classes
  const themeClasses = theme === 'dark' 
    ? {
        card: "bg-gray-900 border-gray-800",
        header: `bg-gradient-to-r from-${accentColor}-800 to-${accentColor}-900`,
        body: "bg-gray-900",
        message: {
          user: `bg-${accentColor}-600 text-white`,
          assistant: "bg-gray-800 text-gray-100",
          question: "bg-indigo-700 text-white border border-indigo-400",
          timestamp: {
            user: `text-${accentColor}-200`,
            assistant: "text-gray-400",
            question: "text-indigo-200"
          }
        },
        input: "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
        buttons: "text-gray-300 hover:bg-gray-700",
        quickReplies: "bg-gray-800 border-gray-700 text-white",
        footer: "border-gray-800"
      }
    : {
        card: "bg-white border-gray-200",
        header: `bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600`,
        body: "bg-white",
        message: {
          user: `bg-${accentColor}-500 text-white`,
          assistant: "bg-gray-100 text-gray-800",
          question: "bg-indigo-500 text-white border border-indigo-300",
          timestamp: {
            user: `text-${accentColor}-100`,
            assistant: "text-gray-500",
            question: "text-indigo-100"
          }
        },
        input: "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500",
        buttons: "text-gray-700 hover:bg-gray-100",
        quickReplies: "bg-gray-50 border-gray-200 text-gray-700",
        footer: "border-gray-200"
      };

  // Quick reply suggestions based on context
  const getSuggestions = () => {
    if (visibleMessages.length <= 1) {
      return [
        `Tell me about ${companyName}`,
        "What services do you offer?",
        "How can I schedule a demo?"
      ];
    }
    
    if (guestInfo.interests?.length) {
      return [
        `How do you handle ${guestInfo.interests[0]}?`,
        "What are your pricing options?",
        "Can you share some case studies?"
      ];
    }
    
    return [
      "Tell me about your Knowledge Graph solutions",
      "What makes your ETL solutions unique?",
      "Do you offer custom LLM training?"
    ];
  };

  return (
    <div
      ref={resizeRef}
      className="fixed bottom-4 right-4 z-50 shadow-xl rounded-xl overflow-hidden transition-all duration-300"
      style={{ width: `${chatSize.width}px`, height: `${chatSize.height}px` }}
    >
      <Card className={`w-full h-full flex flex-col border rounded-xl ${themeClasses.card}`}>
        {/* Header */}
        <CardHeader 
          floated={false}
          className={`sticky top-0 z-20 px-6 pt-4 pb-6 m-0 rounded-b-none shadow-md ${themeClasses.header}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative mr-3">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={`${companyName} Logo`} 
                    className="h-9 w-9 rounded-full border-2 border-white shadow-sm" 
                  />
                ) : (
                  <SparklesIcon className="h-6 w-6 text-white" />
                )}
                {guestInfo.name && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div>
                <Typography className="text-white text-lg font-bold flex items-center">
                  {companyName} AI
                  <Tooltip content="Powered by AI">
                    <SparklesIcon className="h-4 w-4 ml-1.5 text-white opacity-75" />
                  </Tooltip>
                </Typography>
                {guestInfo.name && (
                  <Typography className="text-white text-xs opacity-90 flex items-center">
                    <UserCircleIcon className="h-3 w-3 mr-1" />
                    Speaking with {guestInfo.name}
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Tooltip content="Clear chat history">
                <IconButton
                  onClick={clearChat}
                  variant="text"
                  color="white"
                  className="h-8 w-8 rounded-full hover:bg-white/20 transition-all"
                  size="sm"
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </Tooltip>
              <Tooltip content="Minimize">
                <IconButton
                  onClick={toggleMinimize}
                  variant="text"
                  color="white"
                  className="h-8 w-8 rounded-full hover:bg-white/20 transition-all" size="sm"
                >
                  <MinusIcon className="h-4 w-4" />
                </IconButton>
                </Tooltip>
              <Tooltip content={chatSize.width > 400 ? "Smaller size" : "Larger size"}>
                <IconButton
                  onClick={() => setChatSize(
                    chatSize.width > 400 
                      ? { width: 380, height: 520 } 
                      : { width: 480, height: 600 }
                  )}
                  variant="text"
                  color="white"
                  className="h-8 w-8 rounded-full hover:bg-white/20 transition-all"
                  size="sm"
                >
                  {chatSize.width > 400 ? (
                    <ArrowsPointingInIcon className="h-4 w-4" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip content="Close">
                <IconButton
                  onClick={onClose}
                  variant="text"
                  color="white"
                  className="h-8 w-8 rounded-full hover:bg-white/20 transition-all"
                  size="sm"
                >
                  <XMarkIcon className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        
        {/* Message Container */}
        <CardBody 
          ref={chatContainerRef} 
          className={`h-full flex-grow overflow-y-auto p-6 space-y-4 ${themeClasses.body}`}
        >
          {/* Introduction Panel - only shown at first */}
          {showIntroduction && (
            <div className={`mb-6 p-4 rounded-lg border border-${accentColor}-100 bg-${accentColor}-50 text-${accentColor}-900 dark:border-${accentColor}-800 dark:bg-${accentColor}-900/20 dark:text-${accentColor}-100`}>
              <div className="flex items-center mb-3">
                <SparklesIcon className={`h-5 w-5 text-${accentColor}-500 mr-2`} />
                <Typography variant="h6" className="font-semibold">Welcome to {companyName} AI Assistant</Typography>
              </div>
              <Typography variant="small" className="mb-3">
                I'm here to help answer your questions about our services and solutions. Feel free to ask about:
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div className={`p-2 rounded border border-${accentColor}-200 bg-white/80 dark:bg-gray-800/80 flex items-center`}>
                  <div className={`mr-2 p-1 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900`}>
                    <ChevronDoubleRightIcon className={`h-3 w-3 text-${accentColor}-500`} />
                  </div>
                  <Typography variant="small" className="font-medium">ETL Solutions</Typography>
                </div>
                <div className={`p-2 rounded border border-${accentColor}-200 bg-white/80 dark:bg-gray-800/80 flex items-center`}>
                  <div className={`mr-2 p-1 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900`}>
                    <ChevronDoubleRightIcon className={`h-3 w-3 text-${accentColor}-500`} />
                  </div>
                  <Typography variant="small" className="font-medium">Knowledge Graphs</Typography>
                </div>
                <div className={`p-2 rounded border border-${accentColor}-200 bg-white/80 dark:bg-gray-800/80 flex items-center`}>
                  <div className={`mr-2 p-1 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900`}>
                    <ChevronDoubleRightIcon className={`h-3 w-3 text-${accentColor}-500`} />
                  </div>
                  <Typography variant="small" className="font-medium">Custom LLM Training</Typography>
                </div>
                <div className={`p-2 rounded border border-${accentColor}-200 bg-white/80 dark:bg-gray-800/80 flex items-center`}>
                  <div className={`mr-2 p-1 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900`}>
                    <ChevronDoubleRightIcon className={`h-3 w-3 text-${accentColor}-500`} />
                  </div>
                  <Typography variant="small" className="font-medium">Case Studies & Pricing</Typography>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <LockClosedIcon className="h-3 w-3 mr-1 text-gray-400" />
                <Typography variant="small" className="text-xs text-gray-500">
                  Your conversations are stored locally on your device only
                </Typography>
              </div>
            </div>
          )}
          
          {/* Guest info chip - only show once info is collected */}
          {guestInfo.name && guestInfo.company && (
            <div className="flex justify-center mb-4">
              <Chip
                value={
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4" />
                    <span>{guestInfo.name} from {guestInfo.company}</span>
                  </div>
                }
                color={accentColor as colors}
                variant="ghost"
                className="px-3 py-1.5"
              />
            </div>
          )}
          
          {visibleMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 rounded-xl shadow-md ${
                  msg.role === 'user' 
                    ? themeClasses.message.user 
                    : msg.isQuestion
                      ? themeClasses.message.question
                      : themeClasses.message.assistant
                } ${msg === visibleMessages[visibleMessages.length - 1] && typingEffect ? 'animate-pulse' : ''}`}
              >
                {msg === visibleMessages[visibleMessages.length - 1] && typingEffect 
                  ? <Typography className="text-sm whitespace-pre-wrap">{currentTypingMessage}<span className="animate-pulse">▌</span></Typography>
                  : <Typography className="text-sm whitespace-pre-wrap">{msg.content}</Typography>
                }
                <Typography 
                  variant="small" 
                  className={`mt-1 text-xs ${
                    msg.role === 'user' 
                      ? themeClasses.message.timestamp.user 
                      : msg.isQuestion
                        ? themeClasses.message.timestamp.question
                        : themeClasses.message.timestamp.assistant
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </Typography>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] p-4 rounded-xl shadow ${themeClasses.message.assistant}`}>
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" color={accentColor as colors} />
                  <Typography className="text-sm">Thinking...</Typography>
                </div>
              </div>
            </div>
          )}
          
          {isTranscribing && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] p-4 rounded-xl shadow ${themeClasses.message.assistant}`}>
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" color={accentColor as colors} />
                  <Typography className="text-sm">Transcribing audio...</Typography>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[90%] p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="small" className="font-medium">{error}</Typography>
                    <Button 
                      variant="text" 
                      size="sm" 
                      color="red" 
                      className="p-0 mt-1" 
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Replies */}
          {visibleMessages.length > 0 && !isThinking && !isAwaitingAnswer && !typingEffect && (
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              {getSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="sm"
                  color={accentColor as colors}
                  className={`px-3 py-1.5 cursor-pointer hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20 transition-colors`}
                  onClick={() => handleQuickReply(suggestion)}
                >{suggestion}</Button>
              ))}
            </div>
          )}
          
          <div ref={messageEndRef} />
        </CardBody>
        
        {/* Footer / Input */}
        <CardFooter className={`p-4 border-t ${themeClasses.footer}`}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAwaitingAnswer ? `Please answer the question...` : "Type your message..."}
              className={`flex-grow border rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 ${themeClasses.input} ${isAwaitingAnswer ? `border-indigo-300 animate-pulse` : ''}`}
              disabled={isThinking || isTranscribing}
            />
            
            <div className="absolute right-20 flex">
              {isRecording ? (
                <IconButton
                  onClick={stopRecording}
                  variant="filled"
                  color="red"
                  className="h-9 w-9 rounded-full transition-all"
                  size="sm"
                >
                  <StopIcon className="h-4 w-4" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={startRecording}
                  variant="text"
                  color={accentColor as colors}
                  className="h-9 w-9 rounded-full transition-all"
                  size="sm"
                  disabled={isThinking || isTranscribing}
                >
                  <MicrophoneIcon className="h-4 w-4" />
                </IconButton>
              )}
            </div>
            
            <Button 
              onClick={() => handleSend()} 
              color={accentColor as colors}
              variant="gradient"
              className="p-2 rounded-full shadow-md"
              disabled={isThinking || isTranscribing || !input.trim()}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {visibleMessages.length > 1 && !isAwaitingAnswer && (
            <div className="mt-2 text-center">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                <LockClosedIcon className="h-3 w-3" />
                Messages are saved locally on this device
              </Typography>
            </div>
          )}
          
          {isAwaitingAnswer && (
            <div className="mt-2 text-center">
              <Typography variant="small" className="text-indigo-500 dark:text-indigo-400 text-xs font-medium">
                Please answer the question above to continue
              </Typography>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize bg-transparent flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
        aria-label="Resize chat window"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <rect x="0" y="8" width="2" height="2" />
          <rect x="4" y="8" width="2" height="2" />
          <rect x="8" y="8" width="2" height="2" />
          <rect x="4" y="4" width="2" height="2" />
          <rect x="8" y="4" width="2" height="2" />
          <rect x="8" y="0" width="2" height="2" />
        </svg>
      </div>
    </div>
  );
}
