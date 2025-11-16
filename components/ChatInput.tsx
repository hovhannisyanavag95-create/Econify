

import React, { useState, useRef } from 'react';
import { ChatMode } from '../types';
import { SendIcon, SparklesIcon, BoltIcon, BrainIcon, SearchIcon, CameraIcon, CloseIcon, PlusIcon } from './Icons';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  onNewChat: () => void;
}

// Fix: Extracted props to a separate interface for clarity and to resolve potential TypeScript parsing issues with inline types on destructured parameters.
interface ModeButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  tooltip: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ isActive, onClick, children, label, tooltip }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-24 h-20 text-xs font-medium ${
        isActive
          ? 'bg-econify-blue/10 text-econify-blue dark:bg-econify-blue/20'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
      <span className="mt-1">{label}</span>
    </button>
    <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-1/2 left-1/2 z-10">
      {tooltip}
      <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
    </div>
  </div>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, chatMode, setChatMode, uploadedImage, setUploadedImage, onNewChat }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (isLoading || (!text.trim() && !uploadedImage)) return;
    onSend(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      setChatMode('image');
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    if (chatMode === 'image') setChatMode('standard');
  };
  
  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
    if (mode !== 'image') {
        removeImage();
    }
  }


  return (
    <footer className="p-4 bg-white dark:bg-[#0A1A2F] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-2">
            <button
                onClick={onNewChat}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <PlusIcon className="w-4 h-4" />
                New Chat
            </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
            <ModeButton isActive={chatMode === 'standard'} onClick={() => handleModeChange('standard')} label="Standard" tooltip="Balanced mode for general inquiries."><SparklesIcon className="w-6 h-6" /></ModeButton>
            <ModeButton isActive={chatMode === 'fast'} onClick={() => handleModeChange('fast')} label="Fast" tooltip="Optimized for speed and quick answers."><BoltIcon className="w-6 h-6" /></ModeButton>
            <ModeButton isActive={chatMode === 'deep'} onClick={() => handleModeChange('deep')} label="Deep Analysis" tooltip="In-depth analysis for complex questions."><BrainIcon className="w-6 h-6" /></ModeButton>
            {/* Fix: Corrected typo in closing tag from </Mode-Button> to </ModeButton> */}
            <ModeButton isActive={chatMode === 'search'} onClick={() => handleModeChange('search')} label="Search" tooltip="Grounded in real-time web search results."><SearchIcon className="w-6 h-6" /></ModeButton>
            <ModeButton isActive={chatMode === 'image'} onClick={() => fileInputRef.current?.click()} label="Image" tooltip="Analyze data from an uploaded chart or image."><CameraIcon className="w-6 h-6" /></ModeButton>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about inflation, compare GDPs, analyze news..."
            className="w-full p-4 pr-24 pl-14 text-base bg-gray-100 dark:bg-gray-800 rounded-full focus:ring-2 focus:ring-econify-blue focus:outline-none resize-none"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
             {uploadedImage ? (
                <div className="relative">
                    <img src={URL.createObjectURL(uploadedImage)} alt="preview" className="h-9 w-9 object-cover rounded-full"/>
                    <button onClick={removeImage} className="absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5">
                        <CloseIcon className="w-3 h-3" />
                    </button>
                </div>
             ) : (
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-econify-blue">
                    <CameraIcon className="w-6 h-6"/>
                </button>
             )}
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-econify-blue text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;