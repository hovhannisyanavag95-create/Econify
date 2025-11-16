import React, { useState, useCallback, useRef, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { Message, ChatMode } from '../types';
import { generateResponseStream } from '../services/geminiService';
import { fileToGenerativePart } from '../utils/helpers';

const StarterPrompts: React.FC<{ onPromptClick: (prompt: string) => void; isLoading: boolean }> = ({ onPromptClick, isLoading }) => {
    const prompts = [
        "Explain the concept of stagflation.",
        "Compare the GDP of Japan and Germany for the last 5 years.",
        "What are the risks of a trade war between the US and China?",
        "Summarize the latest US jobs report and its implications.",
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompts.map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => onPromptClick(prompt)}
                        disabled={isLoading}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <p className="font-medium text-gray-800 dark:text-gray-200">{prompt}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};


const ChatPage: React.FC = () => {
  const initialMessage: Message = {
      id: '1',
      role: 'model',
      text: "Hello! 👋 I'm your AI Macroeconomic Analyst. Ask me to explain indicators, compare countries, or analyze market news. How can I help you today?",
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  // Fix: Explicitly type the ref to hold a number or undefined.
  // Fix: Initialize useRef with undefined to create a mutable ref object.
  const animationFrameId = useRef<number | undefined>(undefined);

  const handleNewChat = useCallback(() => {
    if (isLoading) return;
    setMessages([initialMessage]);
  }, [isLoading]);

  const handleSend = useCallback(async (inputText: string) => {
    if ((!inputText.trim() && !uploadedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: uploadedImage ? URL.createObjectURL(uploadedImage) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let imagePart = null;
    if (uploadedImage && chatMode === 'image') {
        try {
            imagePart = await fileToGenerativePart(uploadedImage);
        } catch (error) {
            console.error("Error converting file:", error);
            const errorMessage: Message = {
                id: Date.now().toString() + '-error',
                role: 'model',
                text: 'Sorry, there was an error processing the image. Please try another one.',
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            setUploadedImage(null);
            return;
        }
    }

    setUploadedImage(null);
    
    const modelMessageId = Date.now().toString() + '-ai';
    setMessages((prev) => [...prev, {
      id: modelMessageId,
      role: 'model',
      text: '▋',
      sources: []
    }]);

    try {
        const history = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        let fullText = '';
        let sources: any[] | undefined = undefined;
        const stream = generateResponseStream(inputText, history, chatMode, imagePart);
        
        const updateState = () => {
            setMessages(prev => prev.map(msg => {
                if (msg.id === modelMessageId) {
                    const newMsg = { ...msg, text: fullText + '▋' };
                    if (sources) {
                        newMsg.sources = sources;
                    }
                    return newMsg;
                }
                return msg;
            }));
            animationFrameId.current = undefined;
        };

        for await (const chunk of stream) {
            if (chunk.text) {
                fullText += chunk.text;
                if (!animationFrameId.current) {
                    animationFrameId.current = requestAnimationFrame(updateState);
                }
            }
            if (chunk.sources) {
                sources = chunk.sources;
                 if (!animationFrameId.current) {
                    animationFrameId.current = requestAnimationFrame(updateState);
                }
            }
        }
      
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = undefined;
        }

        // Final update to remove the typing cursor
        setMessages(prev => prev.map(msg => {
             if (msg.id === modelMessageId) {
                const finalMsg = { ...msg, text: fullText };
                if (sources) {
                    finalMsg.sources = sources;
                }
                return finalMsg;
            }
            return msg;
        }));

    } catch (error) {
        console.error('Error fetching response from Gemini:', error);
        const errorMessage: Message = {
            id: Date.now().toString() + '-error',
            role: 'model',
            text: 'An error occurred while fetching the response. Please check your connection or API key and try again.',
        };
        setMessages(prev => [...prev.filter(m => m.id !== modelMessageId), errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [uploadedImage, chatMode, messages, isLoading]);
  
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto">
        <ChatWindow messages={messages} isLoading={isLoading && messages.length > 0 && messages[messages.length -1].role === 'user'} />
        {messages.length <= 1 && !isLoading && <StarterPrompts onPromptClick={handleSend} isLoading={isLoading} />}
      </div>
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        chatMode={chatMode}
        setChatMode={setChatMode}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default ChatPage;