
import React, { useState, useEffect, useRef } from 'react';
import { AppView, User, Post, Product, Job, Rental, Message, Notification, SocialComment } from './types';
import { CURRENT_USER, MOCK_POSTS, MOCK_PRODUCTS, MOCK_JOBS, MOCK_RENTALS } from './constants';
import { getOmniAssistantResponse, AssistantResponse } from './services/geminiService';

// --- Icons (Simple SVG Components) ---
const Icon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const icons: Record<string, React.ReactElement> = {
    dashboard: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    social: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    messenger: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    marketplace: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    jobs: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    rentals: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    ride: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    profile: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    search: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    star: <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    location: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    back: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    ai: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    points: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    pay: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    link: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    forward: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    report: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    check: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
    bell: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    calendar: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    clock: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    shield: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    image: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    video: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    link_alt: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    live: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /><circle cx="9" cy="12" r="2" fill="currentColor" /></svg>,
  };
  const icon = (icons[name] || icons['dashboard']) as React.ReactElement<any>;
  return React.cloneElement(icon, { className: className || icon.props.className });
};

// --- Constants ---
const AD_RATES = [
  { id: 'normal', label: 'Normal Post', price: 0, reach: 'Friends list only', duration: 'Permanent' },
  { id: 'basic', label: 'Basic Boost', price: 50, reach: '1,000 users', duration: '24 Hours' },
  { id: 'pro', label: 'Premium Reach', price: 150, reach: '5,000 users', duration: '3 Days' },
  { id: 'elite', label: 'Elite Viral', price: 500, reach: '20,000 users', duration: '7 Days' },
];

// --- Localization Utils ---
const getConversionRate = () => {
  const locale = navigator.language;
  if (locale.includes('US')) return { code: 'USD', symbol: '$', rate: 0.018 };
  if (locale.includes('SG')) return { code: 'SGD', symbol: 'S$', rate: 0.024 }; 
  return { code: 'PHP', symbol: '₱', rate: 1.0 };
};

// --- Components ---

