import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { ChartBarIcon, BrainIcon, SearchIcon } from '../components/Icons';

interface HomePageProps {
    setPage: (page: Page) => void;
}

// Helper for rendering markdown in the demo
const DemoMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="text-left text-sm space-y-1">
            {text.split('\n').map((line, i) => {
                if (line.trim() === '') return null;
                if (line.startsWith('**')) {
                     const boldedText = line.replace(/\*\*/g, '');
                     const parts = boldedText.split(/(US PMI shows resilient expansion|Germany's indicates a contraction|US is stable\/growing|Germany is declining|US supported by domestic demand|Germany hit by external pressures|US outlook is cautiously optimistic|German outlook remains challenged)/g);
                     return (
                        <p key={i} className="font-semibold text-gray-900 dark:text-gray-200">
                           {parts.map((part, index) => {
                                if (/(US PMI shows resilient expansion|Germany's indicates a contraction|US is stable\/growing|Germany is declining|US supported by domestic demand|Germany hit by external pressures|US outlook is cautiously optimistic|German outlook remains challenged)/.test(part)) {
                                    return <span key={index} className="font-bold text-econify-blue dark:text-ai-teal">{part}</span>;
                                }
                                return part;
                            })}
                        </p>
                    );
                }
                if (line.trim().startsWith('-')) {
                    return <p key={i} className="pl-4 text-gray-600 dark:text-gray-400">{line}</p>;
                }
                return <p key={i} className="text-gray-700 dark:text-gray-300">{line}</p>;
            })}
        </div>
    );
};


const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
    const [demoUserMessage, setDemoUserMessage] = useState('');
    const [demoModelMessage, setDemoModelMessage] = useState('');
    const [showModelResponse, setShowModelResponse] = useState(false);

    const fullUserMessage = "Compare US and German manufacturing PMIs over the last 12 months and highlight key differences.";
    const fullModelMessage = `**1. Executive Summary**
The US PMI shows resilient expansion, while Germany's indicates a contraction, driven by higher energy costs and weaker export demand.

**2. Key Differences**
- **Trend:** US is stable/growing; Germany is declining.
- **Drivers:** US supported by domestic demand; Germany hit by external pressures.
- **Outlook:** US outlook is cautiously optimistic; German outlook remains challenged.`;
    
    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const userInterval = setInterval(() => {
                setDemoUserMessage(fullUserMessage.substring(0, i + 1));
                i++;
                if (i >= fullUserMessage.length) {
                    clearInterval(userInterval);
                    setTimeout(() => setShowModelResponse(true), 1200);
                }
            }, 30);
             return () => clearInterval(userInterval);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showModelResponse) {
            let j = 0;
            const modelInterval = setInterval(() => {
                const currentText = fullModelMessage.substring(0, j + 1);
                setDemoModelMessage(currentText + (j < fullModelMessage.length -1 ? '▋' : ''));
                j++;
                if (j >= fullModelMessage.length) {
                    clearInterval(modelInterval);
                }
            }, 15);
            return () => clearInterval(modelInterval);
        }
    }, [showModelResponse]);

    const PainPointCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-white dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{children}</p>
        </div>
    );

    const TestimonialCard: React.FC<{ quote: string; name: string; title: string; imageUrl: string }> = ({ quote, name, title, imageUrl }) => (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <p className="text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
            <div className="flex items-center mt-6">
                <img className="h-12 w-12 rounded-full object-cover" src={imageUrl} alt={name} />
                <div className="ml-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                    <p className="text-sm text-econify-blue">{title}</p>
                </div>
            </div>
        </div>
    );
    
    const LogoPlaceholder: React.FC<{ name: string }> = ({ name }) => (
        <div className="text-xl font-bold text-gray-400 dark:text-gray-500 tracking-wider">
            {name}
        </div>
    );


    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <section className="py-20 md:py-28 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Stop Drowning in Data. <br/> Get Instant Economic Clarity.
                    </h1>
                    <p className="text-lg md:text-xl text-medium-gray dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                        Econify is your AI analyst, transforming complex economic data into clear, actionable insights in seconds.
                    </p>
                    
                    {/* Interactive Demo */}
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl p-4 text-left border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg min-h-[180px]">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-econify-blue/20 flex-shrink-0 flex items-center justify-center text-econify-blue text-xs font-bold">U</div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{demoUserMessage}</p>
                            </div>
                            {showModelResponse && (
                                <div className="mt-4 flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-ai-teal/20 flex-shrink-0 flex items-center justify-center">
                                        <BrainIcon className="w-4 h-4 text-ai-teal" />
                                    </div>
                                    <DemoMarkdownRenderer text={demoModelMessage} />
                                </div>
                            )}
                        </div>
                    </div>
                     <button
                        onClick={() => setPage('chat')}
                        className="mt-10 bg-econify-blue text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
                    >
                        Start Your Free Analysis
                    </button>
                </div>
            </section>
            
             {/* Social Proof: Logos */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Trusted by analysts at leading institutions</p>
                    <div className="flex justify-around items-center gap-8 flex-wrap">
                        <LogoPlaceholder name="GLOBALBANK" />
                        <LogoPlaceholder name="INSIGHT CAPITAL" />
                        <LogoPlaceholder name="ECON WEEKLY" />
                        <LogoPlaceholder name="QUANTUM FUND" />
                    </div>
                </div>
            </section>

            {/* Before: The Pain Points */}
            <section className="py-20 bg-gray-50 dark:bg-deep-navy/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Analysis is Slowed by Friction</h2>
                         <p className="mt-4 text-lg text-medium-gray dark:text-gray-400">The traditional research process is broken.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PainPointCard title="😵 Information Overload">
                            Wasting hours sifting through dense reports, conflicting articles, and endless spreadsheets to find a single data point.
                        </PainPointCard>
                         <PainPointCard title="⏳ Time-Wasting Research">
                            Manually compiling data and building narratives takes days, not minutes. By the time you're done, the market has already moved.
                        </PainPointCard>
                         <PainPointCard title="❓ Uncertain Decisions">
                            Making high-stakes calls based on incomplete or outdated information, leading to missed opportunities and unnecessary risk.
                        </PainPointCard>
                    </div>
                </div>
            </section>
            
            {/* After: The Solution */}
             <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Complete Macro Analysis Toolkit</h2>
                         <p className="mt-4 text-lg text-medium-gray dark:text-gray-400">Everything you need to go from data to decision in seconds.</p>
                    </div>
                     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <PainPointCard title="Instant Answers">
                            Get clear summaries of complex topics, from inflation reports to trade policies, instantly.
                        </PainPointCard>
                        <PainPointCard title="Deeper Insights">
                            Our AI connects the dots between indicators, giving you the "so what" behind the numbers.
                        </PainPointCard>
                        <PainPointCard title="Stay Ahead of the Curve">
                            Analyze breaking news with real-time web search to understand market impact as it happens.
                        </PainPointCard>
                    </div>
                </div>
            </section>

            {/* Social Proof: Testimonials */}
            <section className="py-20 bg-gray-50 dark:bg-deep-navy/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Don't Just Take Our Word For It</h2>
                         <p className="mt-4 text-lg text-medium-gray dark:text-gray-400">See how professionals are transforming their workflow.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <TestimonialCard 
                            quote="Econify cut our team's research time by 80%. What used to take a week now takes an afternoon. It's a game-changer for our quarterly reports."
                            name="Sarah Jennings"
                            title="Lead Economist, GlobalBank"
                            imageUrl="https://i.pravatar.cc/150?img=49"
                        />
                        <TestimonialCard 
                            quote="The ability to analyze real-time news with the 'Search' mode is invaluable. We can now react to market-moving events faster than ever before."
                            name="David Chen"
                            title="Portfolio Manager, Insight Capital"
                            imageUrl="https://i.pravatar.cc/150?img=32"
                        />
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20 text-center">
                 <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to See the Full Picture?
                    </h2>
                    <p className="text-lg text-medium-gray dark:text-gray-300 mb-8">
                        Stop guessing. Start analyzing. Get the insights you need to make smarter decisions, today.
                    </p>
                    <button
                        onClick={() => setPage('chat')}
                        className="bg-econify-blue text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
