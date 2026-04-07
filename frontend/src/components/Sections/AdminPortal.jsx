import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, Database, FileText, Settings, Users, Activity, BarChart, HardHat, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminPortal = ({ onOpenGenesis }) => {
    const { user, issues, projects, language } = useContext(AppContext);

    if (!user || user.role !== 'Authority') return null;

    return (
        <section id="admin-portal" className="bg-navy-950 py-16 md:py-24 relative overflow-hidden border-t-4 border-saffron-500">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="reveal visible">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-500 font-black mb-2 block italic">Strategic Oversight Center</span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-stone-50 leading-tight flex items-center gap-4">
                            Authority <span className="text-saffron-500 italic">Interface</span> <ShieldCheck className="w-10 h-10 text-saffron-500 animate-pulse" />
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 bg-navy-900 px-6 py-3 rounded-2xl border border-navy-700 shadow-2xl">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-[0.2em] font-black italic">Active Node: Command & Control</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 reveal visible">
                    {/* Admin Stats Sidebar */}
                    <div className="lg:col-span-3 space-y-4">
                        <AdminMiniCard icon={<Users className="w-4 h-4" />} title="Citizen Interactions" value="1,248" color="text-sky-400" />
                        <AdminMiniCard icon={<Activity className="w-4 h-4" />} title="Response Rate" value="92%" color="text-emerald-400" />
                        <AdminMiniCard icon={<Database className="w-4 h-4" />} title="System Memory" value="14.2 GB" color="text-saffron-400" />
                    </div>

                    {/* Operational Table */}
                    <div className="lg:col-span-9 bg-navy-900 rounded-[2.5rem] border border-navy-700 shadow-2xl overflow-hidden group">
                        <div className="p-8 border-b border-navy-800 flex items-center justify-between bg-navy-950/50">
                            <h3 className="font-mono text-[10px] font-black text-stone-100 uppercase tracking-[0.4em]">Strategic Issue Matrix</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-navy-800 rounded-lg text-[9px] font-mono text-stone-500 border border-navy-700 uppercase">Export XLSX</span>
                                <span className="px-3 py-1 bg-navy-800 rounded-lg text-[9px] font-mono text-stone-500 border border-navy-700 uppercase">PDF Log</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono font-bold text-stone-300">
                                <thead className="bg-navy-950/80 border-b border-navy-800">
                                    <tr>
                                        <th className="px-8 py-5 text-stone-500 uppercase tracking-widest text-[10px]">Reference</th>
                                        <th className="px-8 py-5 text-stone-500 uppercase tracking-widest text-[10px]">Category</th>
                                        <th className="px-8 py-5 text-stone-500 uppercase tracking-widest text-[10px]">Priority</th>
                                        <th className="px-8 py-5 text-stone-500 uppercase tracking-widest text-[10px]">Status Protocol</th>
                                        <th className="px-8 py-5 text-stone-500 uppercase tracking-widest text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-800/50">
                                    {issues?.slice(0, 5).map(issue => (
                                        <tr key={issue.id} className="hover:bg-navy-800/30 transition-all group/row cursor-default">
                                            <td className="px-8 py-5 text-stone-100 font-black">{issue.id}</td>
                                            <td className="px-8 py-5"><span className="text-stone-400">{issue.category}</span></td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-0.5 rounded-md border text-[9px] shadow-sm ${(issue.priority || 'Normal').toUpperCase() === 'HIGH' || (issue.priority || 'Normal').toUpperCase() === 'EMERGENCY' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-navy-700 text-stone-400 border-navy-600'}`}>{(issue.priority || 'Normal').toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${issue.status === 'Resolved' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-saffron-500 animate-pulse'}`}></div>
                                                    <span className="uppercase text-[10px] tracking-tighter">{issue.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button className="text-saffron-500 hover:text-white transition-colors transition-all"><Settings className="w-3.5 h-3.5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AdminToolCard 
                        icon={<HardHat className="w-6 h-6" />} 
                        title="Project Deployment" 
                        desc="Adjust strategic budgets, deadlines, and agency permissions." 
                        onClick={onOpenGenesis}
                    />
                    <AdminToolCard icon={<TrendingUp className="w-6 h-6" />} title="Analytics Studio" desc="Synthesize ward performance data into quarterly reports." />
                    <AdminToolCard icon={<AlertTriangle className="w-6 h-6" />} title="Crisis Protocol" desc="Dispatch emergency alerts and ward-wide notifications." />
                </div>
            </div>
        </section>
    );
};

const AdminMiniCard = ({ icon, title, value, color }) => (
    <div className="bg-navy-900 p-6 rounded-3xl border border-navy-700 shadow-xl group hover:border-saffron-500/30 transition-all cursor-default overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-stone-500 group-hover:text-saffron-500 transition-colors">{icon}</div>
            <span className="text-[9px] font-mono font-bold text-stone-600 uppercase tracking-widest">{title}</span>
        </div>
        <div className={`font-mono font-black text-3xl tracking-tighter text-stone-50 group-hover:scale-105 transition-transform duration-500`}>{value}</div>
    </div>
);

const AdminToolCard = ({ icon, title, desc, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-navy-900/50 backdrop-blur-xl border border-navy-700 p-8 rounded-[2rem] shadow-xl group hover:border-saffron-500/20 transition-all hover:translate-y-[-4px] cursor-pointer"
    >
        <div className="w-14 h-14 bg-navy-800 border border-navy-700 rounded-2xl flex items-center justify-center text-saffron-500 mb-6 group-hover:scale-110 shadow-2xl transition-transform">{icon}</div>
        <h4 className="font-display font-black text-xl text-stone-50 mb-3 tracking-tight uppercase group-hover:text-saffron-500 transition-colors">{title}</h4>
        <p className="text-[11px] font-mono text-stone-500 font-bold uppercase tracking-widest leading-loose">{desc}</p>
        <button className="mt-8 text-[9px] font-mono font-black text-saffron-500 uppercase tracking-[0.3em] flex items-center gap-2 group/btn">Launch Console <Settings className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-700" /></button>
    </div>
);

export default AdminPortal;
