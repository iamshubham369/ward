import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Shield, Calendar, Activity, MapPin, CheckCircle2, Clock, ChevronRight, LogOut, Key, ArrowLeft, Award, TrendingUp, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ onBack }) => {
    const { user, issues, logout, language } = useContext(AppContext);

    // Calculate Strategic Stats
    const myIssues = useMemo(() => {
        if (!user) return [];
        // In a real app, we'd filter by user id. For demo, we'll show issues reported by "Citizen" if role matches.
        return issues.slice(0, 3); // Demo: show a few issues
    }, [issues, user]);

    const stats = useMemo(() => [
        { label: 'Strategic Reports', value: myIssues.length, icon: Activity, color: 'text-saffron-500' },
        { label: 'Community Upvotes', value: '142', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Protocol Resolved', value: '88%', icon: CheckCircle2, color: 'text-blue-500' },
    ], [myIssues]);

    if (!user) return null;

    const navItemClasses = "w-full flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-navy-800 border border-stone-200 dark:border-navy-700 hover:border-saffron-500 dark:hover:border-saffron-500 transition-all group shadow-sm active:scale-[0.98]";

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-navy-950 pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-saffron-500 transition-colors mb-10 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Return to Map Matrix</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Identity Dossier */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-navy-900 rounded-[3rem] p-10 text-center relative overflow-hidden group shadow-2xl"
                        >
                            <div className="absolute inset-0 grid-bg opacity-10"></div>
                            <div className="relative z-10">
                                <div className="w-32 h-32 bg-saffron-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center relative shadow-3xl shadow-saffron-500/20 group-hover:scale-105 transition-transform duration-500">
                                    <User className="w-16 h-16 text-navy-900" />
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-navy-900 rounded-2xl flex items-center justify-center border-4 border-saffron-500">
                                        <Fingerprint className="w-5 h-5 text-saffron-500" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">{user.name}</h2>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-saffron-500/10 border border-saffron-500/30 rounded-full mb-6">
                                    <Shield className="w-3.5 h-3.5 text-saffron-500" />
                                    <span className="text-[10px] font-mono font-black text-saffron-500 uppercase tracking-widest">{user.role} Identity</span>
                                </div>
                                <p className="text-stone-400 text-xs font-medium mb-8 break-all">{user.email}</p>
                                <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Enrolled Since</span>
                                        <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">APR 07, 2026</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Node Location</span>
                                        <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Ward 14 Matrix</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-navy-800 rounded-[2.5rem] p-8 border border-stone-200 dark:border-navy-700 shadow-xl"
                        >
                            <h4 className="text-[10px] font-mono font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em] mb-8">Strategic Maintenance</h4>
                            <div className="space-y-4">
                                <button className={navItemClasses}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-saffron-100 dark:bg-saffron-500/10 flex items-center justify-center">
                                            <Key className="w-5 h-5 text-saffron-600 dark:text-saffron-500" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest dark:text-stone-100">Modify Security Key</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-saffron-500 transition-colors" />
                                </button>
                                <button onClick={() => { logout(); onBack(); }} className={`${navItemClasses} !bg-red-50 dark:!bg-red-500/5 !border-red-100 dark:!border-red-500/10 hover:!border-red-500`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                                            <LogOut className="w-5 h-5 text-red-600" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-red-600">Terminate Protocol Session</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Service Record */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="bg-white dark:bg-navy-800 rounded-3xl p-8 border border-stone-200 dark:border-navy-700 shadow-xl text-center relative overflow-hidden group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-stone-50 dark:bg-navy-900 border border-stone-100 dark:border-navy-700 shadow-inner group-hover:bg-saffron-50 dark:group-hover:bg-saffron-500/10 transition-colors`}>
                                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <h5 className="text-[9px] font-mono font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">{stat.label}</h5>
                                    <p className="text-2xl font-black text-navy-900 dark:text-stone-100">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-navy-800 rounded-[3rem] p-12 border border-stone-200 dark:border-navy-700 shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h4 className="text-[11px] font-mono font-black text-navy-900 dark:text-stone-100 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-saffron-500" /> Active Service Record
                                </h4>
                                <div className="px-5 py-2 bg-stone-100 dark:bg-navy-900 rounded-full border border-stone-200 dark:border-navy-700 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest">Real-time Node Status</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {myIssues.length > 0 ? myIssues.map((issue, idx) => (
                                    <div key={issue.id} className="relative pl-12 pb-8 border-l border-stone-100 dark:border-navy-700 last:border-0 last:pb-0">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 bg-saffron-500 rounded-full ring-8 ring-saffron-500/10"></div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-3">
                                                    {issue.timestamp?.split('T')[0] || '2024-04-07'} <ArrowLeft className="w-3 h-3 rotate-180 text-saffron-500" /> #{issue.id}
                                                </p>
                                                <h6 className="text-md font-black text-navy-900 dark:text-stone-100 uppercase tracking-tight mb-2">{issue.category}</h6>
                                                <p className="text-xs text-stone-500 line-clamp-2">{issue.description}</p>
                                            </div>
                                            <div className={`shrink-0 px-4 py-1.5 rounded-full border text-[9px] font-mono font-black uppercase tracking-widest ${issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-saffron-50 text-saffron-600 border-saffron-100 dark:bg-saffron-500/10 dark:border-saffron-500/20'}`}>
                                                {issue.status}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12">
                                        <Award className="w-16 h-16 text-stone-200 dark:text-navy-700 mx-auto mb-6" />
                                        <p className="text-xs font-mono font-black text-stone-400 uppercase tracking-widest">No Strategic Activity Recorded Yet</p>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-12 py-5 bg-navy-900 dark:bg-navy-950 text-white rounded-2xl text-[10px] font-mono font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all">
                                Download Full Civic Identity Dossier (PDF) <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
