import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Moon, Sun, Search, LogOut, ShieldCheck, User, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../translations';

const Navbar = ({ onOpenLogin }) => {
    const { language, setLanguage, darkMode, setDarkMode, user, logout, view, setView } = useContext(AppContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const toggleTheme = () => setDarkMode(!darkMode);

    const NavItems = [
        { id: 'hero', key: 'overview' },
        ...(user?.role === 'Authority' ? [{ id: 'admin-portal', key: 'adminPortal' }] : []),
        ...(!user || user.role === 'Citizen' ? [{ id: 'report', key: 'report' }] : []),
        { id: 'buzz', key: 'buzz' },
        { id: 'projects', key: 'projects' },
    ];

    const MoreItems = [
        { id: 'accuracy', key: 'scorecard' },
        { id: 'archive', key: 'Archive' },
    ];

    // Active Section Tracking Protocol
    useEffect(() => {
        const sections = ['hero', 'admin-portal', 'report', 'buzz', 'projects', 'accuracy'];
        const observerOptions = { rootMargin: '-20% 0px -70% 0px', threshold: 0 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, observerOptions);

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [view]);

    const getTranslation = (item) => {
        return translations[item.key] ? (translations[item.key][language] || translations[item.key].en) : item.key;
    };

    return (
        <nav id="main-nav" className="fixed top-0 left-0 right-0 z-[9999] bg-navy-800/95 border-b border-navy-600/30 shadow-2xl backdrop-blur-xl transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
                <div className="flex items-center gap-4 sm:gap-8 flex-1">
                    <button 
                        onClick={() => setView('map')}
                        className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-saffron-500 flex items-center justify-center shadow-lg shadow-saffron-500/20">
                            <span className="text-navy-900 font-mono font-bold text-sm sm:text-base">14</span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <span className="block font-display font-black text-stone-100 text-sm tracking-tight leading-none">Ward Civic</span>
                            <span className="block font-mono text-[9px] text-saffron-400 uppercase tracking-widest mt-0.5">Intelligence Portal</span>
                        </div>
                    </button>
                    
                    <div className="hidden xl:flex items-center gap-0.5">
                        {NavItems.map(item => (
                            <a 
                                key={item.id} 
                                href={`#${item.id}`} 
                                onClick={() => setView('map')}
                                className={`px-4 py-2 text-[10px] font-mono font-black transition-all uppercase tracking-widest relative group/nav ${activeSection === item.id ? 'text-saffron-500' : 'text-stone-300/80 hover:text-white'}`}
                            >
                                {getTranslation(item)}
                                {activeSection === item.id && (
                                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-saffron-500" />
                                )}
                            </a>
                        ))}
                        
                        {/* More Strategic Nodes */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsMoreOpen(!isMoreOpen)}
                                className="px-4 py-2 text-[10px] font-mono font-black text-stone-300/80 hover:text-white transition-all uppercase tracking-widest flex items-center gap-1"
                            >
                                More <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isMoreOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-2 right-0 w-48 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-2 z-[100]"
                                    >
                                        {MoreItems.map(item => (
                                            <a 
                                                key={item.id} 
                                                href={`#${item.id}`}
                                                onClick={() => { setView('map'); setIsMoreOpen(false); }}
                                                className="block px-4 py-3 text-[9px] font-mono font-black text-stone-400 hover:text-saffron-500 hover:bg-navy-800 rounded-lg uppercase tracking-widest transition-all"
                                            >
                                                {getTranslation(item)}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="relative hidden md:block max-w-sm w-full group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4 transition-colors group-focus-within:text-saffron-500" />
                        <input type="text" placeholder="Search ward activities..." className="w-full bg-navy-900/50 border border-navy-600/30 rounded-full py-2.5 pl-10 pr-4 text-xs text-stone-200 placeholder:text-stone-600 outline-none focus:border-saffron-500/50 focus:ring-4 focus:ring-saffron-500/5 transition-all" />
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg border border-navy-600 shadow-sm text-stone-400 hover:text-saffron-400 transition-all active:scale-95 cursor-pointer" title="Toggle Theme">
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <div className="flex bg-navy-900 rounded-lg p-0.5 border border-navy-600 shadow-inner">
                        {['en', 'hi', 'mr'].map(lang => (
                            <button key={lang} onClick={() => setLanguage(lang)} className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${language === lang ? 'bg-saffron-500 text-navy-900' : 'text-stone-500 hover:text-stone-200'}`}>
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div id="auth-controls" className="flex items-center gap-2 relative z-[10000] pointer-events-auto">
                        {!user ? (
                            <button 
                                onClick={onOpenLogin} 
                                className="relative z-[10001] bg-saffron-500 text-navy-900 px-6 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-saffron-400 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-saffron-500/20 cursor-pointer pointer-events-auto whitespace-nowrap"
                            >
                                {translations.login[language]}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-navy-900/50 pl-4 py-1.5 pr-1.5 rounded-xl border border-navy-700">
                                <button 
                                    onClick={() => setView('profile')}
                                    className="flex flex-col items-end hover:opacity-80 transition-opacity text-right"
                                >
                                    <span className="text-[11px] font-bold text-stone-100 leading-none">{user.name}</span>
                                    <span className="text-[9px] font-mono text-saffron-400 uppercase tracking-tighter hover:underline underline-offset-4 decoration-saffron-500/50 flex items-center gap-1.5">
                                        {user.role} <User className="w-2.5 h-2.5" />
                                    </span>
                                </button>
                                <button onClick={logout} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-1 shadow-inner" title="Logout">
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-navy-700/50 text-stone-200 border border-navy-600 active:scale-95" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="mobile-menu fixed top-16 right-0 bottom-0 w-72 bg-navy-800 z-40 p-6 flex flex-col gap-1 lg:hidden border-l border-navy-700 shadow-2xl transition-transform active">
                    {NavItems.map(item => (
                        <a key={item.id} href={`#${item.id}`} onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-mono text-stone-200 hover:bg-navy-700 rounded transition-colors uppercase tracking-wider">
                            {getTranslation(item)}
                        </a>
                    ))}
                    <a href="#archive" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-mono text-stone-200 hover:bg-navy-700 rounded transition-colors uppercase tracking-wider">Archive</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
