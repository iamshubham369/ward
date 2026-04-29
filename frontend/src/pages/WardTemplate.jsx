import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Layout/Navbar';
import { Shield, Users, MapPin, Activity, Bell, X, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WardTemplate = () => {
    const { wardId } = useParams();
    const { toast, currentWorkspace, fetchWorkspaceData } = useContext(AppContext);
    
    // Fallback UI State
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (wardId) {
            fetchWorkspaceData(wardId).then(() => setIsLoading(false));
        }
    }, [wardId, fetchWorkspaceData]);

    if (isLoading || !currentWorkspace) {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const { city, ward_name, admin_name, admin_email, contact_number, population_estimate, ward_description, theme } = currentWorkspace;

    return (
        <div className={`min-h-screen transition-colors duration-500 bg-navy-950 text-stone-100 font-sans selection:bg-saffron-500/30`}>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-navy-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-saffron-500/20">
                            <Activity className="w-5 h-5 text-navy-950" />
                        </div>
                        <span className="font-display font-black text-xl tracking-tight">WardPulse <span className="text-saffron-500">OS</span></span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-navy-900 hover:bg-navy-800 transition-colors border border-navy-800">
                            Exit Portal
                        </Link>
                    </div>
                </div>
            </header>

            {/* Template Hero */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden min-h-[70vh] flex items-center">
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-saffron-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/50 border border-navy-800 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-mono tracking-widest text-stone-400">{city.toUpperCase()} MUNICIPAL CORPORATION</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black font-display tracking-tight leading-[1.1] mb-4">
                            {ward_name}
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-saffron-500 font-mono mb-8">
                            Theme: {theme}
                        </motion.p>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-stone-400 mb-10 leading-relaxed max-w-lg">
                            {ward_description || "This is a freshly deployed intelligent civic node. Awaiting telemetry and administrative synchronization."}
                        </motion.p>
                        
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4">
                            <button className="h-14 px-8 rounded-2xl bg-saffron-500 text-navy-950 font-bold hover:bg-saffron-400 transition-all shadow-xl shadow-saffron-500/20">
                                Administrative Login
                            </button>
                            <button className="h-14 px-8 rounded-2xl bg-navy-900 text-stone-100 font-bold hover:bg-navy-800 transition-all border border-navy-800">
                                Report Issue
                            </button>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-navy-900/30 border border-navy-800/50 rounded-[2rem] p-8 backdrop-blur-xl relative">
                        <div className="absolute top-0 right-0 p-6 opacity-20"><Shield className="w-32 h-32" /></div>
                        <h3 className="text-2xl font-black font-display mb-8">Civic Telemetry Profile</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800"><Users className="w-5 h-5 text-saffron-500" /></div>
                                <div>
                                    <p className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">Administrator</p>
                                    <p className="text-lg font-bold text-stone-200">{admin_name || "Unassigned"}</p>
                                    <p className="text-sm text-stone-400">{admin_email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800"><MapPin className="w-5 h-5 text-saffron-500" /></div>
                                <div>
                                    <p className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">Demographics</p>
                                    <p className="text-lg font-bold text-stone-200">Est. {population_estimate ? population_estimate.toLocaleString() : 'N/A'} Citizens</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800"><Activity className="w-5 h-5 text-saffron-500" /></div>
                                <div>
                                    <p className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">Contact Node</p>
                                    <p className="text-lg font-bold text-stone-200">{contact_number || "Awaiting Line Setup"}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Default Clean Modules Placeholder */}
            <section className="py-20 px-6 border-t border-navy-900/50 bg-navy-900/10">
                <div className="max-w-7xl mx-auto text-center">
                    <Activity className="w-12 h-12 text-navy-800 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-stone-500 mb-2">Module Initialization Pending</h2>
                    <p className="text-stone-600 max-w-md mx-auto">This dedicated template is currently in standby mode. Dashboard modules for {ward_name} will activate once initial civic data is synced.</p>
                </div>
            </section>
        </div>
    );
};

export default WardTemplate;
