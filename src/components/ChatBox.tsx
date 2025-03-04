import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon, 
  MinusIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
  Button
} from "@material-tailwind/react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface UserInfo {
  name?: string;
  company?: string;
  industry?: string;
  projectType?: string[];
  budget?: string;
  timeline?: string;
  contactInfo?: string;
  painPoints?: string[];
  currentTech?: string[];
  additionalNotes?: string;
  firstContactTimestamp: string;
  conversationHistory: Message[];
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILE_NAME = 'chat_history.json';

const INITIAL_MESSAGES: Message[] = [
  { 
    role: 'assistant', 
    content: "Hello! I'm here to help you with your project. What is your name?",
    timestamp: new Date().toISOString()
  },
  { 
    role: 'assistant', 
    content: "Type 'clear' at any time if you want to restart our conversation.",
    timestamp: new Date().toISOString()
  }
];

enum PromptStage {
  NAME,
  COMPANY,
  INDUSTRY,
  PROJECT_TYPE,
  BUDGET,
  TIMELINE,
  CONTACT_INFO,
  PAIN_POINTS,
  CURRENT_TECH,
  ADDITIONAL_NOTES,
  COMPLETED
}

export function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  // Original state
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstContactTimestamp: new Date().toISOString(),
    conversationHistory: []
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<PromptStage>(PromptStage.NAME);
  const [attemptCount, setAttemptCount] = useState<Record<PromptStage, number>>({} as Record<PromptStage, number>);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 380, height: 520 });
  const [isResizing, setIsResizing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Resize functionality
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startSizeRef.current = { ...chatSize };
    
    // Add event listeners for drag and release
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaWidth = e.clientX - startPosRef.current.x;
    const deltaHeight = e.clientY - startPosRef.current.y;
    
    const newWidth = Math.max(320, startSizeRef.current.width + deltaWidth);
    const newHeight = Math.max(400, startSizeRef.current.height + deltaHeight);
    
    setChatSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Format time for chat bubbles
  const formatTime = (timestamp?: string) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Simulated typing effect
  const simulateTypingEffect = async (message: string) => {
    setIsTyping(true);
    
    // Add a small delay to simulate typing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsTyping(false);
    return message;
  };

  // Original functions (keeping core functionality intact)
  const resetSession = async () => {
    setUserInfo({
      firstContactTimestamp: new Date().toISOString(),
      conversationHistory: []
    });
    setMessages(INITIAL_MESSAGES);
    setCurrentStage(PromptStage.NAME);
    setAttemptCount({} as Record<PromptStage, number>);
    await saveToFile([]);
  };

  const getCurrentPrompt = (): string => {
    switch (currentStage) {
      case PromptStage.NAME:
        return "What is your name?";
      case PromptStage.COMPANY:
        // Make sure we're not using "Hello" as the name if it was stored
        const displayName = userInfo.name && !isGenericGreeting(userInfo.name) ? userInfo.name : '';
        return `Nice to meet you${displayName ? ', ' + displayName : ''}! What's your company name?`;
      case PromptStage.INDUSTRY:
        return "What industry are you in?";
      case PromptStage.PROJECT_TYPE:
        return "What type of project are you interested in?";
      case PromptStage.BUDGET:
        return "Do you have a specific budget range in mind?";
      case PromptStage.TIMELINE:
        return "What is your expected project timeline?";
      case PromptStage.CONTACT_INFO:
        return "How can we contact you? (Email or phone number)";
      case PromptStage.PAIN_POINTS:
        return "What are the biggest pain points you're facing?";
      case PromptStage.CURRENT_TECH:
        return "Are you using any current technologies for this project?";
      case PromptStage.ADDITIONAL_NOTES:
        return "Any additional notes you'd like to share?";
      case PromptStage.COMPLETED:
        return `Thanks for sharing all that information, ${userInfo.name}! I'll review your project details and get back to you soon. Is there anything else you'd like to add?`;
      default:
        return "Is there anything else you'd like to discuss?";
    }
  };

  const saveToFile = async (data: Message[]) => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: FILE_NAME,
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
    } catch (error) {
      console.error("Error saving chat data:", error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
      });
      const file = await handle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);
      setMessages(data);
      
      // Determine current stage based on loaded userInfo
      const loadedUserInfo = determineUserInfoFromMessages(data);
      setUserInfo(loadedUserInfo);
      setCurrentStage(determineCurrentStage(loadedUserInfo));
    } catch (error) {
      console.error("No previous chat found, starting fresh.");
    }
  };

  const determineUserInfoFromMessages = (messages: Message[]): UserInfo => {
    // Initialize with default values
    const userInfo: UserInfo = {
      firstContactTimestamp: new Date().toISOString(),
      conversationHistory: []
    };
    
    // This is a simplified implementation
    // A more robust solution would parse the actual conversation
    // and extract the relevant information
    
    return userInfo;
  };

  const determineCurrentStage = (userInfo: UserInfo): PromptStage => {
    if (!userInfo.name) return PromptStage.NAME;
    if (!userInfo.company) return PromptStage.COMPANY;
    if (!userInfo.industry) return PromptStage.INDUSTRY;
    if (!userInfo.projectType?.length) return PromptStage.PROJECT_TYPE;
    if (!userInfo.budget) return PromptStage.BUDGET;
    if (!userInfo.timeline) return PromptStage.TIMELINE;
    if (!userInfo.contactInfo) return PromptStage.CONTACT_INFO;
    if (!userInfo.painPoints?.length) return PromptStage.PAIN_POINTS;
    if (!userInfo.currentTech?.length) return PromptStage.CURRENT_TECH;
    if (!userInfo.additionalNotes) return PromptStage.ADDITIONAL_NOTES;
    return PromptStage.COMPLETED;
  };

  const incrementAttemptCount = (stage: PromptStage) => {
    setAttemptCount(prev => ({
      ...prev,
      [stage]: (prev[stage] || 0) + 1
    }));
  };

  const isUncertaintyResponse = (input: string): boolean => {
    const lowerInput = input.toLowerCase().trim();
    const uncertaintyPatterns = [
      /^(idk|i don't know|don't know|dunno|not sure|unsure|uncertain)$/,
      /^(no idea|haven't thought about it|haven't decided)$/,
      /^(what do you (think|suggest|recommend))$/,
      /^(can you (help|suggest|recommend))$/,
      /^(i'm not sure)$/,
      /^(hmm|um|uh|eh|well)$/,
      /^(skip|pass|next|later)$/
    ];
    
    return uncertaintyPatterns.some(pattern => pattern.test(lowerInput));
  };

  const isGenericGreeting = (input: string): boolean => {
    const lowerInput = input.toLowerCase().trim();
    return /^(hi|hey|hello|yo|sup|what's up|howdy)$/.test(lowerInput);
  };

  const getUncertaintyResponse = (stage: PromptStage, attempts: number): string => {
    const fallbackResponse = "That's alright if you're not sure right now.";
    
    const suggestions: Record<PromptStage, string[]> = {
      [PromptStage.NAME]: [
        "No problem! You can just give me a nickname to call you.",
        "That's okay. I'll just call you 'friend' for now. We can come back to this later if you'd like."
      ],
      [PromptStage.COMPANY]: [
        "No worries! Are you an independent contractor or just exploring options? You can just say 'independent' or 'exploring'.",
        "That's fine! We can mark this as 'undecided' for now."
      ],
      [PromptStage.INDUSTRY]: [
        "That's okay! What general area are you working in? Tech, healthcare, education, etc.?",
        "No problem. We can categorize this as 'general' for now."
      ],
      [PromptStage.PROJECT_TYPE]: [
        "That's fine. Are you looking for website development, mobile app, or something else?",
        "No worries! We can just mark this as 'exploratory' for now."
      ],
      [PromptStage.BUDGET]: [
        "That's completely okay! Would you prefer we provide some budget options based on your project type?",
        "No problem. We work with projects of all sizes. We can discuss budget details later."
      ],
      [PromptStage.TIMELINE]: [
        "That's fine! Would you say it's urgent, within a few months, or longer term?",
        "No rush. We can mark this as 'flexible' and discuss timeline options later."
      ],
      [PromptStage.CONTACT_INFO]: [
        "No problem. We'll need contact information eventually, but we can proceed for now.",
        "That's okay! When you're ready to share contact information, just let us know."
      ],
      [PromptStage.PAIN_POINTS]: [
        "That's fine. Maybe think about what motivated you to look for a solution?",
        "No problem. We can explore your specific needs in more detail later."
      ],
      [PromptStage.CURRENT_TECH]: [
        "No worries. Are you currently using any software or platforms at all?",
        "That's okay. We can discuss technical details later in the process."
      ],
      [PromptStage.ADDITIONAL_NOTES]: [
        "That's fine! Feel free to share any additional thoughts later if they come to mind.",
        "No problem! We've gathered the essential information for now."
      ],
      [PromptStage.COMPLETED]: [
        "Thanks for chatting! Let me know if you have any questions.",
        "Great! I'll be here if you need anything else."
      ]
    };
    
    // Get suggestions for current stage
    const stageResponses = suggestions[stage] || [];
    
    // If we have suggestions for this stage, return based on attempt count
    if (stageResponses.length > 0) {
      // Use first suggestion on first attempt, second on second attempt, etc.
      const responseIndex = Math.min(attempts - 1, stageResponses.length - 1);
      return stageResponses[responseIndex];
    }
    
    return fallbackResponse;
  };

  const isValidInput = (input: string, stage: PromptStage): boolean => {
    const trimmed = input.trim();
  
    // Handle clear command separately
    if (trimmed.toLowerCase() === "clear") return true;
    
    // Handle uncertainty responses
    if (isUncertaintyResponse(trimmed)) return true;
    
    // Reject empty input
    if (!trimmed) return false;
  
    // For NAME stage, reject generic greetings
    if (stage === PromptStage.NAME && isGenericGreeting(trimmed)) {
      return false;
    }
  
    // If it's just a greeting at a stage other than NAME, it's not a valid response
    if (isGenericGreeting(trimmed) && stage !== PromptStage.NAME) return false;
  
    // Reject single characters or non-alphanumeric input for most fields
    // but allow them if we've already tried multiple times
    const attemptForStage = attemptCount[stage] || 0;
    if (attemptForStage < 2 && (trimmed.length === 1 || /^[^a-zA-Z0-9]+$/.test(trimmed))) return false;
  
    // After a few attempts, accept almost anything that's not empty
    if (attemptForStage >= 3) return true;
    
    // Stage-specific validations (less strict now)
    switch (stage) {
      case PromptStage.NAME:
        // Names should generally have letters, but we'll be flexible
        return trimmed.length >= 2; // Increase min length to 2
      
      case PromptStage.CONTACT_INFO:
        // Be more forgiving with contact info format after first attempt
        if (attemptForStage >= 1) return trimmed.length >= 3;
        
        // Basic email or phone validation
        const isEmail = /\S+@\S+\.\S+/.test(trimmed);
        const isPhone = /[\d\s\(\)\-\+]{7,}/.test(trimmed);
        return isEmail || isPhone;
      
      default:
        // For other fields, just ensure there's some content
        return trimmed.length >= 1;
    }
  };

  const getResponseForInvalidInput = (stage: PromptStage, attempts: number): string => {
    // After multiple attempts, be more forgiving and flexible
    if (attempts >= 3) {
      return "Let's move forward. " + getCurrentPrompt();
    }
    
    // Generic responses for invalid inputs
    const genericResponses = [
      "I didn't quite understand that. Could you please try again?",
      "Hmm, that doesn't seem like what I was expecting. Let's try again.",
      "I need a bit more specific information for this question."
    ];
    
    // Stage-specific responses
    switch (stage) {
      case PromptStage.NAME:
        return "I'd like to know what to call you. Any name or nickname is fine.";
      
      case PromptStage.CONTACT_INFO:
        return "I need a way to contact you later. An email or phone number would be great.";
      
      case PromptStage.BUDGET:
        return "For budget, even a rough range would be helpful. Or you can say 'not sure' if you haven't decided.";
      
      default:
        // Pick a response based on attempt count
        return genericResponses[Math.min(attempts, genericResponses.length - 1)];
    }
  };

  const handleConversationalInput = (input: string): { isRelevant: boolean, response: string, advanceStage: boolean } => {
    // Convert to lowercase for easier comparison
    const lowerInput = input.toLowerCase();
    
    if (currentStage === PromptStage.NAME && isGenericGreeting(input)) {
      return { 
        isRelevant: true, 
        response: "Hi there! I'm looking for your name so I know what to call you. What's your name?", 
        advanceStage: false 
      };
    }

    if (isGenericGreeting(input) && currentStage !== PromptStage.NAME) {
      return { 
        isRelevant: true, 
        response: `Hi there! We were talking about your project. ${getCurrentPrompt()}`, 
        advanceStage: false 
      };
    }
    
    if (lowerInput.match(/^(how are you|how's it going)$/)) {
      return { 
        isRelevant: true, 
        response: `I'm doing great, thanks for asking! Now, ${getCurrentPrompt()}`, 
        advanceStage: false 
      };
    }
    
    if (lowerInput.match(/^(what is this|what's this about|what are you|who are you)$/)) {
      return { 
        isRelevant: true, 
        response: "I'm here to gather information about your project so we can help you better. " + getCurrentPrompt(), 
        advanceStage: false 
      };
    }
    
    // If no conversational pattern is matched, process as a direct answer
    return { isRelevant: false, response: "", advanceStage: true };
  };

  const updateUserInfoBasedOnStage = (input: string, currentStage: PromptStage, userInfo: UserInfo): UserInfo => {
    const updatedUserInfo = { ...userInfo };
    
    // If this is an uncertainty response, handle specially
    if (isUncertaintyResponse(input)) {
      switch (currentStage) {
        case PromptStage.NAME:
          updatedUserInfo.name = "Friend"; // Default name
          break;
        case PromptStage.COMPANY:
          updatedUserInfo.company = "Undecided";
          break;
        case PromptStage.INDUSTRY:
          updatedUserInfo.industry = "General";
          break;
        case PromptStage.PROJECT_TYPE:
          updatedUserInfo.projectType = ["Exploratory"];
          break;
        case PromptStage.BUDGET:
          updatedUserInfo.budget = "To be discussed";
          break;
        case PromptStage.TIMELINE:
          updatedUserInfo.timeline = "Flexible";
          break;
        case PromptStage.CONTACT_INFO:
          updatedUserInfo.contactInfo = "To be provided later";
          break;
        case PromptStage.PAIN_POINTS:
          updatedUserInfo.painPoints = ["To be discussed"];
          break;
        case PromptStage.CURRENT_TECH:
          updatedUserInfo.currentTech = ["To be discussed"];
          break;
        case PromptStage.ADDITIONAL_NOTES:
          updatedUserInfo.additionalNotes = "None provided";
          break;
        default:
          // Add to conversation history for completed stages
          updatedUserInfo.conversationHistory = [
            ...(updatedUserInfo.conversationHistory || []),
            { role: 'user', content: input }
          ];
      }
      return updatedUserInfo;
    }
    
    // Normal input processing
    switch (currentStage) {
      case PromptStage.NAME:
        updatedUserInfo.name = input;
        break;
      case PromptStage.COMPANY:
        updatedUserInfo.company = input;
        break;
      case PromptStage.INDUSTRY:
        updatedUserInfo.industry = input;
        break;
      case PromptStage.PROJECT_TYPE:
        updatedUserInfo.projectType = [input];
        break;
      case PromptStage.BUDGET:
        updatedUserInfo.budget = input;
        break;
      case PromptStage.TIMELINE:
        updatedUserInfo.timeline = input;
        break;
      case PromptStage.CONTACT_INFO:
        updatedUserInfo.contactInfo = input;
        break;
      case PromptStage.PAIN_POINTS:
        updatedUserInfo.painPoints = [input];
        break;
      case PromptStage.CURRENT_TECH:
        updatedUserInfo.currentTech = [input];
        break;
      case PromptStage.ADDITIONAL_NOTES:
        updatedUserInfo.additionalNotes = input;
        break;
      default:
        // Add to conversation history for completed stages
        updatedUserInfo.conversationHistory = [
          ...(updatedUserInfo.conversationHistory || []),
          { role: 'user', content: input }
        ];
    }
    
    return updatedUserInfo;
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = input.trim();
    setInput('');
  
    if (userMessage.toLowerCase() === "clear") {
      await resetSession();
      return;
    }
  
    // Add user message to chat
    const newMessages = [...messages, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    }];
    setMessages(newMessages);
  
    // Ensure conversational input is handled
    const conversationalResult = handleConversationalInput(userMessage);
    if (conversationalResult.isRelevant) {
      const botResponse = await simulateTypingEffect(conversationalResult.response);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: botResponse,
        timestamp: new Date().toISOString()
      }]);
      return;
    }
  
    // Get current attempt count for this stage
    const currentAttempts = attemptCount[currentStage] || 0;
  
    // Validate input based on current stage
    if (!isValidInput(userMessage, currentStage)) {
      incrementAttemptCount(currentStage);
      const invalidResponse = getResponseForInvalidInput(currentStage, currentAttempts + 1);
      const botResponse = await simulateTypingEffect(invalidResponse);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: botResponse,
        timestamp: new Date().toISOString()
      }]);
      return;
    }
  
    // Correctly update userInfo
    const updatedUserInfo = updateUserInfoBasedOnStage(userMessage, currentStage, userInfo);
    setUserInfo(updatedUserInfo);
    
    // Check for uncertainty response
    const isUncertain = isUncertaintyResponse(userMessage);
    if (isUncertain) {
      incrementAttemptCount(currentStage);
      const uncertaintyResponse = getUncertaintyResponse(currentStage, currentAttempts + 1);
      
      // Advance to next stage
      const nextStage = currentStage < PromptStage.COMPLETED ? currentStage + 1 : currentStage;
      setCurrentStage(nextStage);
      
      // Get next prompt
      const nextPrompt = nextStage === currentStage 
          ? "Is there anything else you'd like to tell me?"
          : getCurrentPrompt();
      
      // Add both the uncertainty response and the next prompt
      const responseMessage = `${uncertaintyResponse} ${nextPrompt}`;
      const botResponse = await simulateTypingEffect(responseMessage);
      const updatedMessages = [...newMessages, { 
        role: 'assistant', 
        content: botResponse,
        timestamp: new Date().toISOString()
      }];
      setMessages(updatedMessages);
      await saveToFile(updatedMessages);
      return;
    }
    
    // Reset attempt count for this stage
    setAttemptCount(prev => ({...prev, [currentStage]: 0}));
    
    // Advance to next stage
    const nextStage = currentStage < PromptStage.COMPLETED ? currentStage + 1 : currentStage;
    setCurrentStage(nextStage);
    
    // Get prompt for next stage
    const nextPrompt = nextStage === currentStage 
      ? "Thanks for that information! Is there anything else you'd like to tell me?"
      : getCurrentPrompt();
    
    // Add assistant response
    const botResponse = await simulateTypingEffect(nextPrompt);
    const updatedMessages = [...newMessages, { 
      role: 'assistant', 
      content: botResponse,
      timestamp: new Date().toISOString()
    }];
    setMessages(updatedMessages);
    
    await saveToFile(updatedMessages);
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Render minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
        <button 
          onClick={toggleMinimize}
          className="bg-teal-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-teal-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      </div>
    );
  }

  // Render full chat
  return (
    <div 
      ref={resizeRef}
      className="fixed bottom-4 right-4 z-50 shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
      style={{ 
        width: `${chatSize.width}px`,
        height: `${chatSize.height}px`,
      }}
    >
      <Card className="w-full h-full flex flex-col overflow-hidden border border-gray-200 rounded-xl">
        {/* Header - now with position sticky */}
        <CardHeader 
          floated={false}
          shadow={true}
          className="rounded-none px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 z-20 sticky top-0"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 text-white mr-2" />
              <Typography className="font-bold text-white">Theoforge Assistant</Typography>
            </div>
            <div className="flex items-center gap-1">
              <IconButton 
                variant="text" 
                color="white" 
                size="sm" 
                className="h-8 w-8 rounded-full hover:bg-teal-700/50"
                onClick={toggleMinimize}
              >
                <MinusIcon className="h-4 w-4" />
              </IconButton>
              {chatSize.width > 400 ? (
                <IconButton 
                  variant="text" 
                  color="white" 
                  size="sm" 
                  className="h-8 w-8 rounded-full hover:bg-teal-700/50"
                  onClick={() => setChatSize({ width: 380, height: 520 })}
                >
                  <ArrowsPointingInIcon className="h-4 w-4" />
                </IconButton>
              ) : (
                <IconButton 
                  variant="text" 
                  color="white" 
                  size="sm" 
                  className="h-8 w-8 rounded-full hover:bg-teal-700/50"
                  onClick={() => setChatSize({ width: 480, height: 600 })}
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </IconButton>
              )}
              <IconButton 
                variant="text" 
                color="white" 
                size="sm" 
                className="h-8 w-8 rounded-full hover:bg-teal-700/50"
                onClick={onClose}
              >
                <XMarkIcon className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </CardHeader>
        
        {/* Message container - explicitly set to take remaining height with overflow */}
        <CardBody className="flex-grow overflow-y-auto px-4 py-3 h-[calc(100%-110px)]" ref={chatContainerRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <Typography className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </Typography>
                  <Typography variant="small" className={`text-xs mt-1 ${message.role === 'user' ? 'text-teal-50/80' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </Typography>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-xl shadow-sm bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messageEndRef}></div>
          </div>
        </CardBody>
        
        {/* Input area - custom styling to match design */}
        <CardFooter className="px-4 py-3 border-t border-gray-200 bg-white sticky bottom-0 z-20">
          <div className="flex items-center">
            <div className="w-full relative">
              <div className="flex items-center w-full">
                <div className="relative w-full flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your message..."
                    className="w-full px-5 py-3 outline-none text-gray-700 placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-teal-400 hover:bg-teal-500 disabled:opacity-50 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-7 w-8 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
        
        {/* Resize handle - improved positioning and clickable area */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center z-30"
          onMouseDown={handleResizeStart}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 12H12V8H8V12ZM4 12H8V8H4V12ZM0 12H4V8H0V12ZM8 8H12V4H8V8Z" fill="#AAAAAA"/>
          </svg>
        </div>
      </Card>
    </div>
  );
}