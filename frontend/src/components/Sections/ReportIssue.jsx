import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { MapPin, Check, Upload, Shield, Satellite, FileText, Search, Wrench, CircleCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

const ReportIssue = () => {
    const { language, showToast, API_BASE, fetchIssues } = useContext(AppContext);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        street: '',
        landmark: '',
        pincode: '',
        description: '',
        priority: '',
        anonymous: false,
        file: null
    });
    const [trackingId, setTrackingId] = useState(null);

    const categories = [
        { id: 'Roads', en: 'Roads', hi: 'सड़कें', mr: 'रस्ते', icon: 'road' },
        { id: 'Water Supply', en: 'Water', hi: 'पानी', mr: 'पाणी', icon: 'droplet' },
        { id: 'Electricity', en: 'Electricity', hi: 'बिजली', mr: 'वीज', icon: 'bolt' },
        { id: 'Sanitation', en: 'Sanitation', hi: 'स्वच्छता', mr: 'स्वच्छता', icon: 'trash' },
        { id: 'Public Safety', en: 'Safety', hi: 'सुरक्षा', mr: 'सुरक्षा', icon: 'shield' }
    ];

    const priorities = ['Low', 'Medium', 'High', 'Emergency'];

    const getT = (item) => item[language] || item.en;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category || !formData.street || !formData.description || !formData.priority) {
            showToast(t('report.category_err') || 'Please fulfill all required fields.', 'error');
            return;
        }

        setLoading(true);
        const tid = 'W14-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const data = new FormData();
        data.append('id', tid);
        data.append('category', formData.category);
        data.append('street', formData.street);
        data.append('landmark', formData.landmark);
        data.append('pincode', formData.pincode);
        data.append('description', formData.description);
        data.append('priority', formData.priority);
        data.append('anonymous', formData.anonymous);
        if (formData.file) data.append('file', formData.file);

        try {
            await axios.post(`${API_BASE}/issues`, data);
            setTrackingId(tid);
            showToast(t('report.success') || `Protocol Active: Issue ${tid} Logged`, 'success');
            fetchIssues();
            setFormData({
                category: '', street: '', landmark: '', pincode: '', description: '', priority: '', anonymous: false, file: null
            });
        } catch (err) {
            showToast(t('report.system_err') || 'System Error: Synchronization Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="report" className="bg-stone-100 dark:bg-navy-950 py-16 md:py-24 border-b border-stone-200 dark:border-navy-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="reveal visible mb-12 text-center lg:text-left">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-600 font-black mb-2 block">{t('report.input')}</span>
                    <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-navy-900 dark:text-stone-50 leading-tight">
                        {t('report.title')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 bg-white dark:bg-navy-800 rounded-3xl border border-stone-200 dark:border-navy-700 p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-saffron-500/10 transition-all"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-xs font-mono font-black text-navy-800 dark:text-stone-300 uppercase tracking-widest mb-4">
                                    {t('report.category')} <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`px-4 py-3 text-[10px] font-mono font-bold rounded-xl border transition-all flex items-center gap-2 ${formData.category === cat.id ? 'bg-saffron-500 border-saffron-600 text-navy-900 shadow-lg shadow-saffron-500/20 active:scale-95' : 'bg-stone-50 dark:bg-navy-900 border-stone-200 dark:border-navy-700 text-stone-600 dark:text-stone-400 hover:border-saffron-500/50'}`}>
                                            {getT(cat)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div><label className="block text-xs font-mono font-bold text-navy-800 dark:text-stone-400 uppercase tracking-widest mb-2">{t('report.street')} <span className="text-red-400">*</span></label><input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} placeholder={t('report.street_ph') || "e.g. MG Road, near crossing"} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-navy-700 dark:bg-navy-900 text-sm focus:border-saffron-500 outline-none transition-all dark:text-stone-100" /></div>
                                <div><label className="block text-xs font-mono font-bold text-navy-800 dark:text-stone-400 uppercase tracking-widest mb-2">{t('report.landmark')}</label><input type="text" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} placeholder={t('report.landmark_ph') || "e.g. Opposite Mall"} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-navy-700 dark:bg-navy-900 text-sm focus:border-saffron-500 outline-none transition-all dark:text-stone-100" /></div>
                            </div>

                            <div><label className="block text-xs font-mono font-bold text-navy-800 dark:text-stone-400 uppercase tracking-widest mb-2">{t('report.desc')} <span className="text-red-400">*</span></label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" placeholder={t('report.desc_ph') || "Detailed intelligence about the issue..."} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-navy-700 dark:bg-navy-900 text-sm focus:border-saffron-500 outline-none transition-all dark:text-stone-100 resize-none"></textarea></div>

                            <div className="grid sm:grid-cols-2 gap-6 items-end">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-navy-800 dark:text-stone-400 uppercase tracking-widest mb-2">{t('report.attach')}</label>
                                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-stone-200 dark:border-navy-700 hover:border-saffron-400 dark:hover:border-saffron-500 cursor-pointer transition-all bg-stone-50 dark:bg-navy-900 group/upload">
                                        <Upload className={`w-4 h-4 ${formData.file ? 'text-emerald-500' : 'text-stone-400 group-hover/upload:text-saffron-500'}`} />
                                        <span className="text-xs text-stone-500 truncate">{formData.file ? formData.file.name : t('report.click_upload')}</span>
                                        <input type="file" onChange={e => setFormData({...formData, file: e.target.files[0]})} className="hidden" />
                                    </label>
                                </div>
                                <div id="mini-map-trigger" className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-navy-700 bg-stone-50 dark:bg-navy-900 flex items-center justify-center gap-2 cursor-pointer hover:border-saffron-500/50 group/map transition-all">
                                    <MapPin className="w-4 h-4 text-saffron-500 group-hover/map:scale-110 transition-transform" />
                                    <span className="text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">{t('report.pin')}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-navy-800 dark:text-stone-400 uppercase tracking-widest mb-4">{t('report.priority')} <span className="text-red-400">*</span></label>
                                <div className="flex gap-2">
                                    {priorities.map(p => (
                                        <button key={p} type="button" onClick={() => setFormData({...formData, priority: p})} className={`flex-1 py-3 text-[10px] font-mono font-bold rounded-xl border transition-all ${formData.priority === p ? 'bg-navy-900 dark:bg-saffron-500 border-navy-900 dark:border-saffron-600 text-white dark:text-navy-900 shadow-xl' : 'bg-stone-50 dark:bg-navy-900 border-stone-200 dark:border-navy-700 text-stone-600 dark:text-stone-400'}`}>
                                            {t(`report.priority_${p.toLowerCase()}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-navy-900/50 rounded-2xl border border-stone-200 dark:border-navy-700">
                                <div>
                                    <span className="text-xs font-bold text-navy-900 dark:text-stone-200 uppercase tracking-widest">{t('report.anon')}</span>
                                    <p className="text-[10px] text-stone-400 mt-1 uppercase">{t('report.anon_desc')}</p>
                                </div>
                                <button type="button" onClick={() => setFormData({...formData, anonymous: !formData.anonymous})} className={`relative w-12 h-6 rounded-full transition-colors ${formData.anonymous ? 'bg-saffron-500' : 'bg-stone-300 dark:bg-navy-700'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.anonymous ? 'translate-x-6' : ''}`}></div>
                                </button>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-saffron-500 hover:bg-saffron-400 text-navy-900 font-black py-5 rounded-2xl text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-2xl shadow-saffron-500/20 active:scale-[0.99] flex items-center justify-center gap-3">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> {t('report.auth')}</>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        {!trackingId ? (
                            <div className="bg-white dark:bg-navy-800 rounded-3xl border border-stone-200 dark:border-navy-700 p-10 shadow-xl h-full flex flex-col items-center justify-center text-center group">
                                <div className="w-20 h-20 bg-navy-900 dark:bg-navy-700 rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <Satellite className="text-saffron-500 w-10 h-10 animate-pulse" />
                                </div>
                                <h3 className="font-display font-black text-2xl text-navy-900 dark:text-stone-50 mb-4 tracking-tight">{t('report.tracker')}</h3>
                                <p className="text-sm font-mono text-stone-500 uppercase tracking-widest mb-10 max-w-[280px] mx-auto">{t('report.waiting')}</p>
                                <div className="w-full space-y-6 text-left opacity-30 grayscale">
                                    {['Submitted', 'Review', 'Assigned', 'Resolved'].map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 border-b border-stone-100 dark:border-navy-700 pb-4 last:border-0"><div className="w-5 h-5 rounded-full bg-stone-200 dark:bg-navy-600"></div><div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">{s}</div></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-navy-800 rounded-3xl border-2 border-saffron-500 p-10 shadow-2xl animate-in zoom-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-display font-black text-2xl text-navy-900 dark:text-stone-50">Issue Tracker</h3>
                                    <span className="font-mono text-xs font-black bg-navy-900 text-saffron-500 px-4 py-2 rounded-xl shadow-lg">{trackingId}</span>
                                </div>
                                <div className="space-y-8">
                                    <TrackerStep icon={<FileText className="w-4 h-4" />} title={t('report.step1')} desc={t('report.step1_desc')} active time={t('report.just_now')} />
                                    <TrackerStep icon={<Search className="w-4 h-4" />} title={t('report.step2')} desc={t('report.step2_desc')} />
                                    <TrackerStep icon={<Wrench className="w-4 h-4" />} title={t('report.step3')} desc={t('report.step3_desc')} />
                                    <TrackerStep icon={<CircleCheck className="w-4 h-4" />} title={t('report.step4')} desc={t('report.step4_desc')} last />
                                </div>
                                <button onClick={() => setTrackingId(null)} className="mt-10 w-full py-4 text-[10px] font-mono font-black text-stone-400 hover:text-navy-900 dark:hover:text-stone-100 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                    {t('report.dismiss')} <Loader2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const TrackerStep = ({ icon, title, desc, active, time, last }) => (
    <div className={`flex gap-4 ${!last ? 'pb-8' : ''} relative`}>
        {!last && <div className={`absolute top-10 left-5 w-0.5 h-[calc(100%-40px)] ${active ? 'bg-saffron-500' : 'bg-stone-100 dark:bg-navy-700'}`}></div>}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-700 ${active ? 'bg-saffron-500 text-navy-900 scale-110 shadow-lg shadow-saffron-500/20' : 'bg-stone-100 dark:bg-navy-900 text-stone-300 dark:text-navy-700'}`}>
            {active ? <Check className="w-5 h-5 font-bold" /> : icon}
        </div>
        <div className="flex flex-col pt-1">
            <h4 className={`text-sm font-black uppercase tracking-tight ${active ? 'text-navy-900 dark:text-stone-50' : 'text-stone-400 dark:text-navy-700'}`}>{title}</h4>
            <p className={`text-[10px] font-mono mt-1 ${active ? 'text-stone-500 dark:text-saffron-400/80' : 'text-stone-300 dark:text-navy-800'}`}>{active ? time || desc : desc}</p>
        </div>
    </div>
);

export default ReportIssue;
