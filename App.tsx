import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Page, Theme, User } from './types';
import DataVizPage from './pages/DataVizPage';
import ApiPage from './pages/ApiPage';
import DocsPage from './pages/DocsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [page, setPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPage('home');
  };

  const renderPage = () => {
    const loginPage = <LoginPage setPage={setPage} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
    
    switch (page) {
      case 'chat':
        return isAuthenticated ? <ChatPage /> : loginPage;
      case 'pricing':
        return <PricingPage setPage={setPage} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
      case 'login':
        return loginPage;
      case 'signup':
        return <SignUpPage setPage={setPage} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
      case 'dataviz':
        return isAuthenticated ? <DataVizPage /> : loginPage;
      case 'api':
        return <ApiPage />;
      case 'docs':
        return <DocsPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'careers':
        return <CareersPage setPage={setPage} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'history':
        return isAuthenticated ? <HistoryPage /> : loginPage;
      case 'profile':
        return isAuthenticated && user ? <ProfilePage user={user} setUser={setUser} /> : loginPage;
      case 'home':
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-gray dark:bg-deep-navy text-gray-800 dark:text-gray-200 font-sans">
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        page={page} 
        setPage={setPage} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main role="main" className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      {page !== 'chat' && <Footer setPage={setPage} theme={theme} setTheme={setTheme} isAuthenticated={isAuthenticated} />}
    </div>
  );
};

export default App;