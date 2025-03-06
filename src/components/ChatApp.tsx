'use client';

import React, { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Trash2, Loader2, PlusCircle, Paperclip, Menu, CornerUpLeft } from 'lucide-react';
import { Message, LLMResponse } from '../lib/types';
import { getLLMResponse } from '../services/llm';
import { formatMessageTimestamp } from '../utils/date';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import { Link } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';



const CHAT_LIST_KEY = 'chat_list';

export function Chat(){
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }, 
  ]);  
  {/*const [messages, setMessages] = useState<Message[]>([]); */}
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; messages: Message[] }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedChats = localStorage.getItem(CHAT_LIST_KEY);
        if (savedChats) {
          const parsedChats = JSON.parse(savedChats);
          setChatHistory(parsedChats);
          if (parsedChats.length > 0) {
            setActiveChatId(parsedChats[0].id);
            setMessages(parsedChats[0].messages);
          }
        } else {
          startNewChat();
        }
      } catch (error) {
        console.error('Failed to load chat list:', error);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const appendMessage = useCallback(
    (message: Message) => {
      setMessages(prev => [...prev, message]);

      setChatHistory(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                title: chat.messages.length === 0 && message.sender === 'user' ? summarizeTitle(message.content) : chat.title
              }
            : chat
        )
      );
    },
    [activeChatId]
  );

  const summarizeTitle = (content: string) => {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  const clearHistory = () => {
    setMessages([]);
    setChatHistory([]);
    setActiveChatId(null);
    localStorage.removeItem(CHAT_LIST_KEY);
    startNewChat();
  };

  const startNewChat = () => {
    const newChatId = uuidv4();
    const newChat = { id: newChatId, title: '', messages: [] };
    setChatHistory(prev => [...prev, newChat]);
    setMessages([]);
    setActiveChatId(newChatId);
  }; 

  const openChat = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setActiveChatId(chatId);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        console.log("Selected File:", file); // Debugging log
        setSelectedFile(file);
    }
 };



 const handleSubmit = async (e?: FormEvent) => {
  e?.preventDefault();
  if ((!inputMessage.trim() && !selectedFile) || isLoading || !activeChatId) return;

  const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
  
  console.log("File URL:", fileUrl); // Debugging log

  const userMessage: Message = {
    id: uuidv4(),
    content: inputMessage.trim() || '(File Attachment)',
    sender: 'user',
    timestamp: new Date().toISOString(),
    file: fileUrl, // Ensure file is included
  };

  appendMessage(userMessage);
  setInputMessage('');
  setSelectedFile(null);
  setIsLoading(true);

  try {
    const response: LLMResponse = await getLLMResponse(inputMessage);
    if (!response || !response.message) {
      throw new Error("Invalid response format from LLM API");
    }

    const botMessage: Message = {
      id: uuidv4(),
      content: response.message,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };

    appendMessage(botMessage);
  } catch (error) {
    console.error('Error fetching LLM response:', error);
  } finally {
    setIsLoading(false);
  }
 };


  return (

    <div className="flex h-screen">
      {/*<aside className="w-1/5 min-w-[250px] max-w-[250px] bg-gray-200 p-4 flex flex-col"> */}

      {/* Sidebar with toggle */}
      <motion.aside
        className={`bg-gray-200 p-4 flex flex-col ${isSidebarOpen ? 'w-1/5 min-w-[250px] max-w-[250px]' : 'w-16 items-center'}`} 
        initial={{ width: isSidebarOpen ? 250 : 64 }}
        animate={{ width: isSidebarOpen ? 250 : 64 }}
        transition={{ duration: 0.3 }}
      >
        {/*  //This is the code for the theoforge logo and name to show up on the chatapp sidebar
        <div className="flex items-center">
        <img src="/logo.png" alt="Theoforge Logo" className="mb-4 h-160 w-16" /> 
        {isSidebarOpen && (
          <Typography
            variant="h4"
            className = "ml-2.5 cursor-pointer font-bold"
          >
            TheoForge
          </Typography>
         )}
        </div>
        */} 

        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-4 flex items-center justify-center p-2"
        >
          <Menu className="w-6 h-6" />
          {isSidebarOpen && <span className="ml-2"></span>}
        </Button>

        {/*<Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mb-4 flex items-center gap-2">
          <Menu />
        </Button>*/}

        {isSidebarOpen && (
          <>
        <h2 className="font-bold mb-2">ChatBox</h2>
        <Button onClick={startNewChat} className="mb-4 flex items-center gap-2">
          <PlusCircle /> New Chat
        </Button>
        <h3 className="font-bold mb-2">Previous Chats</h3>
        <ul className="overflow-y-auto flex-grow">
          {chatHistory
            .filter(chat => chat.messages.length > 0)
            .map(chat => (
              <li
                key={chat.id}
                className="mb-2 p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-300"
                onClick={() => openChat(chat.id)}
              >
                {chat.title || 'New Chat'}
              </li>
            ))}
        </ul>
        <Button onClick={clearHistory} className="mt-4 flex items-center gap-2 bg-red-300 hover:bg-red-600 text-white">
          <Trash2 /> Clear History
        </Button>

        <Link to="/Dashboard">
          <Button className="mt-4 flex items-center gap-2 bg-teal-300 hover:bg-teal-600 text-white ">
            <CornerUpLeft /> Back To Dashboard
          </Button>
        </Link>

        </>
        )}
      </motion.aside>
    
      <Card className="flex flex-col flex-grow p-4">
        <div className="flex-grow overflow-y-auto p-4">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                  key={msg.id}
                  className={`p-3 rounded-lg mb-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-xs text-gray-500">{formatMessageTimestamp(msg.timestamp)}</div>
                  <p>{msg.content}</p>

                  {msg.file && (
                    <div className="mt-2">
                      <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                        📎 View Attachment
                      </a>
                    </div>
                  )}
              </motion.div>


            ))}
          </AnimatePresence>
          {isLoading && <Loader2 className="animate-spin mx-auto mt-2" />}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4 relative">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              
              <button
                type="button"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="text-gray-500" />
              </button>

              <Input
                className="pl-10"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || !activeChatId}
              />

              <Button type="submit" disabled={isLoading || (!inputMessage.trim() && !selectedFile) || !activeChatId}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
          </form>

      </Card>
    </div>
  ); 
 


  {/* export default ChatApp */}

} 
