import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
    ChevronLeft, IndianRupee, Calendar, HardHat, TrendingUp, 
    AlertTriangle, CheckCircle2, Save, Edit3, PieChart, 
    Layers, Download, History, ArrowRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetails = ({ projectId, onBack }) => {
    const { projects, user, updateProject, showToast, language } = useContext(AppContext);
    const { t } = useTranslation();
    const [project, setProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        const p = projects.find(p => p.id === projectId);
        if (p) {
            let details = {};
            try {
                details = typeof p.allocation_details === 'string' ? JSON.parse(p.allocation_details) : (p.allocation_details || {});
            } catch (e) {
                console.error("Allocation Parse Error:", e);
                details = { "Base Materials": 45, "Machinery": 25, "Labor": 30 };
            }
            
            setProject(p);
            setEditForm({
                ...p,
                allocation_details: details
            });
        }
    }, [projectId, projects]);

    if (!project) return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950">
            <Loader2 className="w-12 h-12 text-saffron-500 animate-spin" />
        </div>
    );

    const handleSave = async () => {
        setLoading(true);
        const success = await updateProject(editForm);
        if (success) {
            setIsEditing(false);
            showToast(t('details.toast_success'), "success");
        }
        setLoading(false);
    };

    const allocationItems = Object.entries(editForm?.allocation_details || {
        [t('details.base_materials')]: 45,
        [t('details.heavy_machinery')]: 25,
        [t('details.human_intel')]: 20,
        [t('details.strat_logistics')]: 10
    });

    const inputClasses = "w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-2 text-white text-xs font-mono focus:border-saffron-500 outline-none";
    const labelClasses = "block text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest mb-2";

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-navy-950 pt-24 pb-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Tactical Header */}
                <div className="flex items-center justify-between mb-12">
                    <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-navy-900 dark:hover:text-stone-100 transition-all font-mono text-[10px] uppercase tracking-widest font-black">
                        <ChevronLeft className="w-4 h-4" /> {t('profile.return')}
                    </button>
                    {user?.role === 'Authority' && (
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={loading}
                            className="bg-saffron-500 text-navy-900 px-8 py-3 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest hover:bg-saffron-400 transition-all shadow-xl flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isEditing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                            {isEditing ? t('details.sync_changes') : t('details.edit_protocol')}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Intelligence Section */}
                    <div className="lg:col-span-2 space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-navy-900 rounded-[3rem] p-12 shadow-2xl border border-stone-200 dark:border-navy-800 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-saffron-500/10 text-saffron-600 dark:text-saffron-400 px-4 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-[0.2em] border border-saffron-500/20">
                                        {t(`cat.${(project.category || '').toLowerCase().replace(' ', '_')}`)}
                                    </span>
                                    <span className="text-stone-400 font-mono text-[9px] uppercase tracking-widest flex items-center gap-2">
                                        <HardHat className="w-3.5 h-3.5" /> {language === 'hi' ? project.dept_hi : language === 'mr' ? project.dept_mr : project.dept_en}
                                    </span>
                                </div>

                                {isEditing ? (
                                    <input 
                                        className="text-4xl sm:text-5xl font-display font-black text-navy-900 dark:text-stone-50 bg-transparent border-b-2 border-saffron-500/50 w-full mb-6 focus:border-saffron-500 outline-none"
                                        value={editForm.name_en}
                                        onChange={e => setEditForm({...editForm, name_en: e.target.value})}
                                    />
                                ) : (
                                    <h1 className="text-4xl sm:text-5xl font-display font-black text-navy-900 dark:text-stone-50 mb-6 leading-tight uppercase tracking-tight">
                                        {language === 'hi' ? project.name_hi : language === 'mr' ? project.name_mr : project.name_en}
                                    </h1>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-y border-stone-100 dark:border-navy-800">
                                    <StatNode label={t('details.budget')} value={`₹ ${project.budget} ${t('common.lakh')}`} icon={<IndianRupee />} />
                                    <StatNode label={t('details.funds')} value={`₹ ${project.fund_usage || 0} ${t('common.lakh')}`} icon={<TrendingUp />} color="text-emerald-500" />
                                    <StatNode label={t('details.deadline')} value={new Date(project.deadline).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN')} icon={<Calendar />} />
                                    <StatNode label={t('details.security')} value={t('common.verified')} icon={<CheckCircle2 />} color="text-amber-500" />
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-xs font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <PieChart className="w-4 h-4 text-saffron-500" /> {t('details.resource')}
                                    </h3>
                                    
                                    {/* INVOICE STYLE LEDGER */}
                                    <div className="bg-stone-50 dark:bg-navy-950/50 rounded-3xl p-8 border border-stone-200 dark:border-navy-800 space-y-6">
                                        {allocationItems.map(([item, percent]) => (
                                            <div key={item} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{item}</span>
                                                    <span className="text-xs font-mono font-black text-navy-900 dark:text-saffron-500">{percent}% (₹ {(project.budget * percent / 100).toFixed(2)} ${t('common.lakh')})</span>
                                                </div>
                                                <div className="h-2 bg-stone-200 dark:bg-navy-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        className="h-full bg-saffron-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Operational Sidebar */}
                    <div className="space-y-10">
                        <div className="bg-navy-900 rounded-[3rem] p-10 border border-navy-800 shadow-2xl">
                            <h3 className="text-stone-400 font-mono text-[9px] uppercase tracking-widest font-black mb-8 border-b border-navy-800 pb-4 flex items-center justify-between">
                                {t('details.op_status')} <Download className="w-3 h-3 cursor-pointer hover:text-white" />
                            </h3>
                            
                            <div className="space-y-10">
                                <div className="text-center">
                                    <div className="text-5xl font-display font-black text-stone-50 mb-2">{project.progress}%</div>
                                    <div className="text-[9px] font-mono text-saffron-500 uppercase tracking-widest font-black">{t('details.sync_completion')}</div>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>{t('details.update_progress')}</label>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={editForm.progress} 
                                                onChange={e => setEditForm({...editForm, progress: parseInt(e.target.value)})}
                                                className="w-full accent-saffron-500" 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>{t('details.proj_status')}</label>
                                            <select 
                                                value={editForm.status} 
                                                onChange={e => setEditForm({...editForm, status: e.target.value})}
                                                className={inputClasses}
                                            >
                                                <option value="On-Track">{t('status.on_track')}</option>
                                                <option value="Ongoing">{t('status.ongoing')}</option>
                                                <option value="Delayed">{t('status.delayed')}</option>
                                                <option value="Completed">{t('status.completed')}</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="px-6 py-2 bg-saffron-500/10 border border-saffron-500/30 rounded-xl text-saffron-500 text-[10px] font-mono font-black uppercase tracking-widest">
                                            {t(`status.${(project.status || '').toLowerCase().replace('-', '_')}`)}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-navy-800">
                                    <button className="w-full bg-navy-800 hover:bg-navy-700 text-stone-300 py-4 rounded-2xl text-[9px] font-mono font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                        {t('details.ledger')} <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-navy-900 rounded-[3rem] p-10 border border-stone-200 dark:border-navy-800 shadow-2xl">
                            <h3 className="text-stone-400 font-mono text-[9px] uppercase tracking-widest font-black mb-8 flex items-center gap-3">
                                <History className="w-4 h-4" /> {t('details.timeline')}
                            </h3>
                            <div className="space-y-8">
                                <TimelineNode date={`12 Mar`} title={t('report.step_broadcast_title')} desc={t('report.step_broadcast_desc')} active />
                                <TimelineNode date={`05 Mar`} title={t('report.step_ops_title')} desc={t('report.step_ops_desc')} />
                                <TimelineNode date={`28 Feb`} title={t('report.step_review_title')} desc={t('report.step_review_desc')} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatNode = ({ label, value, icon, color = "text-navy-900 dark:text-stone-100" }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">
            {icon} {label}
        </div>
        <div className={`text-sm sm:text-base font-black ${color} tracking-tight`}>{value}</div>
    </div>
);

const TimelineNode = ({ date, title, desc, active = false }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-saffron-500 shadow-[0_0_10px_#E8A317]' : 'bg-stone-300 dark:bg-navy-700'}`}></div>
            <div className="w-px flex-1 bg-stone-200 dark:bg-navy-800 mt-2"></div>
        </div>
        <div className="pb-2">
            <div className="text-[10px] font-mono font-black text-stone-900 dark:text-stone-100 uppercase tracking-widest mb-1 group-hover:text-saffron-500 transition-colors">{title}</div>
            <div className="text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold mb-1">{date}</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed font-medium">{desc}</div>
        </div>
    </div>
);

export default ProjectDetails;
