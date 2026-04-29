import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Search, LogOut, ShieldCheck, User, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onOpenLogin }) => {
    const { language, setLanguage, darkMode, setDarkMode, user, logout, view, setView, currentWorkspace } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    const NavItems = [
        { id: 'hero', key: 'navbar.overview' },
        ...(user?.role === 'Authority' ? [{ id: 'admin-portal', key: 'navbar.admin_portal' }] : []),
        ...(!user || user.role === 'Citizen' ? [{ id: 'report', key: 'navbar.report_issue' }] : []),
        { id: 'buzz', key: 'navbar.ward_buzz' },
        { id: 'projects', key: 'navbar.projects' },
        { id: 'report-card', key: 'navbar.report_card', view: 'report-card', label: 'Report Card' },
    ];

    const MoreItems = [
        { id: 'accuracy', key: 'navbar.scorecard' },
        { id: 'archive', key: 'navbar.archive' },
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
        const trans = t(item.key);
        return trans === item.key ? (item.label || trans) : trans;
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
                            <span className="text-navy-900 font-mono font-bold text-sm sm:text-base">
                                {currentWorkspace ? (currentWorkspace.ward_name.replace(/[^0-9]/g, '') || currentWorkspace.ward_name.charAt(0)) : '14'}
                            </span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <span className="block font-display font-black text-stone-100 text-sm tracking-tight leading-none">
                                {currentWorkspace ? `${currentWorkspace.city} Civic` : t('navbar.ward_civic')}
                            </span>
                            <span className="block font-mono text-[9px] text-saffron-400 uppercase tracking-widest mt-0.5">{t('navbar.intelligence_portal')}</span>
                        </div>
                    </button>
                    
                    <div className="hidden xl:flex items-center gap-6">
                        {NavItems.map(item => (
                            <a 
                                key={item.id} 
                                href={item.view ? '#' : `#${item.id}`}
                                onClick={(e) => {
                                    if (item.view) {
                                        e.preventDefault();
                                        setView(item.view);
                                    } else {
                                        setView('map');
                                    }
                                }}
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
                                {t('navbar.more')} <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
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


                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg border border-navy-600 shadow-sm text-stone-400 hover:text-saffron-400 transition-all active:scale-95 cursor-pointer" title="Toggle Theme">
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <div className="relative notranslate">
                        <button 
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg hover:border-saffron-500 transition-all shadow-inner group cursor-pointer"
                        >
                            <Globe className="w-4 h-4 text-stone-400 group-hover:text-saffron-500 transition-colors" />
                            <span className="text-[10px] font-mono font-bold text-stone-300 uppercase tracking-widest">{t('navbar.' + (language === 'hi' ? 'hindi' : language === 'mr' ? 'marathi' : 'english'))}</span>
                            <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {langMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-36 bg-navy-900/95 backdrop-blur-xl border border-navy-600 rounded-xl shadow-2xl overflow-hidden z-[100]"
                                >
                                    {[
                                        { code: 'en', label: 'English' },
                                        { code: 'hi', label: 'हिंदी' },
                                        { code: 'mr', label: 'मराठी' }
                                    ].map(lang => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => {
                                                handleLanguageChange(lang.code);
                                                setLangMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-[11px] font-mono font-bold uppercase transition-colors tracking-wider flex items-center justify-between ${language === lang.code ? 'bg-saffron-500/10 text-saffron-500 border-l-2 border-saffron-500 pl-3.5' : 'text-stone-300 hover:bg-navy-800 hover:text-white'}`}
                                        >
                                            {lang.label}
                                            {language === lang.code && <div className="w-1.5 h-1.5 bg-saffron-500 rounded-full" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div id="auth-controls" className="flex items-center gap-2 relative z-[10000] pointer-events-auto">
                        {!user ? (
                            <button 
                                onClick={onOpenLogin} 
                                className="relative z-[10001] bg-saffron-500 text-navy-900 px-6 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-saffron-400 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-saffron-500/20 cursor-pointer pointer-events-auto whitespace-nowrap"
                            >
                                {t('navbar.login')}
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
                    <a href="#archive" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-mono text-stone-200 hover:bg-navy-700 rounded transition-colors uppercase tracking-wider">{t('navbar.archive')}</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