const Header: React.FC<{ 
  title: string; 
  avatar: string; 
  showBack?: boolean; 
  onBack?: () => void; 
  notifications?: Notification[];
  onOpenNotifications?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}> = ({ title, avatar, showBack, onBack, notifications = [], onOpenNotifications, searchQuery, onSearchChange }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [isSearching, setIsSearching] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between transition-all">
      <div className={`flex items-center gap-3 ${isSearching ? 'hidden' : 'flex'}`}>
        {showBack && (
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <Icon name="back" className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-black text-blue-600 tracking-tight">{title}</h1>
      </div>

      <div className={`flex-1 mx-4 transition-all duration-300 ${isSearching ? 'block' : 'hidden md:block'}`}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon name="search" className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search OmniSphere..." 
            className="w-full bg-gray-100 border-none rounded-2xl py-2 pl-10 pr-10 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => !searchQuery && setIsSearching(false)}
          />
          {searchQuery && (
            <button 
              onClick={() => { onSearchChange(''); setIsSearching(false); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-3 ${isSearching && !searchQuery ? 'flex' : (isSearching ? 'hidden' : 'flex')}`}>
        {!isSearching && (
          <button onClick={() => setIsSearching(true)} className="md:hidden text-gray-400 hover:text-gray-600">
            <Icon name="search" className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={onOpenNotifications} 
          className="relative bg-green-50 text-green-600 p-2 rounded-2xl border border-green-100 shadow-sm active:scale-90 transition-transform"
        >
          <Icon name="bell" className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
              {unreadCount}
            </span>
          )}
        </button>
        <img src={avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="Profile" />
      </div>
    </header>
  );
};

const BottomNav: React.FC<{ activeView: AppView; onViewChange: (view: AppView) => void }> = ({ activeView, onViewChange }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: 'dashboard', label: 'Home' },
    { view: AppView.SOCIAL, icon: 'social', label: 'Social' },
    { view: AppView.MESSENGER, icon: 'messenger', label: 'Chats' },
    { view: AppView.PROFILE, icon: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center py-3 px-6 z-[100] rounded-t-[32px] shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = activeView === item.view || (activeView === AppView.POINTS && item.view === AppView.PROFILE);
        return (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`flex flex-col items-center gap-1 group transition-all ${isActive ? 'scale-110' : 'opacity-50'}`}
          >
            <div className={`p-2 rounded-2xl ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600'}`}>
              <Icon name={item.icon} className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const LoginView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-white to-gray-50 animate-in fade-in duration-1000">
      <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-200 mb-8 animate-bounce">
        <Icon name="dashboard" className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-black text-blue-600 tracking-tighter mb-2">OmniSphere</h1>
      <p className="text-gray-500 font-medium mb-12 text-center max-w-[240px]">The everything app for your digital lifestyle.</p>
      
      <button 
        onClick={onLogin}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 px-6 rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-gray-700 font-bold">Login with Google</span>
      </button>
      
      <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by OmniSphere ID</p>
    </div>
  );
};

const OmniAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ text: string; isBot: boolean; links?: { title: string; uri: string }[] }[]>([
    { text: "Kumusta! I'm Omni, your personal assistant. How can I help you in OmniSphere today? (I can now search for places using Google Maps!)", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.debug("Geolocation disabled or blocked", err)
      );
    }
  }, [isOpen, userLocation]);

  const handleSend = async () => {
    if (!query.trim() || isTyping) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setIsTyping(true);

    try {
      const response: AssistantResponse = await getOmniAssistantResponse(userMsg, userLocation);
      setMessages(prev => [...prev, { text: response.text, isBot: true, links: response.groundingLinks }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Pasensya na, I encountered an error. Please try again later!", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-28 right-6 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl z-[150] flex items-center justify-center active:scale-90 transition-all ${isOpen ? 'rotate-90 bg-gray-800' : 'hover:scale-105'}`}
      >
        {isOpen ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <Icon name="ai" className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-44 right-6 left-6 max-w-sm ml-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[150] overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom duration-300">
          <div className="bg-blue-600 p-6 text-white">
            <h4 className="font-black text-xl flex items-center gap-2">
              <Icon name="ai" className="w-6 h-6" />
              OmniAssistant
            </h4>
            <p className="text-xs opacity-80 font-medium">Your PH Super App AI Guide with Maps</p>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.isBot ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.isBot ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none shadow-md'}`}>
                  {m.text}
                  {m.links && (
                    <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                        <Icon name="location" className="w-3 h-3" /> Grounded Places
                      </p>
                      {m.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Icon name="link" className="w-3 h-3" />
                          <span className="truncate">{link.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-gray-200 w-12 h-6 rounded-full flex items-center justify-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask for places, info, etc..." 
              className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Views ---

const PointsView: React.FC<{ points: number; onWithdraw: () => void }> = ({ points, onWithdraw }) => {
  const conv = getConversionRate();
  const convertedValue = (points * conv.rate).toFixed(2);

  return (
    <div className="p-4 pb-24 flex flex-col gap-6 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[32px] p-8 text-white shadow-xl flex flex-col items-center text-center">
        <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-md">
          <Icon name="points" className="w-12 h-12" />
        </div>
        <h2 className="text-sm font-medium opacity-90 uppercase tracking-widest">Available Points</h2>
        <span className="text-5xl font-black mt-2">{Math.floor(points).toLocaleString()}</span>
        <p className="text-xs opacity-80 mt-4 max-w-[200px]">Points earned from viewing your social feed.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          <Icon name="dashboard" className="w-5 h-5 text-amber-500" />
          Redeem Value
        </h3>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Estimated Worth ({conv.code})</span>
            <span className="text-2xl font-black text-gray-800">{conv.symbol}{convertedValue}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Rate</span>
            <p className="text-xs font-bold text-gray-600">1 pt = ₱1.00</p>
          </div>
        </div>
        <button 
          onClick={onWithdraw}
          disabled={points < 1}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform disabled:bg-gray-200 disabled:shadow-none"
        >
          Withdraw to OmniWallet
        </button>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ 
  onViewChange: (view: AppView) => void; 
  products: Product[]; 
  balance: number; 
  is2FAEnabled: boolean;
  searchQuery: string;
  onSearchSelect: (view: AppView) => void;
}> = ({ onViewChange, products, balance, is2FAEnabled, searchQuery, onSearchSelect }) => {
  const services = [
    { view: AppView.MARKETPLACE, icon: 'marketplace', label: 'Shop', color: 'bg-orange-100 text-orange-700' },
    { view: AppView.JOBS, icon: 'jobs', label: 'Jobs', color: 'bg-indigo-100 text-indigo-700' },
    { view: AppView.RENTALS, icon: 'rentals', label: 'Stay', color: 'bg-rose-100 text-rose-700' },
    { view: AppView.POINTS, icon: 'points', label: 'Points', color: 'bg-amber-100 text-amber-700' },
    { view: AppView.SOCIAL, icon: 'social', label: 'Feed', color: 'bg-blue-100 text-blue-700' },
    { view: AppView.MESSENGER, icon: 'messenger', label: 'Chats', color: 'bg-teal-100 text-teal-700' },
  ];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(q));
    const filteredJobs = MOCK_JOBS.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
    const filteredRentals = MOCK_RENTALS.filter(r => r.title.toLowerCase().includes(q));
    const filteredUsers = MOCK_POSTS.filter(p => p.user.name.toLowerCase().includes(q)).map(p => p.user);

    return (
      <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-300">
        <h2 className="text-xl font-black text-gray-800">Global Search Results</h2>
        
        {filteredUsers.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-blue-600 uppercase mb-3">People</h3>
            <div className="space-y-2">
              {filteredUsers.map(u => (
                <button key={u.id} onClick={() => onSearchSelect(AppView.SOCIAL)} className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <img src={u.avatar} className="w-10 h-10 rounded-full" />
                  <span className="font-bold text-sm">{u.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-orange-600 uppercase mb-3">Shop</h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => onSearchSelect(AppView.MARKETPLACE)} className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <img src={p.image} className="w-full aspect-square object-cover" />
                  <span className="p-2 text-[10px] font-bold text-gray-800 line-clamp-1">{p.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {filteredJobs.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-indigo-600 uppercase mb-3">Jobs</h3>
            <div className="space-y-2">
              {filteredJobs.map(j => (
                <button key={j.id} onClick={() => onSearchSelect(AppView.JOBS)} className="w-full text-left p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <img src={j.logo} className="w-10 h-10 rounded-xl" />
                  <div><p className="text-xs font-black">{j.title}</p><p className="text-[10px] text-gray-500">{j.company}</p></div>
                </button>
              ))}
            </div>
          </section>
        )}

        {filteredRentals.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-rose-600 uppercase mb-3">Stay</h3>
            <div className="space-y-2">
              {filteredRentals.map(r => (
                <button key={r.id} onClick={() => onSearchSelect(AppView.RENTALS)} className="w-full text-left p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <img src={r.image} className="w-16 h-10 rounded-lg object-cover" />
                  <p className="text-xs font-black">{r.title}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {![filteredUsers, filteredProducts, filteredJobs, filteredRentals].some(a => a.length > 0) && (
          <div className="py-20 text-center text-gray-400">
            <Icon name="search" className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-bold text-sm italic">No items found across OmniSphere</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 animate-in fade-in duration-500">
      {!is2FAEnabled && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Icon name="shield" className="w-8 h-8 opacity-90" />
            <div>
              <p className="text-sm font-bold">Secure your account</p>
              <p className="text-[10px] opacity-80">Enable 2FA to protect your transactions.</p>
            </div>
          </div>
          <button 
            onClick={() => onViewChange(AppView.PROFILE)}
            className="bg-white text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm"
          >
            Set Up Now
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-sm font-medium opacity-90 mb-1">OmniWallet Balance</h2>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-3xl font-bold">₱{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span className="text-sm mb-1 opacity-80">PHP</span>
        </div>
        <div className="flex gap-4">
          <button className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors">Cash In</button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors">Transfer</button>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Local Services</h3>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer">View All</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {services.map((s) => (
            <button key={s.label} onClick={() => onViewChange(s.view)} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon name={s.icon} className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-semibold text-gray-600">{s.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const SocialView: React.FC<{ 
  avatar: string; 
  onPostView: () => void; 
  searchQuery: string;
  posts: Post[];
  userLikes: Set<string>;
  userReports: Set<string>;
  postComments: Record<string, SocialComment[]>;
  onLike: (id: string) => void;
  onReport: (id: string) => void;
  onComment: (id: string, text: string, parentId?: string) => void;
  onAddPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>, cost: number) => void;
  balance: number;
}> = ({ avatar, onPostView, searchQuery, posts, userLikes, userReports, postComments, onLike, onReport, onComment, onAddPost, balance }) => {
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; name: string } | null>(null);
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video' | 'link' | 'live'>('none');
  const [selectedRateId, setSelectedRateId] = useState(AD_RATES[0].id);
  const [commentsVisibleCount, setCommentsVisibleCount] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(onPostView, 2000);
    return () => clearTimeout(timer);
  }, [onPostView]);

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery || p.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onComment(postId, commentInput, replyingTo?.commentId);
    setCommentInput('');
    setReplyingTo(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaType('image');
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    const rate = AD_RATES.find(r => r.id === selectedRateId)!;
    if (balance < rate.price) {
      alert("Insufficient OmniWallet balance to post this Ad.");
      return;
    }
    
    if (!postContent.trim() && mediaType === 'none') return;
    
    let linkThumbnail = '';
    if (mediaType === 'link' && mediaUrl) {
      linkThumbnail = `https://picsum.photos/seed/${Date.now()}/600/400`;
    }

    onAddPost({
      user: CURRENT_USER,
      content: postContent,
      image: mediaType === 'image' ? mediaUrl : undefined,
      video: mediaType === 'video' ? mediaUrl : undefined,
      link: mediaType === 'link' ? mediaUrl : undefined,
      linkThumbnail,
      isAd: rate.id !== 'normal'
    }, rate.price);

    setPostContent('');
    setMediaUrl('');
    setMediaType('none');
    setIsPostingModalOpen(false);
  };

  const renderComment = (cmt: SocialComment, postId: string, depth = 0) => (
    <div key={cmt.id} className={`flex flex-col gap-1 ${depth > 0 ? 'ml-8 mt-2 border-l-2 border-gray-100 pl-4' : 'mb-4'}`}>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-blue-600">
          {cmt.senderName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block max-w-full">
            <p className="text-[11px] font-black text-gray-800">{cmt.senderName}</p>
            <p className="text-xs text-gray-600 break-words leading-relaxed">{cmt.text}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-1">
            <button 
              onClick={() => setReplyingTo({ commentId: cmt.id, name: cmt.senderName })}
              className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-tighter"
            >
              Reply
            </button>
            <span className="text-[10px] font-medium text-gray-300">Just now</span>
          </div>
        </div>
      </div>
      {cmt.replies && cmt.replies.map(reply => renderComment(reply, postId, depth + 1))}
    </div>
  );

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <div className="bg-white p-4 mb-2 border-b border-gray-100">
        <div className="flex gap-3 mb-4">
          <img src={avatar} className="w-10 h-10 rounded-full border" />
          <button 
            onClick={() => { setMediaType('none'); setIsPostingModalOpen(true); }}
            className="flex-1 bg-gray-50 text-left px-4 rounded-full text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            What's on your mind?
          </button>
        </div>
        <div className="flex justify-around border-t border-gray-50 pt-2">
          <button onClick={() => { setMediaType('image'); setIsPostingModalOpen(true); }} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 p-2">
            <Icon name="image" className="w-5 h-5 text-green-500" /> Photo
          </button>
          <button onClick={() => { setMediaType('video'); setIsPostingModalOpen(true); }} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 p-2">
            <Icon name="video" className="w-5 h-5 text-red-500" /> Video
          </button>
          <button onClick={() => { setMediaType('link'); setIsPostingModalOpen(true); }} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 p-2">
            <Icon name="link_alt" className="w-5 h-5 text-blue-500" /> Link
          </button>
          <button onClick={() => { setMediaType('live'); setIsPostingModalOpen(true); }} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 p-2">
            <Icon name="live" className="w-5 h-5 text-red-600" /> Live
          </button>
        </div>
      </div>

      {isPostingModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPostingModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-gray-800">Create {selectedRateId === 'normal' ? 'Post' : 'Sponsored Ad'}</h3>
              <button onClick={() => setIsPostingModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icon name="back" className="w-5 h-5 rotate-180" />
              </button>
            </div>
            
            <textarea 
              autoFocus
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={mediaType === 'live' ? "Describe your live stream..." : "What's happening?"}
              className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-blue-100 min-h-[100px] resize-none mb-4"
            />
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Icon name="link_alt" className="w-4 h-4" /> Media Details
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button onClick={() => { setMediaType('image'); setMediaUrl(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-bold border shrink-0 ${mediaType === 'image' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>Image</button>
                  <button onClick={() => { setMediaType('video'); setMediaUrl(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-bold border shrink-0 ${mediaType === 'video' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>Video</button>
                  <button onClick={() => { setMediaType('link'); setMediaUrl(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-bold border shrink-0 ${mediaType === 'link' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>Link</button>
                  <button onClick={() => { setMediaType('live'); setMediaUrl(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-bold border shrink-0 ${mediaType === 'live' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>Live</button>
                </div>
                
                {(mediaType === 'image' || mediaType === 'video') && (
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      accept={mediaType === 'image' ? "image/*" : "video/*"}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      {mediaUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <Icon name="check" className="w-8 h-8 text-green-500" />
                          <span className="text-[10px] font-black text-green-600 uppercase">File Selected</span>
                        </div>
                      ) : (
                        <>
                          <Icon name={mediaType === 'image' ? 'image' : 'video'} className="w-8 h-8 text-gray-300" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload {mediaType}</span>
                        </>
                      )}
                    </button>
                    {mediaUrl && (
                       <button onClick={() => setMediaUrl('')} className="w-full text-[10px] text-red-500 font-bold uppercase text-center underline">Remove Upload</button>
                    )}
                  </div>
                )}

                {mediaType === 'link' && (
                  <input 
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Enter link URL..."
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-xs border border-gray-100 outline-none focus:ring-1 ring-blue-100"
                  />
                )}

                {mediaType === 'live' && (
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-red-700 uppercase">Camera and mic will be activated on start</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Icon name="pay" className="w-4 h-4" /> Visibility Tier
              </div>
              <div className="grid grid-cols-1 gap-2">
                {AD_RATES.map((rate) => (
                  <button 
                    key={rate.id}
                    onClick={() => setSelectedRateId(rate.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${selectedRateId === rate.id ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-100'}`}
                  >
                    <div className="text-left">
                      <p className={`text-xs font-black ${selectedRateId === rate.id ? 'text-blue-600' : 'text-gray-800'}`}>{rate.label}</p>
                      <p className="text-[10px] text-gray-500">{rate.reach} • {rate.duration}</p>
                    </div>
                    <span className="text-xs font-black text-gray-800">{rate.price === 0 ? 'FREE' : `₱${rate.price}`}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <button 
                  onClick={handlePostSubmit} 
                  className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-transform"
               >
                 {mediaType === 'live' ? 'Start Live Now' : (selectedRateId === 'normal' ? 'Post to Feed' : 'Pay & Post Ad')}
               </button>
               <p className="text-[10px] text-center text-gray-400 font-bold">Balance: ₱{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filteredPosts.map((post) => {
          const allComments = postComments[post.id] || [];
          const visibleLimit = commentsVisibleCount[post.id] || 10;
          const paginatedComments = allComments.slice(0, visibleLimit);
          const hasMore = allComments.length > visibleLimit;

          return (
            <div key={post.id} className="bg-white border-y border-gray-100 p-4 relative">
              {post.isAd && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg">
                  <Icon name="points" className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Sponsored</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <img src={post.user.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h5 className="font-bold text-sm text-gray-800">{post.user.name}</h5>
                  <span className="text-[11px] text-gray-500">{post.timestamp}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>
              
              {post.image && <img src={post.image} className="w-full rounded-2xl mb-4 border border-gray-100 object-cover" />}
              
              {post.video && (
                <div className="w-full aspect-video bg-black rounded-2xl mb-4 flex items-center justify-center text-white overflow-hidden relative group">
                  {post.video.startsWith('data:') ? (
                    <video src={post.video} controls className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <>
                      <Icon name="video" className="w-12 h-12 opacity-50" />
                      <div className="absolute bottom-4 left-4 right-4 text-[10px] bg-black/40 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {post.video}
                      </div>
                    </>
                  )}
                </div>
              )}

              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="block border border-gray-100 rounded-2xl overflow-hidden mb-4 bg-gray-50 active:scale-[0.99] transition-transform">
                  {post.linkThumbnail && <img src={post.linkThumbnail} className="w-full aspect-video object-cover" />}
                  <div className="p-3">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
                      <Icon name="link_alt" className="w-3 h-3" /> {new URL(post.link.startsWith('http') ? post.link : `https://${post.link}`).hostname}
                    </p>
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{post.link}</p>
                  </div>
                </a>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${userLikes.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-blue-600'}`}
                  >
                    <svg className="w-5 h-5" fill={userLikes.has(post.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs font-bold">{post.likes + (userLikes.has(post.id) ? 1 : 0)}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${activeCommentPostId === post.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                  >
                    <Icon name="messenger" className="w-5 h-5" />
                    <span className="text-xs font-bold">{allComments.length > 0 ? allComments.length : post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                    <Icon name="forward" className="w-5 h-5" />
                    <span className="text-xs font-bold">Forward</span>
                  </button>
                </div>
                <button 
                  onClick={() => onReport(post.id)}
                  disabled={userReports.has(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${userReports.has(post.id) ? 'text-orange-400 opacity-50' : 'text-gray-400 hover:text-red-600'}`}
                >
                  <Icon name="report" className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{userReports.has(post.id) ? 'Reported' : 'Report'}</span>
                </button>
              </div>

              {/* Comment Section */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-gray-50 animate-in slide-in-from-top duration-300">
                  <div className="mb-4">
                    {paginatedComments.map(cmt => renderComment(cmt, post.id))}
                    {hasMore && (
                      <button 
                        onClick={() => setCommentsVisibleCount(prev => ({ ...prev, [post.id]: visibleLimit + 10 }))}
                        className="w-full text-center py-3 text-xs font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-colors mt-2"
                      >
                        View more comments ({allComments.length - visibleLimit} remaining)
                      </button>
                    )}
                  </div>
                  
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-t-xl border-b border-blue-100">
                      <p className="text-[10px] font-black text-blue-600">Replying to {replyingTo.name}</p>
                      <button onClick={() => setReplyingTo(null)} className="text-blue-600 text-xs font-black">×</button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                      className={`flex-1 bg-gray-50 px-4 py-2 text-xs outline-none focus:ring-1 ring-blue-100 ${replyingTo ? 'rounded-b-xl border-x border-b border-blue-50' : 'rounded-xl'}`}
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 text-white p-2 rounded-xl h-9 w-9 flex items-center justify-center shrink-0"
                    >
                      <Icon name="ai" className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredPosts.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <p className="font-bold text-sm italic">No users matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MarketplaceView: React.FC<{ 
  products: Product[]; 
  onAddProduct: (p: Product) => void;
  onChatWithSeller: (productName: string) => void;
  onViewShopDashboard: () => void;
  searchQuery: string;
}> = ({ products, onAddProduct, onChatWithSeller, onViewShopDashboard, searchQuery }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', location: '', category: 'Electronics', link: '', photos: [] as string[] });
  
  const [locationFilter, setLocationFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('Default');

  const uniqueLocations = ['All', ...Array.from(new Set(products.map(p => p.location || 'Unknown')))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || (p.location || 'Unknown') === locationFilter;
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    if (priceSort === 'Low to High') return a.price - b.price;
    if (priceSort === 'High to Low') return b.price - a.price;
    return 0;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const photoPromises = files.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(photoPromises).then(results => setFormData(prev => ({ ...prev, photos: results })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onAddProduct({
      id: Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price),
      location: formData.location,
      category: formData.category,
      link: formData.link,
      image: formData.photos.length > 0 ? formData.photos[0] : 'https://picsum.photos/seed/item' + Date.now() + '/300/300',
      images: formData.photos,
      rating: 5.0,
      soldCount: 0
    });
    setIsFormOpen(false);
    setFormData({ name: '', price: '', location: '', category: 'Electronics', link: '', photos: [] });
  };

  return (
    <div className="p-4 pb-24 animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <h3 className="font-black text-gray-800">OmniShop</h3>
        <button 
          onClick={onViewShopDashboard}
          className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-black border border-orange-100 hover:bg-orange-100 transition-colors"
        >
          Seller Dashboard
        </button>
      </div>

      <div className="flex gap-2 items-center overflow-x-auto no-scrollbar pb-1 mb-6">
        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <Icon name="points" className="w-4 h-4 text-orange-500" />
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="Default">Price Sort</option>
            <option value="Low to High">Lowest Price</option>
            <option value="High to Low">Highest Price</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-5 rounded-3xl text-white shadow-lg flex justify-between items-center mb-6">
        <div><h4 className="font-bold text-lg">Sell Something?</h4><p className="text-xs opacity-90 mt-1">Free to list items.</p></div>
        <button onClick={() => setIsFormOpen(true)} className="bg-white text-orange-600 font-bold px-4 py-2 rounded-xl text-sm shadow-md">Add Product</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setSelectedProduct(p)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group active:scale-95 transition-transform cursor-pointer"
          >
            <img src={p.image} className="aspect-square object-cover" alt={p.name} />
            <div className="p-3 flex-1 flex flex-col">
              <h5 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1">{p.name}</h5>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-blue-600">₱{p.price.toLocaleString()}</span>
                  {p.location && <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{p.location}</span>}
                </div>
                {p.link && <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg"><Icon name="link" className="w-4 h-4" /></div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="col-span-2 py-20 text-center text-gray-400">
          <p className="font-bold text-sm italic">No items matching "{searchQuery}"</p>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/20 text-white rounded-full flex items-center justify-center z-10 backdrop-blur-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <img src={selectedProduct.image} className="aspect-square w-full object-cover" />
            <div className="p-8">
               <h2 className="text-2xl font-black text-gray-800 leading-tight mb-2">{selectedProduct.name}</h2>
               
               <div className="flex justify-between items-center mb-6">
                 <span className="text-2xl font-black text-blue-600">₱{selectedProduct.price.toLocaleString()}</span>
                 {selectedProduct.location && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <Icon name="location" className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-600">{selectedProduct.location}</span>
                    </div>
                 )}
               </div>

               {selectedProduct.link && (
                 <a 
                   href={selectedProduct.link.startsWith('http') ? selectedProduct.link : `https://${selectedProduct.link}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full mb-4 bg-gray-50 text-gray-700 flex items-center justify-center py-4 rounded-2xl active:scale-95 transition-transform font-black gap-2 text-sm border border-gray-200 hover:bg-gray-100"
                 >
                    <Icon name="link" className="w-5 h-5 text-blue-600" /> Visit Official Website
                 </a>
               )}

               <button 
                  onClick={() => { onChatWithSeller(`Seller of ${selectedProduct.name}`); setSelectedProduct(null); }}
                  className="w-full bg-blue-600 text-white flex items-center justify-center py-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-transform font-black gap-2"
                >
                   <Icon name="messenger" /> Chat with Seller
               </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFormOpen(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-bold mb-6">Marketplace Listing</h3>
            <div className="space-y-4">
              <input required placeholder="Name" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="number" placeholder="Price" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required placeholder="Location" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input placeholder="External Link" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="w-full" />
            </div>
            <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl mt-6">List Item</button>
          </form>
        </div>
      )}
    </div>
  );
};

const JobsView: React.FC<{ 
  jobs: Job[]; 
  balance: number; 
  hasCV: boolean; 
  onPayAndAddJob: (j: Job) => void; 
  onGoToProfile: () => void;
  onChatWithEmployer: (employerName: string) => void;
  onViewJobsDashboard: () => void;
  searchQuery: string;
}> = ({ jobs, balance, hasCV, onPayAndAddJob, onGoToProfile, onChatWithEmployer, onViewJobsDashboard, searchQuery }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ title: '', company: '', salary: '', location: '', type: 'Full-time', description: '', image: '' });
  
  const [locationFilter, setLocationFilter] = useState('All');
  const [salarySort, setSalarySort] = useState('Default');

  const uniqueLocations = ['All', ...Array.from(new Set(jobs.map(j => j.location.split('/')[0].trim())))];

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || j.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    const getVal = (s: string) => parseInt(s.replace(/[^\d]/g, '')) || 0;
    if (salarySort === 'Low to High') return getVal(a.salary) - getVal(b.salary);
    if (salarySort === 'High to Low') return getVal(b.salary) - getVal(a.salary);
    return 0;
  });

  const handleApply = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!hasCV) { setShowCVModal(true); } else { setAppliedJobs(prev => new Set(prev).add(id)); }
  };

  const handleJobPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < 99) { setShowTopUpPopup(true); return; }
    onPayAndAddJob({ ...formData, id: Date.now().toString(), logo: formData.image || 'https://picsum.photos/seed/job'+Date.now()+'/100/100', isPromoted: true });
    setIsFormOpen(false);
    setFormData({ title: '', company: '', salary: '', location: '', type: 'Full-time', description: '', image: '' });
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-2">
        <h3 className="font-black text-gray-800">Job Board</h3>
        <button onClick={onViewJobsDashboard} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black">Employer Portal</button>
      </div>

      <div className="flex gap-2 items-center overflow-x-auto no-scrollbar pb-1 mb-6">
        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <Icon name="points" className="w-4 h-4 text-indigo-500" />
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={salarySort}
            onChange={(e) => setSalarySort(e.target.value)}
          >
            <option value="Default">Salary Sort</option>
            <option value="Low to High">Lowest Salary</option>
            <option value="High to Low">Highest Salary</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-3xl text-white flex justify-between items-center mb-6 shadow-lg">
        <div><h4 className="font-bold text-lg">Hiring?</h4></div>
        <button onClick={() => setIsFormOpen(true)} className="bg-white text-indigo-600 font-bold px-4 py-2 rounded-xl text-sm">Post Job</button>
      </div>
      
      {filteredJobs.map((j) => (
        <div key={j.id} onClick={() => setSelectedJob(j)} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm active:scale-[0.98] transition-transform">
          <img src={j.logo} className="w-12 h-12 rounded-xl border object-cover" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-bold text-sm text-gray-800">{j.title}</h5>
                <p className="text-xs text-gray-600 font-medium">{j.company}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-bold">{j.location}</p>
              </div>
              {appliedJobs.has(j.id) ? (
                <Icon name="check" className="w-4 h-4 text-green-500" />
              ) : (
                <button onClick={(e) => handleApply(j.id, e)} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">Apply</button>
              )}
            </div>
          </div>
        </div>
      ))}
      {filteredJobs.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="font-bold text-sm italic">No jobs matching filters</p>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/20 text-white rounded-full flex items-center justify-center z-10"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="p-8">
               <h2 className="text-2xl font-black text-gray-800 leading-tight">{selectedJob.title}</h2>
               <p className="text-sm font-bold text-blue-600 mb-2">{selectedJob.company}</p>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{selectedJob.location}</p>
               <p className="text-sm text-gray-600 leading-relaxed mb-8">{selectedJob.description || "Looking for a passionate individual to join our team."}</p>
               <div className="flex gap-4">
                   <button onClick={() => handleApply(selectedJob.id)} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl active:scale-95 transition-transform">Apply for Job</button>
                   <button onClick={() => { onChatWithEmployer(selectedJob.company); setSelectedJob(null); }} className="w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl active:scale-95 shadow-sm shadow-blue-50"><Icon name="messenger" /></button>
               </div>
            </div>
          </div>
        </div>
      )}

      {showCVModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-xs text-center shadow-2xl">
            <h3 className="text-xl font-black text-gray-800 mb-2">Add CV in Profile</h3>
            <p className="text-sm text-gray-500 mb-6">Please upload your CV in your Profile section before you can apply for jobs.</p>
            <button onClick={onGoToProfile} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mb-2">Go to Profile</button>
            <button onClick={() => setShowCVModal(false)} className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl">Maybe Later</button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFormOpen(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Post a Job</h3>
            <div className="space-y-4">
              <input required placeholder="Job Title" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input required placeholder="Company" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              <input required placeholder="Location" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <textarea placeholder="Job Description" className="w-full bg-gray-50 rounded-2xl px-4 py-3 resize-none" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="file" accept="image/*" onChange={handleJobPhotoUpload} className="w-full text-xs" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-6">Post & Pay ₱99</button>
          </form>
        </div>
      )}
    </div>
  );
};

const RentalsView: React.FC<{ 
  rentals: Rental[]; 
  onAddRental: (r: Rental) => void;
  onBookProperty: (r: Rental, startDateTime: string, endDateTime: string) => void;
  onChatWithHost: (hostName: string) => void;
  onViewOwnerDashboard: () => void;
  searchQuery: string;
}> = ({ rentals, onAddRental, onBookProperty, onChatWithHost, onViewOwnerDashboard, searchQuery }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [formData, setFormData] = useState({ title: '', price: '', location: '', type: 'Entire Condo', photos: [] as string[], description: '' });
  const [bookingDateTime, setBookingDateTime] = useState('');
  const [bookingEndDateTime, setBookingEndDateTime] = useState('');
  
  const [locationFilter, setLocationFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('Default');

  const uniqueLocations = ['All', ...Array.from(new Set(rentals.map(r => r.location)))];

  const filteredRentals = rentals.filter(r => {
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || r.location === locationFilter;
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    if (priceSort === 'Low to High') return a.price - b.price;
    if (priceSort === 'High to Low') return b.price - a.price;
    return 0;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const photoPromises = files.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(photoPromises).then(results => setFormData(prev => ({ ...prev, photos: results })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;
    onAddRental({
      id: Date.now().toString(),
      title: formData.title,
      price: parseInt(formData.price),
      location: formData.location,
      type: formData.type,
      image: formData.photos.length > 0 ? formData.photos[0] : 'https://picsum.photos/seed/stay' + Date.now() + '/400/300',
      images: formData.photos,
      rating: 5.0,
      description: formData.description
    });
    setIsFormOpen(false);
    setFormData({ title: '', price: '', location: '', type: 'Entire Condo', photos: [], description: '' });
  };

  const handleBook = () => {
    if (!selectedRental || !bookingDateTime || !bookingEndDateTime) { alert("Please select dates."); return; }
    onBookProperty(selectedRental, bookingDateTime, bookingEndDateTime);
    setSelectedRental(null);
    alert("Booking Request Sent!");
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-800">Find Your Stay</h3>
        <button onClick={onViewOwnerDashboard} className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black">Owner Dashboard</button>
      </div>

      <div className="flex gap-2 items-center overflow-x-auto no-scrollbar pb-1 mb-6">
        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <Icon name="points" className="w-4 h-4 text-rose-500" />
          <select 
            className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="Default">Price Sort</option>
            <option value="Low to High">Lowest Price</option>
            <option value="High to Low">Highest Price</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-5 rounded-3xl text-white shadow-lg flex justify-between items-center mb-6">
        <div><h4 className="font-bold text-lg">Have a property?</h4></div>
        <button onClick={() => setIsFormOpen(true)} className="bg-white text-rose-600 font-bold px-4 py-2 rounded-xl text-sm">Post Listing</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRentals.map((r) => (
          <div key={r.id} onClick={() => setSelectedRental(r)} className="cursor-pointer active:scale-[0.98] transition-transform">
            <img src={r.image} className="w-full aspect-video object-cover rounded-2xl mb-2 shadow-sm" alt={r.title} />
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-bold text-gray-800 text-sm">{r.title}</h5>
                <p className="text-[10px] text-gray-500">{r.location} • {r.type}</p>
              </div>
              <span className="text-xs font-bold text-gray-900">₱{r.price.toLocaleString()} / night</span>
            </div>
          </div>
        ))}
        {filteredRentals.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <p className="font-bold text-sm italic">No stays matching filters</p>
          </div>
        )}
      </div>

      {selectedRental && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedRental(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col p-8">
            <button onClick={() => setSelectedRental(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/20 text-white rounded-full flex items-center justify-center"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-2xl font-black text-gray-800 leading-tight mb-2">{selectedRental.title}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{selectedRental.location} • {selectedRental.type}</p>
            <div className="space-y-4 mb-6">
               <label className="text-[10px] font-black text-gray-400 uppercase">Select Booking Dates</label>
               <input type="datetime-local" className="w-full bg-gray-50 rounded-2xl py-3 px-4 text-sm mb-2" value={bookingDateTime} onChange={(e) => setBookingDateTime(e.target.value)} />
               <input type="datetime-local" className="w-full bg-gray-50 rounded-2xl py-3 px-4 text-sm mb-6" value={bookingEndDateTime} onChange={(e) => setBookingEndDateTime(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleBook} className="flex-1 bg-rose-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-200 active:scale-95 transition-transform">Reserve Stay</button>
              <button onClick={() => { onChatWithHost(`Host of ${selectedRental.title}`); setSelectedRental(null); }} className="w-14 h-14 bg-rose-50 text-rose-600 flex items-center justify-center rounded-2xl active:scale-95 shadow-sm shadow-rose-50"><Icon name="messenger" /></button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFormOpen(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Stay Listing</h3>
            <div className="space-y-4">
              <input required placeholder="Title" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input required type="number" placeholder="Price per night" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required placeholder="Location" className="w-full bg-gray-50 rounded-2xl px-4 py-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-gray-50 rounded-2xl px-4 py-3 resize-none" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="w-full" />
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl mt-6">Post Listing</button>
          </form>
        </div>
      )}
    </div>
  );
};

const OwnerDashboardView: React.FC<{ 
  rentals: Rental[];
  notifications: Notification[];
  onConfirmBooking: (notifId: string, rentalId: string, start: string, end: string) => void;
  onBack: () => void;
}> = ({ rentals, notifications, onConfirmBooking, onBack }) => {
  const pendingRequests = notifications.filter(n => n.type === 'booking_request');
  return (
    <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600"><Icon name="back" className="w-5 h-5" /></button>
        <h2 className="text-2xl font-black text-gray-800">Owner Dashboard</h2>
      </div>
      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Pending Requests</h3>
      {pendingRequests.map(n => (
        <div key={n.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4">
           <h4 className="text-sm font-bold text-gray-800">{n.title}</h4>
           <p className="text-xs text-gray-500 mb-4">{n.message}</p>
           {n.bookingData && (
              <button 
                onClick={() => onConfirmBooking(n.id, n.bookingData!.rentalId, n.bookingData!.dateTime, n.bookingData!.endDateTime)}
                className="w-full bg-green-600 text-white text-[10px] font-black py-3 rounded-xl"
              > Approve </button>
           )}
        </div>
      ))}
    </div>
  );
};

const ShopDashboardView: React.FC<{ products: Product[]; onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm"><Icon name="back" /></button>
      <h2 className="text-2xl font-black text-gray-800">Shop Dashboard</h2>
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-5 rounded-[32px] text-white shadow-lg">
        <p className="text-[10px] font-black uppercase opacity-70">Weekly Sales</p>
        <p className="text-2xl font-black mt-1">₱18,240</p>
      </div>
    </div>
  );
};

const JobsDashboardView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm"><Icon name="back" /></button>
      <h2 className="text-2xl font-black text-gray-800">Jobs Dashboard</h2>
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-[32px] text-white shadow-lg">
        <p className="text-[10px] font-black uppercase opacity-70">Total Applicants</p>
        <p className="text-2xl font-black mt-1">48</p>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ initialProfile: any; onSaveProfile: (profile: any) => void }> = ({ initialProfile, onSaveProfile }) => {
  const [profileData, setProfileData] = useState(initialProfile);
  
  useEffect(() => {
    setProfileData(initialProfile);
  }, [initialProfile]);

  const handleInputChange = (field: string, value: any) => { setProfileData(prev => ({ ...prev, [field]: value })); };
  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { handleInputChange(field, file.name); }
  };
  const isVerified = profileData.govIdName && profileData.cvName;

  return (
    <div className="pb-24 space-y-6 animate-in slide-in-from-bottom duration-300">
      <div className="p-4 flex flex-col items-center py-4">
          <img src={profileData.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4" />
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">{profileData.firstName} {profileData.lastName}</h3>
            {isVerified && <Icon name="check" className="w-3 h-3 text-green-500" />}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">OmniSphere Member</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Personal Information</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">First Name</label>
              <input value={profileData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Last Name</label>
              <input value={profileData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Email Address</label>
              <input value={profileData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Mobile Number</label>
              <input value={profileData.mobile} onChange={e => handleInputChange('mobile', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Birthday</label>
              <input type="date" value={profileData.birthday} onChange={e => handleInputChange('birthday', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-blue-100 transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Verification Documents</h4>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Government ID</label>
              <div className="flex items-center gap-3">
                <button onClick={() => document.getElementById('gov-id-upload')?.click()} className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
                  <Icon name="shield" className="w-6 h-6 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{profileData.govIdName || 'Upload ID'}</span>
                </button>
                <input id="gov-id-upload" type="file" className="hidden" onChange={handleFileUpload('govIdName')} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Curriculum Vitae (CV)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => document.getElementById('cv-upload')?.click()} className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
                  <Icon name="jobs" className="w-6 h-6 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{profileData.cvName || 'Upload CV'}</span>
                </button>
                <input id="cv-upload" type="file" className="hidden" onChange={handleFileUpload('cvName')} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Two-Factor Authentication</h4>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${profileData.is2FAEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {profileData.is2FAEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">Enable 2FA</p>
                <p className="text-[10px] text-gray-500">Secure sensitive actions with a code.</p>
              </div>
              <button 
                onClick={() => handleInputChange('is2FAEnabled', !profileData.is2FAEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${profileData.is2FAEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profileData.is2FAEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSaveProfile(profileData)} 
          className="w-full bg-blue-600 text-white font-black py-4 rounded-[24px] shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const MessengerView: React.FC<{ 
  activeFolder: string; 
  onFolderChange: (f: string) => void;
  activeChatEntity: string | null;
  onChatEntityChange: (entity: string | null) => void;
  onSendMessage: (folder: string, entity: string, text: string) => void;
  chats: Record<string, Record<string, Message[]>>;
}> = ({ activeFolder, onFolderChange, activeChatEntity, onChatEntityChange, onSendMessage, chats }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const folderChats = chats[activeFolder] || {};
  const entities = Object.keys(folderChats);
  const currentMessages = activeChatEntity ? (folderChats[activeChatEntity] || []) : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, activeChatEntity]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChatEntity) return;
    onSendMessage(activeFolder, activeChatEntity, inputText);
    setInputText('');
  };

  if (activeChatEntity) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right duration-300">
        <div className="bg-white p-4 border-b flex items-center gap-3">
          <button onClick={() => onChatEntityChange(null)} className="p-2 -ml-2 text-gray-400 active:bg-gray-100 rounded-full">
             <Icon name="back" className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
            {activeChatEntity.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-tight">{activeChatEntity}</h4>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <p className="text-[10px] text-green-500 font-black uppercase tracking-tighter">Online</p>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 no-scrollbar">
          {currentMessages.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
               <Icon name="messenger" className="w-16 h-16 mb-4" />
               <p className="text-sm font-black italic">Start a conversation with {activeChatEntity}</p>
            </div>
          ) : (
            currentMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.senderId === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-50 px-5 py-3.5 rounded-2xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all" 
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-100 active:scale-90 transition-transform">
             <Icon name="ai" className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-left duration-300">
      <div className="sticky top-[72px] z-[90] bg-white border-b border-gray-50 flex gap-1 p-3 overflow-x-auto no-scrollbar">
        {['Main', 'Shop', 'Jobs', 'Stay'].map(folder => (
          <button key={folder} onClick={() => onFolderChange(folder)} className={`px-6 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all ${activeFolder === folder ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{folder}</button>
        ))}
      </div>
      <div className="divide-y divide-gray-50">
        {entities.length === 0 ? (
          <div className="p-16 text-center text-gray-300 flex flex-col items-center">
            <Icon name="messenger" className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-black text-sm uppercase tracking-widest opacity-30">No chats in {activeFolder}</p>
          </div>
        ) : (
          entities.map(ent => (
            <button key={ent} onClick={() => onChatEntityChange(ent)} className="w-full p-5 flex items-center gap-4 hover:bg-blue-50/30 active:bg-blue-50/50 transition-colors border-l-4 border-transparent hover:border-blue-600">
              <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center font-black text-gray-400 border border-white shadow-sm text-xl uppercase">
                {ent.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h5 className="text-sm font-black text-gray-800">{ent}</h5>
                  <span className="text-[9px] font-black text-gray-400 uppercase">Now</span>
                </div>
                <p className="text-xs text-gray-500 truncate font-medium">{folderChats[ent][folderChats[ent].length-1]?.text || 'Started a new conversation'}</p>
              </div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const TwoFactorModal: React.FC<{ 
  method: string; 
  onVerify: (code: string) => void; 
  onCancel: () => void 
}> = ({ method, onVerify, onCancel }) => {
  const [code, setCode] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) onVerify(code);
  };
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="shield" className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2">Verify Identity</h3>
        <p className="text-sm text-gray-500 mb-8">Enter the 6-digit code sent to your {method === 'SMS' ? 'mobile device' : 'authenticator app'}.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-2xl font-black text-center tracking-[0.5em] outline-none" />
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl">Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<{ title: string; message: string; onClose: () => void }> = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[280px] rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="check" className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 mb-8">{message}</p>
        <button onClick={onClose} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95">Great!</button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(24450.50);
  const [points, setPoints] = useState(150.0);
  const [activeChatFolder, setActiveChatFolder] = useState('Main');
  const [activeChatEntity, setActiveChatEntity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socialPosts, setSocialPosts] = useState<Post[]>(MOCK_POSTS);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userReports, setUserReports] = useState<Set<string>>(new Set());
  const [postReportsCount, setPostReportsCount] = useState<Record<string, number>>({});
  const [postComments, setPostComments] = useState<Record<string, SocialComment[]>>({});
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const [profile, setProfile] = useState({ 
    firstName: 'Alex', lastName: 'Johnson', email: 'alex.j@example.com', 
    mobile: '+63 912 345 6789', birthday: '1995-08-24', cvName: '', 
    govIdName: '', avatar: CURRENT_USER.avatar, is2FAEnabled: false, twoFactorMethod: 'SMS'
  });

  const [chats, setChats] = useState<Record<string, Record<string, Message[]>>>(() => {
    const saved = localStorage.getItem('omnisphere_chats_v1');
    return saved ? JSON.parse(saved) : { 'Main': {}, 'Shop': {}, 'Jobs': {}, 'Stay': {} };
  });

  useEffect(() => {
    localStorage.setItem('omnisphere_chats_v1', JSON.stringify(chats));
  }, [chats]);

  const earnSocialPoints = () => setPoints(p => p + 0.1);

  const handleWithdrawPoints = () => { 
    const action = () => {
      if (points <= 0) return; 
      setBalance(b => b + points); 
      setPoints(0); 
      setShowSuccessModal(true);
    };
    if (profile.is2FAEnabled) {
      pendingActionRef.current = action; setShow2FAModal(true);
    } else { action(); }
  };

  const handleSaveProfile = (updatedProfile: any) => {
    const action = () => { setProfile(updatedProfile); setShowSuccessModal(true); };
    if (profile.is2FAEnabled) {
      pendingActionRef.current = action; setShow2FAModal(true);
    } else { action(); }
  };

  const handleVerify2FA = (code: string) => {
    if (code.length === 6) { 
      setShow2FAModal(false);
      if (pendingActionRef.current) { pendingActionRef.current(); pendingActionRef.current = null; }
    }
  };

  const handleSendMessage = (folder: string, entity: string, text: string) => {
    const newMessage: Message = { id: Date.now().toString(), senderId: 'me', text, timestamp: Date.now() };
    setChats(prev => {
      const folderChats = prev[folder] || {};
      const entityChats = folderChats[entity] || [];
      return { ...prev, [folder]: { ...folderChats, [entity]: [...entityChats, newMessage] } };
    });
  };

  const startChat = (folder: string, entity: string) => {
    setChats(prev => {
      const currentFolder = prev[folder] || {};
      if (currentFolder[entity]) return prev;
      return { ...prev, [folder]: { ...currentFolder, [entity]: [] } };
    });
    setActiveChatFolder(folder); setActiveChatEntity(entity); setView(AppView.MESSENGER);
  };

  const handleLikePost = (postId: string) => {
    setUserLikes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId); else newSet.add(postId);
      return newSet;
    });
  };

  const handleReportPost = (postId: string) => {
    if (userReports.has(postId)) return;
    setUserReports(prev => new Set(prev).add(postId));
    setPostReportsCount(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  };

  const handleCommentPost = (postId: string, text: string, parentCommentId?: string) => {
    setPostComments(prev => {
      const currentPostComments = prev[postId] || [];
      const newCmt: SocialComment = {
        id: Date.now().toString(), text, senderName: 'You', timestamp: Date.now(), replies: []
      };
      if (!parentCommentId) return { ...prev, [postId]: [...currentPostComments, newCmt] };
      const addReplyRecursive = (comments: SocialComment[]): SocialComment[] => {
        return comments.map(c => {
          if (c.id === parentCommentId) return { ...c, replies: [...c.replies, newCmt] };
          if (c.replies.length > 0) return { ...c, replies: addReplyRecursive(c.replies) };
          return c;
        });
      };
      return { ...prev, [postId]: addReplyRecursive(currentPostComments) };
    });
  };

  const handleAddSocialPost = (newPostData: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>, cost: number) => {
    setBalance(b => b - cost);
    const newPost: Post = { ...newPostData, id: Date.now().toString(), likes: 0, comments: 0, timestamp: 'Just now' };
    setSocialPosts([newPost, ...socialPosts]);
  };

  const renderView = () => {
    switch (view) {
      case AppView.LOGIN: return <LoginView onLogin={() => setView(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD: return <DashboardView searchQuery={searchQuery} onSearchSelect={setView} onViewChange={setView} products={products} balance={balance} is2FAEnabled={profile.is2FAEnabled} />;
      case AppView.SOCIAL: return <SocialView searchQuery={searchQuery} avatar={profile.avatar} onPostView={earnSocialPoints} posts={socialPosts.filter(p => (postReportsCount[p.id] || 0) < 5)} userLikes={userLikes} userReports={userReports} postComments={postComments} onLike={handleLikePost} onReport={handleReportPost} onComment={handleCommentPost} onAddPost={handleAddSocialPost} balance={balance} />;
      case AppView.MARKETPLACE: return <MarketplaceView searchQuery={searchQuery} products={products} onAddProduct={(p) => setProducts([p, ...products])} onChatWithSeller={(name) => startChat('Shop', name)} onViewShopDashboard={() => setView(AppView.SHOP_DASHBOARD)} />;
      case AppView.SHOP_DASHBOARD: return <ShopDashboardView products={products} onBack={() => setView(AppView.MARKETPLACE)} />;
      case AppView.JOBS: return <JobsView searchQuery={searchQuery} jobs={jobs} balance={balance} hasCV={!!profile.cvName} onPayAndAddJob={(j) => setJobs([j, ...jobs])} onGoToProfile={() => setView(AppView.PROFILE)} onChatWithEmployer={(name) => startChat('Jobs', name)} onViewJobsDashboard={() => setView(AppView.JOBS_DASHBOARD)} />;
      case AppView.JOBS_DASHBOARD: return <JobsDashboardView onBack={() => setView(AppView.JOBS)} />;
      case AppView.RENTALS: return <RentalsView searchQuery={searchQuery} rentals={rentals} onAddRental={(r) => setRentals([r, ...rentals])} onBookProperty={(r, s, e) => setNotifications([{ id: Date.now().toString(), title: "Request", message: r.title, timestamp: "Now", isRead: false, type: 'booking_request', bookingData: { rentalId: r.id, dateTime: s, endDateTime: e } }, ...notifications])} onChatWithHost={(name) => startChat('Stay', name)} onViewOwnerDashboard={() => setView(AppView.OWNER_DASHBOARD)} />;
      case AppView.OWNER_DASHBOARD: return <OwnerDashboardView rentals={rentals} notifications={notifications} onConfirmBooking={(notifId, rentalId, start, end) => { setRentals(rentals.map(r => r.id === rentalId ? { ...r, confirmedSchedules: [...(r.confirmedSchedules || []), `${start} - ${end}`] } : r)); alert("Confirmed!"); }} onBack={() => setView(AppView.RENTALS)} />;
      case AppView.MESSENGER: return <MessengerView activeFolder={activeChatFolder} onFolderChange={setActiveChatFolder} activeChatEntity={activeChatEntity} onChatEntityChange={setActiveChatEntity} onSendMessage={handleSendMessage} chats={chats} />;
      case AppView.PROFILE: return <ProfileView initialProfile={profile} onSaveProfile={handleSaveProfile} />;
      case AppView.POINTS: return <PointsView points={points} onWithdraw={handleWithdrawPoints} />;
      default: return <DashboardView searchQuery={searchQuery} onSearchSelect={setView} onViewChange={setView} products={products} balance={balance} is2FAEnabled={profile.is2FAEnabled} />;
    }
  };

  return (
    <div className="