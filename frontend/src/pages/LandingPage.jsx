import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Activity, Map, ChevronRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [wardName, setWardName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminName, setAdminName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [populationEstimate, setPopulationEstimate] = useState('');
    const [wardDescription, setWardDescription] = useState('');
    const [theme, setTheme] = useState('Tactical Dark');
    const [isLoading, setIsLoading] = useState(false);

    const handleProvision = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const workspaceId = wardName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        
        try {
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
            await axios.post(`${API_BASE}/workspaces`, {
                id: workspaceId,
                city,
                ward_name: wardName,
                admin_email: adminEmail,
                admin_name: adminName,
                population_estimate: parseInt(populationEstimate) || 0,
                ward_description: wardDescription,
                contact_number: contactNumber,
                theme
            });
            navigate(`/ward/${workspaceId}`);
        } catch (error) {
            console.error("Failed to provision workspace", error);
            alert("Failed to provision workspace. Is the backend running?");
            setIsLoading(false);
        }
    };

    const [secretClicks, setSecretClicks] = useState(0);

    const handleSecretClick = () => {
        const newCount = secretClicks + 1;
        if (newCount >= 5) {
            navigate('/master');
        } else {
            setSecretClicks(newCount);
            // Reset after 3 seconds of inactivity
            setTimeout(() => setSecretClicks(0), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 text-stone-100 font-sans selection:bg-saffron-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-navy-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleSecretClick}>
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-saffron-500/20">
                            <Activity className="w-5 h-5 text-navy-950" />
                        </div>
                        <span className="font-display font-black text-xl tracking-tight">WardPulse <span className="text-saffron-500">OS</span></span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/ward/nagpur" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-navy-900 hover:bg-navy-800 transition-colors border border-navy-800">
                            Live Demo
                        </Link>
                        <a href="#create" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-saffron-500 text-navy-950 hover:bg-saffron-400 transition-colors shadow-lg shadow-saffron-500/20">
                            Create Workspace
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-saffron-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/50 border border-navy-800 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono tracking-widest text-stone-400">NEXT-GEN CIVIC ADMINISTRATION</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black font-display tracking-tight leading-[1.1] mb-8">
                        The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-orange-500">Smart Wards</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Deploy a highly secure, real-time intelligence portal for your municipal ward in minutes. Engage citizens, track projects, and resolve issues with military precision.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="#create" className="h-14 px-8 rounded-2xl bg-saffron-500 text-navy-950 font-bold flex items-center justify-center gap-2 hover:bg-saffron-400 transition-all hover:scale-105 shadow-xl shadow-saffron-500/20">
                            Deploy Your Ward <ChevronRight className="w-5 h-5" />
                        </a>
                        <Link to="/ward/nagpur" className="h-14 px-8 rounded-2xl bg-navy-900 text-stone-100 font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-all border border-navy-800 hover:border-navy-700">
                            View Live Demo (Nagpur)
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-navy-900/30 border-y border-navy-900/50 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Military-Grade Security", desc: "Enterprise-level encryption and zero-trust architecture for sensitive civic data." },
                            { icon: Activity, title: "Real-Time Telemetry", desc: "Live issue tracking and project monitoring with millisecond latency." },
                            { icon: Map, title: "Tactical Mapping", desc: "Geospatial visualization of ward infrastructure and ongoing resolutions." }
                        ].map((feat, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-8 rounded-3xl bg-navy-900/50 border border-navy-800/50 hover:bg-navy-900 transition-colors">
                                <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center border border-navy-800 mb-6">
                                    <feat.icon className="w-6 h-6 text-saffron-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-stone-200">{feat.title}</h3>
                                <p className="text-stone-400 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Protocol */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900/50"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-block p-1 bg-saffron-500/10 rounded-2xl mb-8 border border-saffron-500/20">
                        <div className="px-6 py-2 bg-navy-900 rounded-xl flex items-center gap-2">
                            <Activity className="w-4 h-4 text-saffron-500" />
                            <span className="font-mono text-sm tracking-widest text-saffron-400">MISSION PROTOCOL</span>
                        </div>
                    </motion.div>
                    
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black font-display mb-8 max-w-4xl mx-auto leading-tight">
                        Bridging the Gap Between <span className="text-emerald-400">Citizens</span> and <span className="text-saffron-500">Administration</span>.
                    </motion.h2>
                    
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-stone-400 max-w-3xl mx-auto leading-relaxed">
                        WardPulse is not just a dashboard; it is a live intelligence engine. We digitize entire municipal wards to eliminate bureaucratic friction, enforce absolute transparency in fund utilization, and empower citizens to trigger rapid responses to civic hazards.
                    </motion.p>
                </div>
            </section>

            {/* System Capabilities (Bento Box) */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-black font-display mb-4">Core Capabilities</h2>
                        <p className="text-stone-400">The technology stack powering modern civic intelligence.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Large Bento 1 */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 border border-navy-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                            <Activity className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-2xl font-bold text-stone-200 mb-4">WardAI Engine</h3>
                            <p className="text-stone-400 max-w-md">Our proprietary generative AI analyzes hundreds of civic complaints, spots recurring infrastructure patterns, and automatically grades administrative performance without human bias.</p>
                        </motion.div>

                        {/* Standard Bento */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 rounded-[2rem] bg-navy-900 border border-navy-800">
                            <Map className="w-10 h-10 text-sky-400 mb-6" />
                            <h3 className="text-xl font-bold text-stone-200 mb-4">3D GIS Radar</h3>
                            <p className="text-stone-400 text-sm">Real-time geospatial tracking of all hazards and projects on high-resolution hybrid satellite imagery.</p>
                        </motion.div>

                        {/* Standard Bento */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-8 rounded-[2rem] bg-navy-900 border border-navy-800">
                            <Shield className="w-10 h-10 text-rose-400 mb-6" />
                            <h3 className="text-xl font-bold text-stone-200 mb-4">Verified Grievances</h3>
                            <p className="text-stone-400 text-sm">Bot-protected reporting system. Citizens can upvote critical issues, forcing administrative SLAs.</p>
                        </motion.div>

                        {/* Large Bento 2 */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 border border-navy-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl group-hover:bg-saffron-500/20 transition-colors"></div>
                            <CheckCircle2 className="w-10 h-10 text-saffron-400 mb-6" />
                            <h3 className="text-2xl font-bold text-stone-200 mb-4">Official Mandate Generation</h3>
                            <p className="text-stone-400 max-w-md">Instantly compile complex telemetry into formal, printable A4 government mandate documents. Perfect for auditing operational efficiency and tracking apportioned budgets.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Onboarding Form */}
            <section id="create" className="py-32 px-6 relative border-t border-navy-900/50">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-display mb-6">Initialize New Workspace</h2>
                        <p className="text-stone-400 text-lg">Set up a customized intelligence portal for your administration.</p>
                    </div>

                    <div className="bg-navy-900/50 border border-navy-800 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                        
                        <form className="space-y-8 relative z-10" onSubmit={handleProvision}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">City / Municipality</label>
                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai, New York" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Ward Number / Name</label>
                                    <input type="text" value={wardName} onChange={(e) => setWardName(e.target.value)} placeholder="e.g. Ward 14, Downtown" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Administrator Full Name</label>
                                    <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Administrator Email</label>
                                    <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@citygov.org" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Contact Number</label>
                                    <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+91 98765 43210" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Population Estimate</label>
                                    <input type="number" value={populationEstimate} onChange={(e) => setPopulationEstimate(e.target.value)} placeholder="e.g. 50000" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Ward Description / Focus</label>
                                <textarea value={wardDescription} onChange={(e) => setWardDescription(e.target.value)} placeholder="Describe the main focus, key infrastructure, or characteristics of this ward..." rows="3" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">Select Aesthetic Profile</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Tactical Dark', 'Civic Light', 'Cybernetic', 'Minimalist'].map((t, i) => (
                                        <label key={i} className={`cursor-pointer border ${theme === t ? 'border-saffron-500 bg-saffron-500/10' : 'border-navy-800 bg-navy-950'} rounded-xl p-4 text-center transition-all hover:border-saffron-500/50`}>
                                            <input type="radio" name="theme" value={t} checked={theme === t} onChange={(e) => setTheme(e.target.value)} className="sr-only" />
                                            <span className={`text-sm font-bold ${theme === t ? 'text-saffron-500' : 'text-stone-400'}`}>{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full h-16 rounded-xl bg-saffron-500 text-navy-950 font-black text-lg hover:bg-saffron-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />} 
                                {isLoading ? 'Provisioning...' : 'Provision Infrastructure'}
                            </button>
                            <p className="text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant deployment. No credit card required.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
