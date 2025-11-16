import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, UserIcon, UserCircleIcon, ArrowLeftStartOnRectangleIcon, Bars3Icon, ChevronDownIcon, CloseIcon } from './Icons';
import { Theme, Page } from '../types';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  page: Page;
  setPage: (page: Page) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const EconifyLogo: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="logo-arrow-gradient" x1="17" y1="33" x2="35" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2D6CF6"/>
            <stop offset="1" stopColor="#1EC8C8"/>
        </linearGradient>
    </defs>
    <path d="M31 11H13V33" stroke="#2D6CF6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 22H27" stroke="#2D6CF6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 33H21C24.1667 33 28.5 31.5 31 27L35 23L31 19" stroke="url(#logo-arrow-gradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const NavLink: React.FC<{ page: Page; setPage: (page: Page) => void; target: Page; children: React.ReactNode }> = ({ page, setPage, target, children }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); setPage(target); }}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            page === target
            ? 'text-econify-blue dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
    >
        {children}
    </a>
);

const DropdownNavLink: React.FC<{ setPage: (page: Page) => void; target: Page; children: React.ReactNode; onClick: () => void }> = ({ setPage, target, children, onClick }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); setPage(target); onClick(); }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
        {children}
    </a>
);


const Dropdown: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { onClick: () => setIsOpen(false) } as any);
        }
        return child;
    });

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div 
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                    style={{ animation: 'fade-in-up 0.2s ease-out' }}
                >
                    {childrenWithProps}
                </div>
            )}
        </div>
    );
};

const MobileNavLink: React.FC<{ setPage: (page: Page) => void; target: Page; children: React.ReactNode; closeMenu: () => void; }> = ({ setPage, target, children, closeMenu }) => (
    <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            setPage(target);
            closeMenu();
        }}
        className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
    >
        {children}
    </a>
);


const Header: React.FC<HeaderProps> = ({ theme, setTheme, page, setPage, isAuthenticated, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto' };
  }, [mobileMenuOpen]);

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    onLogout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-deep-navy/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
           <a href="#" onClick={(e) => {e.preventDefault(); setPage('home')}} className="flex items-center gap-3 text-econify-blue dark:text-white">
              <EconifyLogo />
              <h1 className="text-xl font-bold tracking-wide hidden sm:block">ECONIFY</h1>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-2">
            <Dropdown title="Solutions">
                <DropdownNavLink setPage={setPage} target="chat" onClick={() => {}}>AI Analyst</DropdownNavLink>
                <DropdownNavLink setPage={setPage} target="dataviz" onClick={() => {}}>Data Viz</DropdownNavLink>
                {isAuthenticated && <DropdownNavLink setPage={setPage} target="history" onClick={() => {}}>History</DropdownNavLink>}
                <DropdownNavLink setPage={setPage} target="api" onClick={() => {}}>Developer API</DropdownNavLink>
            </Dropdown>
            <NavLink page={page} setPage={setPage} target="pricing">Pricing</NavLink>
            <Dropdown title="Resources">
                <DropdownNavLink setPage={setPage} target="docs" onClick={() => {}}>Docs</DropdownNavLink>
                <DropdownNavLink setPage={setPage} target="blog" onClick={() => {}}>Blog</DropdownNavLink>
            </Dropdown>
            <Dropdown title="Company">
                <DropdownNavLink setPage={setPage} target="about" onClick={() => {}}>About Us</DropdownNavLink>
                <DropdownNavLink setPage={setPage} target="careers" onClick={() => {}}>Careers</DropdownNavLink>
                <DropdownNavLink setPage={setPage} target="contact" onClick={() => {}}>Contact</DropdownNavLink>
            </Dropdown>
            <NavLink page={page} setPage={setPage} target="chat">Chat</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-econify-blue"
              aria-label="Toggle theme"
          >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
          {isAuthenticated ? (
               <div className="relative" ref={profileDropdownRef}>
                  <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-deep-navy focus:ring-econify-blue"
                  >
                      <UserIcon className="w-5 h-5" />
                  </button>
                  {profileDropdownOpen && (
                      <div 
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                          style={{ animation: 'fade-in-up 0.2s ease-out' }}
                      >
                          <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); setPage('profile'); setProfileDropdownOpen(false); }}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                              <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                              My Profile
                          </a>
                          <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); handleLogoutClick(); }}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
                              Log Out
                          </a>
                      </div>
                  )}
              </div>
          ) : (
              <>
                  <a href="#" onClick={(e) => {e.preventDefault(); setPage('login')}} className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-econify-blue dark:hover:text-white">Log In</a>
                  <a href="#" onClick={(e) => {e.preventDefault(); setPage('signup')}} className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-white bg-econify-blue rounded-full hover:bg-blue-700 transition-colors">Sign Up</a>
              </>
          )}
           <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-econify-blue"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
           </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-light-gray dark:bg-deep-navy animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
             <a href="#" onClick={(e) => {e.preventDefault(); setPage('home'); setMobileMenuOpen(false);}} className="flex items-center gap-3 text-econify-blue dark:text-white">
                <EconifyLogo />
                <h1 className="text-xl font-bold tracking-wide">ECONIFY</h1>
            </a>
            <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close menu"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Solutions</h3>
            <MobileNavLink setPage={setPage} target="chat" closeMenu={() => setMobileMenuOpen(false)}>AI Analyst</MobileNavLink>
            <MobileNavLink setPage={setPage} target="dataviz" closeMenu={() => setMobileMenuOpen(false)}>Data Viz</MobileNavLink>
            {isAuthenticated && <MobileNavLink setPage={setPage} target="history" closeMenu={() => setMobileMenuOpen(false)}>History</MobileNavLink>}
            <MobileNavLink setPage={setPage} target="api" closeMenu={() => setMobileMenuOpen(false)}>Developer API</MobileNavLink>

            <h3 className="px-4 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <MobileNavLink setPage={setPage} target="about" closeMenu={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
            <MobileNavLink setPage={setPage} target="careers" closeMenu={() => setMobileMenuOpen(false)}>Careers</MobileNavLink>
            <MobileNavLink setPage={setPage} target="contact" closeMenu={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
            
            <h3 className="px-4 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
            <MobileNavLink setPage={setPage} target="pricing" closeMenu={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink setPage={setPage} target="docs" closeMenu={() => setMobileMenuOpen(false)}>Docs</MobileNavLink>
            <MobileNavLink setPage={setPage} target="blog" closeMenu={() => setMobileMenuOpen(false)}>Blog</MobileNavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;