

import React, { useState } from 'react';
import { Message as MessageType } from '../types';
import { generateSpeech } from '../services/geminiService';
import { SpeakerIcon } from './Icons';
// Fix: Imported decodeAudioData to process raw audio bytes from the service.
import { decodeAudioData } from '../utils/helpers';

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const processInline = (line: string): React.ReactNode => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const elements = [];
    const lines = text.split('\n');
    let listItems: string[] = [];

    const flushList = (key: string) => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={key} className="list-disc list-inside space-y-1 my-2">
                    {listItems.map((item, itemIndex) => (
                        <li key={itemIndex}>{processInline(item.trim().substring(2))}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, i) => {
        const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');

        if (isListItem) {
            listItems.push(line);
        } else {
            flushList(`ul-${i}`);
            if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-2">{processInline(line.substring(4))}</h3>);
            } else if (line.trim() !== '') {
                elements.push(<p key={i} className="my-1">{processInline(line)}</p>);
            }
        }
    });

    flushList('ul-end');
    
    // Handle the streaming cursor
    if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];
        if (lastElement && lastElement.props && typeof lastElement.props.children === 'string' && lastElement.props.children.endsWith('▋')) {
             const textContent = lastElement.props.children.slice(0, -1);
             const newChildren = <>{textContent}<span className="inline-block animate-pulse">▋</span></>;
             elements[elements.length - 1] = React.cloneElement(lastElement, { ...lastElement.props, children: newChildren });
        }
    } else if (text === '▋') {
        return <p className="my-1"><span className="inline-block animate-pulse">▋</span></p>;
    }


    return <>{elements}</>;
};

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, text, image, sources } = message;
  const isModel = role === 'model';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);

  const handlePlayAudio = async () => {
    if (isSpeaking && audioSource) {
      audioSource.stop();
      setIsSpeaking(false);
      setAudioSource(null);
      return;
    }

    setIsSpeaking(true);
    try {
      // Fix: Reworked audio playback logic to handle raw Uint8Array from the service.
      const audioBytes = await generateSpeech(text);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        setIsSpeaking(false);
        setAudioSource(null);
      };
      source.start(0);
      setAudioSource(source);
    } catch (error) {
      console.error("Error generating or playing speech:", error);
      setIsSpeaking(false);
    }
  };

  const modelIcon = (
    <div className="w-10 h-10 rounded-full bg-ai-teal/20 flex-shrink-0 flex items-center justify-center">
      <div className="w-5 h-5 text-ai-teal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.543L16.5 21.75l-.398-1.207a3.375 3.375 0 00-2.455-2.456L12.75 18l1.207-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.207a3.375 3.375 0 002.456 2.456L20.25 18l-1.207.398a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      </div>
    </div>
  );

  const userIcon = (
    <div className="w-10 h-10 rounded-full bg-econify-blue/20 flex-shrink-0 flex items-center justify-center">
      <div className="w-5 h-5 text-econify-blue">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
    </div>
  );
  
  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      {isModel ? modelIcon : userIcon}
      <div className={`w-full ${isModel ? '' : 'text-right'}`}>
        <div className={`inline-block p-4 rounded-lg shadow-sm ${isModel ? 'bg-white dark:bg-gray-800' : 'bg-econify-blue text-white'}`}>
            {image && <img src={image} alt="User upload" className="max-w-xs rounded-lg mb-2" />}
            <div className="text-left">
                {isModel ? <MarkdownRenderer text={text} /> : <p className="whitespace-pre-wrap">{text}</p>}
            </div>
        </div>
        {isModel && (
            <div className="mt-2 flex items-center gap-2">
            <button onClick={handlePlayAudio} className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${isSpeaking ? 'text-econify-blue' : 'text-gray-500'}`}>
                <SpeakerIcon className="w-5 h-5" />
            </button>
            </div>
        )}
        {sources && sources.length > 0 && (
            <div className="mt-4 text-left">
                <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Sources:</h4>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-econify-blue hover:underline">
                                {source.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default Message;