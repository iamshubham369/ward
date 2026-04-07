import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Sections/Hero';
import AdminPortal from './components/Sections/AdminPortal';
import WardHub from './components/Sections/WardHub';
import ReportIssue from './components/Sections/ReportIssue';
import WardBuzz from './components/Sections/WardBuzz';
import OngoingProjects from './components/Sections/OngoingProjects';
import AccuracyEngine from './components/Sections/AccuracyEngine';
import TacticalMap from './components/Sections/TacticalMap';
import TransparencyArchive from './components/Sections/TransparencyArchive';
import Profile from './components/Sections/Profile';
import ProjectDetails from './components/Sections/ProjectDetails';
import ProjectGenesisModal from './components/Modals/ProjectGenesisModal';
import LoginModal from './components/Modals/LoginModal';
import ProjectModal from './components/Modals/ProjectModal';
import WardAI from './components/Chatbot/WardAI';
import { Bell, X, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent = () => {
    const { toast, user, darkMode, language, issues, projects, selectedProjectId, view, setView } = useContext(AppContext);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isGenesisOpen, setIsGenesisOpen] = useState(false);

    const handleOpenGenesis = () => {
        console.log("CRITICAL: Genesis Protocol Initiated");
        setIsGenesisOpen(true);
    };
    const [isEmergencyVisible, setIsEmergencyVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => revealElements.forEach(el => observer.unobserve(el));
    }, [issues, projects]); // Re-observe when data changes

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-navy-950' : 'bg-stone-50'}`}>
            {/* Emergency Banner */}
            <AnimatePresence>
                {isEmergencyVisible && (
                    <motion.div 
                        initial={{ y: -100 }} 
                        animate={{ y: 0 }} 
                        exit={{ y: -100 }}
                        className="fixed top-16 sm:top-20 left-0 right-0 z-[45] bg-gradient-to-r from-saffron-600 via-amber-500 to-orange-500 text-navy-900 shadow-2xl border-b border-saffron-600/50 backdrop-blur-md"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="p-2 bg-navy-900 rounded-xl shadow-lg animate-pulse"><Bell className="w-4 h-4 text-saffron-400" /></div>
                                <p className="text-xs font-black uppercase tracking-wider truncate italic">
                                    Flash Flood Warning: Evacuate low-lying areas in Sector 7 immediately. Emergency Response Teams activated.
                                </p>
                            </div>
                            <button onClick={() => setIsEmergencyVisible(false)} className="shrink-0 p-2 hover:bg-navy-900/10 rounded-xl transition-all border border-transparent hover:border-navy-900/20"><X className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
            
            <main className="relative">
                <AnimatePresence mode="wait">
                    {view === 'map' ? (
                        <motion.div 
                            key="map-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Hero />
                            <AdminPortal onOpenGenesis={handleOpenGenesis} />
                            <WardHub />
                            {(!user || user.role === 'Citizen') && <ReportIssue />}
                            <WardBuzz />
                            <OngoingProjects onOpenModal={() => setIsProjectOpen(true)} onOpenGenesis={handleOpenGenesis} />
                            <AccuracyEngine />
                            <TransparencyArchive />
                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                <TacticalMap issues={issues} projects={projects} />
                            </div>
                        </motion.div>
                    ) : view === 'profile' ? (
                        <motion.div 
                            key="profile-view"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <Profile onBack={() => setView('map')} />
                        </motion.div>
                    ) : view === 'project-details' ? (
                        <motion.div 
                            key="project-details-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <ProjectDetails 
                                projectId={selectedProjectId} 
                                onBack={() => setView('map')} 
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>

            {/* Global UI Components - Matrix Overlays */}
            <AnimatePresence>
                {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
                {isProjectOpen && <ProjectModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />}
                {isGenesisOpen && <ProjectGenesisModal isOpen={isGenesisOpen} onClose={() => setIsGenesisOpen(false)} />}
            </AnimatePresence>
            <WardAI />

            {/* Toast System - Tactical Overlays */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0, x: '-50%' }} 
                        animate={{ y: 0, opacity: 1, x: '-50%' }} 
                        exit={{ y: -100, opacity: 0, x: '-50%' }}
                        className="fixed top-28 left-1/2 -translate-x-1/2 z-[30000] flex items-center gap-4 bg-navy-900 text-stone-100 px-8 py-5 rounded-[1.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-navy-700 backdrop-blur-3xl group overflow-hidden min-w-[320px]"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-saffron-500"></div>
                        <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center font-black">
                            {toast.type === 'success' ? <CheckCircle className="text-emerald-500 w-5 h-5 shadow-sm" /> : toast.type === 'error' ? <AlertCircle className="text-red-500 w-5 h-5 shadow-sm" /> : <Info className="text-saffron-500 w-5 h-5 shadow-sm" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-black text-saffron-500 uppercase tracking-widest leading-none mb-1">System Advisory</span>
                            <span className="text-xs font-bold tracking-tight text-stone-200">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="bg-navy-950 py-16 border-t border-navy-900 border-dashed">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-saffron-500 rounded-xl flex items-center justify-center text-navy-900 font-black text-xs shadow-2xl shadow-saffron-500/30">14</div>
                        <div className="text-left">
                            <span className="block font-display font-black text-stone-100 text-sm tracking-tight uppercase">Ward Civic</span>
                            <span className="block font-mono text-[9px] text-saffron-500 uppercase tracking-widest opacity-60">Intelligence Portal</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-8 mb-10">
                        {['Protocol', 'Analytics', 'Transparency', 'Archive'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-mono font-black text-stone-500 hover:text-saffron-500 transition-colors uppercase tracking-[0.3em]">{item}</a>
                        ))}
                    </div>
                    <p className="text-[9px] font-mono text-stone-600 uppercase tracking-widest leading-relaxed">
                        &copy; 2026 Nagpur Municipal Corporation — Strategic Ward Digital Infrastructure.<br/>
                        <span className="opacity-40 italic">Unauthorized access to tactical core is strictly monitored by Ward Security protocols.</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

const App = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;
