import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton
} from "@material-tailwind/react";
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

export function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstContactTimestamp: new Date().toISOString(),
    conversationHistory: [],
  });
  const [conversationStage, setConversationStage] = useState(0);

  const conversationFlow = [
    {
      message: "Hello! I'm excited to learn about your project. What kind of AI solutions are you interested in exploring?",
      infoKey: 'projectType',
    },
    {
      message: "That's interesting! To help us better understand your needs, could you tell me a bit about your company and industry?",
      infoKey: 'industry',
    },
    {
      message: "Thanks for sharing. What challenges are you currently facing that you're hoping to address with AI?",
      infoKey: 'painPoints',
    },
    {
      message: "I understand. By the way, I didn't catch your name - what should I call you?",
      infoKey: 'name',
    },
    {
      message: "Nice to meet you! Do you have a timeline in mind for implementing these solutions?",
      infoKey: 'timeline',
    },
    {
      message: "Great. What's the best way for our team to reach out to you for a more detailed discussion?",
      infoKey: 'contactInfo',
    },
  ];

  useEffect(() => {
    if (isOpen && !isInitialized) {
      handleAssistantMessage(conversationFlow[0].message);
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isInitialized]);

  const extractInformation = (message: string, stage: number) => {
    const currentFlow = conversationFlow[stage];
    const updatedInfo = { ...userInfo };

    switch (currentFlow.infoKey) {
      case 'projectType':
        updatedInfo.projectType = message.toLowerCase().split(/[,.]/).map(s => s.trim());
        break;
      case 'industry': {
        const companyInfo = message.split(/[,.]/);
        updatedInfo.company = companyInfo[0]?.trim();
        updatedInfo.industry = companyInfo[1]?.trim();
        break;
      }
      case 'painPoints':
        updatedInfo.painPoints = message.toLowerCase().split(/[,.]/).map(s => s.trim());
        break;
      case 'name':
        updatedInfo.name = message.trim();
        break;
      case 'timeline':
        updatedInfo.timeline = message.trim();
        break;
      case 'contactInfo':
        updatedInfo.contactInfo = message.trim();
        break;
    }

    const techKeywords = ['python', 'javascript', 'java', 'aws', 'azure', 'gcp', 'sql', 'nosql', 'tensorflow', 'pytorch'];
    const foundTech = techKeywords.filter(tech => message.toLowerCase().includes(tech));
    if (foundTech.length > 0) {
      updatedInfo.currentTech = [...(updatedInfo.currentTech || []), ...foundTech];
    }

    updatedInfo.conversationHistory = [...messages, { role: 'user', content: message }];
    setUserInfo(updatedInfo);
  };

  const handleAssistantMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  };

  const getNextResponse = () => {
    const nextStage = conversationStage + 1;
    
    if (nextStage < conversationFlow.length) {
      return conversationFlow[nextStage].message;
    }

    if (userInfo.projectType?.includes('training') || userInfo.projectType?.includes('llm')) {
      return "Based on your interest in LLM training, we have extensive experience in customizing language models for specific business needs. Would you like to hear about some similar projects we've worked on?";
    }
    
    if (userInfo.projectType?.includes('etl') || userInfo.projectType?.includes('data')) {
      return "Your data integration needs are right up our alley. We've helped many companies streamline their ETL processes. Would you like to know more about our approach?";
    }

    return "Thank you for sharing all this information! Our team will analyze your needs and reach out soon with a tailored proposal. Is there anything else you'd like to know about our services in the meantime?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    extractInformation(userMessage, conversationStage);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const nextResponse = getNextResponse();
    handleAssistantMessage(nextResponse);

    if (conversationStage < conversationFlow.length) {
      setConversationStage(prev => prev + 1);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <Card className="w-full">
        <CardHeader
          color="teal"
          className="relative h-16"
          shadow={false}
        >
          <div className="flex justify-between items-center h-full px-4">
            <Typography variant="h6" color="white">
              Project Consultation
            </Typography>
            <IconButton
              variant="text"
              color="white"
              size="sm"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </CardHeader>
        <CardBody className="h-[400px] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] p-3 rounded-lg',
                    message.role === 'user'
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <Typography variant="small">
                    {message.content}
                  </Typography>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Typography
                    variant="small"
                    className="text-teal-500 animate-pulse"
                  >
                    Typing...
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </CardBody>
        <CardFooter className="p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell us about your project..."
              className="flex-1"
              labelProps={{
              }}
              containerProps={{
                className: "min-w-0",
              }} crossOrigin={undefined}            />
            <IconButton
              color="teal"
              onClick={handleSend}
              disabled={isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}