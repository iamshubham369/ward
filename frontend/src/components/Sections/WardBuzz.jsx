import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ThumbsUp, MessageSquare, MapPin, Calendar, CheckCircle2, Siren, ArrowRight, TrendingUp, Search, Filter } from 'lucide-react';
import axios from 'axios';

const WardBuzz = () => {
    const { issues, language, API_BASE, fetchIssues, user, showToast } = useContext(AppContext);
    const [filterCat, setFilterCat] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleUpvote = async (id) => {
        try {
            await axios.post(`${API_BASE}/issues/upvote/${id}`);
            fetchIssues();
        } catch (e) { console.error(e); }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!user || user.role !== 'Authority') {
            showToast('Authorization Required for Strategic Status Mod', 'error');
            return;
        }
        try {
            await axios.post(`${API_BASE}/issues/status/${id}`, { status });
            fetchIssues();
            showToast(`Status Protocol Updated: ${status}`, 'success');
        } catch (e) { console.error(e); }
    };

    const filteredIssues = issues ? issues.filter(i => {
        if (filterCat !== 'all' && i.category !== filterCat) return false;
        if (filterStatus !== 'all' && (i.status || '').toLowerCase() !== filterStatus.toLowerCase()) return false;
        return true;
    }) : [];

    return (
        <section id="buzz" className="bg-navy-800 grid-bg py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-navy-900/90 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-black mb-2 block">Tactical Intel Stream</span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-stone-50 leading-tight">
                            Ward <span className="text-saffron-500 italic">Buzz</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 bg-navy-900/80 p-3 rounded-2xl border border-navy-700 shadow-2xl backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">Live Intelligence Feed — {issues?.length || 0} Protocols</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-10 reveal visible">
                    <div className="relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 group-hover:text-saffron-500 transition-colors" />
                        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-navy-900/80 border border-navy-700/50 text-stone-200 text-xs font-mono rounded-xl pl-9 pr-8 py-3 appearance-none outline-none focus:border-saffron-500 cursor-pointer shadow-lg hover:bg-navy-800 transition-all">
                            <option value="all">CATEGORIES / श्रेणी</option>
                            <option value="Roads">ROADS / सड़कें</option>
                            <option value="Water Supply">WATER / पानी</option>
                            <option value="Electricity">ELECTRICITY / बिजली</option>
                            <option value="Sanitation">SANITATION / स्वच्छता</option>
                        </select>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 group-hover:text-saffron-500 transition-colors" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-navy-900/80 border border-navy-700/50 text-stone-200 text-xs font-mono rounded-xl pl-9 pr-8 py-3 appearance-none outline-none focus:border-saffron-500 cursor-pointer shadow-lg hover:bg-navy-800 transition-all">
                            <option value="all">STATUS / स्थिति</option>
                            <option value="submitted">SUBMITTED / प्रस्तुत</option>
                            <option value="in progress">PROGRESS / प्रगति</option>
                            <option value="resolved">RESOLVED / समाधान</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 space-y-6">

                        {filteredIssues.length === 0 ? (
                            <div className="bg-navy-900/50 border-2 border-dashed border-navy-700 p-20 rounded-3xl text-center flex flex-col items-center justify-center grayscale opacity-50">
                                <Search className="w-12 h-12 text-stone-600 mb-6" />
                                <h3 className="font-mono text-sm font-black text-stone-500 uppercase tracking-widest">No Intelligence Records Found</h3>
                            </div>
                        ) : (
                            filteredIssues.map((issue, idx) => (
                                <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} onStatus={handleStatusUpdate} isAdmin={user?.role === 'Authority'} />
                            ))
                        )}
                    </div>
                    
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-navy-900/80 border border-navy-700 p-8 rounded-3xl sticky top-24 backdrop-blur-xl shadow-2xl group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                            <h3 className="font-mono text-[10px] font-black text-saffron-400 uppercase tracking-[0.4em] mb-8 flex items-center justify-between">
                                Context Highlights <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />
                            </h3>
                            <div className="space-y-6">
                                <TrendingItem title="MG Road Sector Leak" count="24 upvotes" icon={< Siren className="w-3 h-3" />} />
                                <TrendingItem title="Dharampeth Pothole Alert" count="18 upvotes" icon={< Siren className="w-3 h-3" />} />
                                <TrendingItem title="Ward 14 Cleanup" count="42 participants" icon={< CheckCircle2 className="w-3 h-3" />} />
                            </div>
                            <button className="mt-10 w-full bg-navy-800 border border-navy-700 hover:border-saffron-500/50 py-4 rounded-xl text-[10px] font-mono font-black text-stone-400 hover:text-saffron-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn">
                                Intelligence Report <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const IssueCard = ({ issue, onUpvote, onStatus, isAdmin }) => {
    const isResolved = issue.status.toLowerCase() === 'resolved';

    return (
        <div className={`bg-navy-900/80 border rounded-3xl p-6 sm:p-8 hover:translate-y-[-4px] transition-all duration-500 group relative backdrop-blur-xl shadow-2xl overflow-hidden ${isResolved ? 'border-emerald-500/30' : 'border-navy-700 hover:border-saffron-500/30'}`}>
            {isResolved && <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 px-3 py-1.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10"><CheckCircle2 className="w-3 h-3" /> VERIFIED RESOLUTION</div>}
            
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <button onClick={() => onUpvote(issue.id)} className="w-14 h-14 bg-navy-800 border border-navy-700 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-saffron-500 hover:border-saffron-600 hover:text-navy-900 transition-all active:scale-95 group/upvote shadow-inner">
                        <TrendingUp className="w-4 h-4 group-hover/upvote:scale-125 transition-transform" />
                        <span className="text-[10px] font-mono font-black">{issue.upvotes}</span>
                    </button>
                    <span className="text-[8px] font-mono font-bold text-stone-500 uppercase tracking-widest mt-1">UPVOTES</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-navy-800 border border-navy-700 text-saffron-500 px-3 py-1 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest">{issue.category}</span>
                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold">Protocol ID: <span className="text-stone-300">{issue.id}</span></span>
                    </div>
                    <h3 className="text-xl font-black text-stone-100 mb-3 leading-tight tracking-tight uppercase group-hover:text-saffron-400 transition-colors">{issue.description}</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-stone-400 font-mono font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-saffron-500/50" /> {issue.street} {issue.landmark ? `— ${issue.landmark}` : ''}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-saffron-500/50" /> {new Date(issue.timestamp).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                        <span className="flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-saffron-500/50" /> {Math.floor(issue.upvotes / 3)} Comms</span>
                    </div>

                    {isAdmin && !isResolved && (
                        <div className="mt-8 pt-6 border-t border-navy-700 flex flex-wrap gap-2">
                            <button onClick={() => onStatus(issue.id, 'In Progress')} className="bg-navy-800 border border-navy-700 hover:border-saffron-500/50 px-4 py-2.5 rounded-xl text-[9px] font-mono font-black text-stone-400 hover:text-saffron-400 transition-all uppercase tracking-widest">Mark: In Progress</button>
                            <button onClick={() => onStatus(issue.id, 'Resolved')} className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-navy-900 px-4 py-2.5 rounded-xl text-[9px] font-mono font-black text-emerald-500 hover:text-navy-900 transition-all uppercase tracking-widest">Verify: Resolved</button>
                        </div>
                    )}
                </div>
                
                {issue.file_path && (
                    <div className="shrink-0 w-full sm:w-32 h-32 bg-navy-800 rounded-3xl overflow-hidden shadow-2xl relative group/img">
                        <img src={`http://localhost:5000${issue.file_path}`} alt="Issue Evidence" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><TrendingUp className="w-6 h-6 text-saffron-500" /></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrendingItem = ({ title, count, icon }) => (
    <div className="flex items-start gap-4 cursor-pointer group/trend">
        <div className="w-8 h-8 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0 group-hover/trend:border-saffron-500/50 group-hover/trend:scale-110 transition-all text-stone-500 group-hover/trend:text-saffron-500 shadow-inner">{icon}</div>
        <div>
            <div className="text-[10px] font-black text-stone-100 group-hover/trend:text-saffron-400 transition-colors uppercase tracking-tight">{title}</div>
            <div className="text-[9px] font-mono text-stone-500 uppercase mt-0.5 font-bold">{count}</div>
        </div>
    </div>
);

export default WardBuzz;
