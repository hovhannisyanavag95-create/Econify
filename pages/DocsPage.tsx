import React, { useState } from 'react';

type DocSection = 'getting-started' | 'chat-modes' | 'data-sources' | 'faq';

const DocsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<DocSection>('getting-started');

    const renderContent = () => {
        switch (activeSection) {
            case 'getting-started':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Getting Started</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Welcome to the Econify documentation. This guide will help you get the most out of our platform.</p>
                        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
                           <p><strong>1. Ask a Question:</strong> Use the chat input at the bottom of the chat page to ask any macroeconomic question. You can ask for definitions, comparisons, analyses, or forecasts.</p>
                           <p><strong>2. Select a Mode:</strong> Choose the analysis mode that best suits your needs. Each mode uses a different model and approach to give you the right level of detail and speed.</p>
                           <p><strong>3. Upload Data (Optional):</strong> In "Image" mode, you can upload a chart or table as an image file. Econify will analyze the visual data and provide an interpretation.</p>
                           <p><strong>4. Review the Analysis:</strong> Your results will be displayed in a structured format, including a summary, interpretation, risks, and more.</p>
                        </div>
                    </div>
                );
            case 'chat-modes':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chat Modes Explained</h2>
                        <ul className="mt-6 space-y-6 text-gray-700 dark:text-gray-400">
                            <li><strong>Standard:</strong> A balanced mode for general inquiries. Provides comprehensive, structured analysis with good speed.</li>
                            <li><strong>Fast:</strong> Optimized for speed. Ideal for quick definitions or simple data lookups. The analysis is less detailed.</li>
                            <li><strong>Deep Analysis:</strong> Uses our most powerful model for in-depth, nuanced analysis. Best for complex questions, causal interpretation, and scenario modeling. This mode is slower.</li>
                            <li><strong>Search:</strong> Grounds the analysis in real-time information from the web. Perfect for questions about recent events or breaking news. Sources are provided.</li>
                            <li><strong>Image:</strong> Allows you to upload an image of a chart or table for analysis. The AI will interpret the visual data provided.</li>
                        </ul>
                    </div>
                );
             case 'data-sources':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Data Sources</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Econify's AI models are trained on a vast corpus of text and data, including economic papers, reports from international organizations, and financial news. For the most current information, the "Search" mode leverages Google Search to access real-time data. We are committed to providing transparent and reliable analysis.
                        </p>
                    </div>
                );
            case 'faq':
                return (
                     <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                        <div className="mt-6 space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Is the analysis financial advice?</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">No. Econify provides macroeconomic analysis and interpretation for informational and educational purposes only. It is not financial, investment, or trading advice.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">How up-to-date is the data?</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">The base knowledge of the models has a cutoff date. For real-time information, please use the "Search" mode, which incorporates live web search results into its analysis.</p>
                            </div>
                             <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Can I use Econify for my business?</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">Yes! Our Pro and Enterprise plans are designed for professional use, offering advanced features and API access to integrate Econify into your workflows.</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const NavItem: React.FC<{ section: DocSection; children: React.ReactNode }> = ({ section, children }) => (
        <button 
            onClick={() => setActiveSection(section)}
            className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeSection === section ? 'bg-econify-blue/10 text-econify-blue' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Documentation</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Find everything you need to know about using Econify.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-10">
                    <aside className="md:w-1/4">
                        <nav className="space-y-2">
                           <NavItem section="getting-started">Getting Started</NavItem>
                           <NavItem section="chat-modes">Chat Modes</NavItem>
                           <NavItem section="data-sources">Data Sources</NavItem>
                           <NavItem section="faq">FAQ</NavItem>
                        </nav>
                    </aside>
                    <main className="md:w-3/4 bg-white dark:bg-gray-800/30 p-8 rounded-lg">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DocsPage;
