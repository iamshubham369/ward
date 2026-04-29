import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Shield, Users, MapPin, Database, ChevronRight, ActivitySquare, Server, Eye, Settings } from 'lucide-react';

const MasterAdmin = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
                const [wsRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE}/workspaces`),
                    axios.get(`${API_BASE}/users`)
                ]);
                
                setWorkspaces(wsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Global fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGlobalData();
    }, []);

    const statCards = [
        { title: "Active Ward Nodes", value: workspaces.length, icon: Server, color: "text-emerald-400" },
        { title: "Registered Identities", value: users.length, icon: Users, color: "text-sky-400" },
        { title: "Civic Authorities", value: users.filter(u => u.role === 'Authority').length, icon: Shield, color: "text-saffron-500" },
        { title: "System Health", value: "Optimal", icon: ActivitySquare, color: "text-emerald-500" }
    ];

    return (
        <div className="min-h-screen bg-navy-950 text-stone-100 font-sans p-6 pb-20">
            {/* Master Header */}
            <header className="flex items-center justify-between mb-12 bg-navy-900/50 p-6 rounded-[2rem] border border-navy-800 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
                        <Database className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black font-display tracking-tight text-stone-200">Global Overlord Console</h1>
                        <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">Master Node Administration</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-mono text-stone-400 hover:text-stone-200 transition-colors">BACK TO ORIGIN</Link>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-6 rounded-[2rem] bg-navy-900 border border-navy-800 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-2">{stat.title}</p>
                            <p className="text-3xl font-black font-display">{isLoading ? '-' : stat.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-navy-950 rounded-xl flex items-center justify-center border border-navy-800">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wards/Nodes Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold font-display flex items-center gap-2"><MapPin className="w-5 h-5 text-saffron-500"/> Deployed Ward Nodes</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {isLoading ? (
                            <div className="p-8 text-center text-stone-500 font-mono animate-pulse">Scanning Global Network...</div>
                        ) : workspaces.length === 0 ? (
                            <div className="p-8 text-center text-stone-500 bg-navy-900 border border-navy-800 rounded-3xl">No active nodes found.</div>
                        ) : workspaces.map((ws, idx) => (
                            <motion.div key={ws.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-5 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-navy-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-center text-saffron-500 font-black font-display">
                                        W
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-200">{ws.ward_name} <span className="text-xs font-normal text-stone-500 ml-2">({ws.city})</span></h3>
                                        <p className="text-xs font-mono text-stone-400 mt-1">Admin: {ws.admin_name} | ID: {ws.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/ward/${ws.id}`} className="px-4 py-2 bg-navy-950 border border-navy-700 text-stone-300 rounded-lg text-xs font-mono hover:bg-saffron-500 hover:text-navy-900 hover:border-saffron-500 transition-all flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> Inspect Node
                                    </Link>
                                    <button className="p-2 bg-navy-950 border border-navy-700 text-stone-400 rounded-lg hover:text-rose-500 transition-colors">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Users Management */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold font-display flex items-center gap-2"><Users className="w-5 h-5 text-sky-400"/> Identity Registry</h2>
                    </div>

                    <div className="bg-navy-900 border border-navy-800 rounded-[2rem] p-4 overflow-hidden h-[600px] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-8 text-center text-stone-500 font-mono animate-pulse">Syncing Identities...</div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-stone-500">Registry Empty.</div>
                        ) : (
                            <div className="space-y-3">
                                {users.map(user => (
                                    <div key={user.id} className="p-3 bg-navy-950/50 border border-navy-800 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-stone-200">{user.name}</p>
                                            <p className="text-[10px] font-mono text-stone-500 mt-0.5">{user.email}</p>
                                        </div>
                                        <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border ${user.role === 'Authority' ? 'bg-saffron-500/10 border-saffron-500/30 text-saffron-400' : 'bg-stone-800 border-stone-700 text-stone-400'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterAdmin;
