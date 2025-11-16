import React from 'react';
import { Page, Theme } from '../types';
import { SunIcon, MoonIcon } from './Icons';

interface FooterProps {
    setPage: (page: Page) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isAuthenticated: boolean;
}

const EconifyLogo: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M31 11H13V33" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 22H27" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 33H21C24.1667 33 28.5 31.5 31 27L35 23L31 19" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const FooterLink: React.FC<{ target: Page; setPage: (page: Page) => void; children: React.ReactNode }> = ({ target, setPage, children }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); setPage(target); }} className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
        {children}
    </a>
);

const Footer: React.FC<FooterProps> = ({ setPage, theme, setTheme, isAuthenticated }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <footer className="bg-deep-navy">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8 pb-8 border-b border-gray-500/30">
                     <a href="#" onClick={(e) => {e.preventDefault(); setPage('home')}} className="flex items-center gap-3 text-white">
                        <EconifyLogo />
                        <h1 className="text-xl font-bold tracking-wide">ECONIFY</h1>
                    </a>
                    <div className="flex items-center gap-2 sm:gap-4">
                         <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                            aria-label="Toggle theme"
                        >
                           {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                        {!isAuthenticated && (
                            <>
                                <a href="#" onClick={(e) => {e.preventDefault(); setPage('login')}} className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white">Log In</a>
                                <a href="#" onClick={(e) => {e.preventDefault(); setPage('signup')}} className="px-4 py-1.5 text-sm font-medium text-white bg-econify-blue rounded-full hover:bg-blue-700 transition-colors">Sign Up</a>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10">
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                        <ul className="space-y-3">
                            <li><FooterLink target="chat" setPage={setPage}>AI Analyst</FooterLink></li>
                            <li><FooterLink target="dataviz" setPage={setPage}>Data Viz</FooterLink></li>
                            <li><FooterLink target="api" setPage={setPage}>API Access</FooterLink></li>
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                        <ul className="space-y-3">
                            <li><FooterLink target="pricing" setPage={setPage}>Pricing</FooterLink></li>
                             <li><FooterLink target="docs" setPage={setPage}>Docs</FooterLink></li>
                             <li><FooterLink target="contact" setPage={setPage}>Contact</FooterLink></li>
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="space-y-3">
                             <li><FooterLink target="about" setPage={setPage}>About</FooterLink></li>
                             <li><FooterLink target="blog" setPage={setPage}>Blog</FooterLink></li>
                             <li><FooterLink target="careers" setPage={setPage}>Careers</FooterLink></li>
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                        <ul className="space-y-3">
                            <li><FooterLink target="privacy" setPage={setPage}>Privacy</FooterLink></li>
                            <li><FooterLink target="terms" setPage={setPage}>Terms</FooterLink></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 border-t border-gray-500/30 pt-8 text-center">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Econify, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;