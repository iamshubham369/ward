import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { X, Layout, MapPin, Calendar, HardHat, CircleDollarSign, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectGenesisModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addProject, showToast } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name_en: '',
        name_hi: '',
        name_mr: '',
        category: 'Roads',
        dept_en: '',
        budget: '',
        start_date: '',
        deadline: '',
        contractor: '',
        lat: 21.145,
        lng: 79.088
    });

    // --- STRATEGIC LINGUISTIC SYNCHRONIZATION ---
    useEffect(() => {
        const timer = setTimeout(() => {
            if (form.name_en.length > 2) {
                const dict = {
                    'hi': { 
                        'Road': 'सड़क', 'Street': 'मार्ग', 'Main': 'मुख्य', 'Resurfacing': 'डामरीकरण', 
                        'Pipeline': 'पाइपलाइन', 'Water': 'जल', 'Supply': 'आपूर्ति', 'New': 'नयी',
                        'Construction': 'निर्माण', 'Repair': 'मरम्मत', 'Park': 'उद्यान', 'Garden': 'बगीचा',
                        'Maintenance': 'रखरखाव', 'Lighting': 'प्रकाश', 'Drainage': 'जल निकासी'
                    },
                    'mr': { 
                        'Road': 'रस्ता', 'Street': 'मार्ग', 'Main': 'मुख्य', 'Resurfacing': 'डांबरीकरण', 
                        'Pipeline': 'पाईपलाईन', 'Water': 'पाणी', 'Supply': 'पुरवठा', 'New': 'नवीन',
                        'Construction': 'बांधकाम', 'Repair': 'दुरुस्ती', 'Park': 'उद्यान', 'Garden': 'बाग',
                        'Maintenance': 'देखभाल', 'Lighting': 'दिवे', 'Drainage': 'सांडपाणी'
                    }
                };
                
                const translate = (text, lang) => {
                    let result = text;
                    Object.keys(dict[lang]).forEach(word => {
                        result = result.replace(new RegExp(word, 'gi'), dict[lang][word]);
                    });
                    return result;
                };

                setForm(prev => {
                    const newHi = translate(prev.name_en, 'hi');
                    const newMr = translate(prev.name_en, 'mr');
                    
                    // Only update if current field is empty or already a mock translation
                    return {
                        ...prev,
                        name_hi: (!prev.name_hi || prev.name_hi.includes('Verifying')) ? newHi : prev.name_hi,
                        name_mr: (!prev.name_mr || prev.name_mr.includes('Verifying')) ? newMr : prev.name_mr
                    };
                });
            }
        }, 800); // 800ms debounce protocol

        return () => clearTimeout(timer);
    }, [form.name_en]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await addProject({
            ...form,
            budget: parseFloat(form.budget),
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng)
        });
        if (success) {
            onClose();
            setForm({ name_en: '', name_hi: '', name_mr: '', category: 'Roads', dept_en: '', budget: '', start_date: '', deadline: '', contractor: '', lat: 21.145, lng: 79.088 });
        }
        setLoading(false);
    };

    const inputClasses = "w-full px-5 py-4 rounded-xl border border-stone-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-xs font-bold outline-none focus:border-saffron-500 transition-all dark:text-stone-100 shadow-sm";
    const labelClasses = "block text-[9px] font-mono font-black text-stone-500 dark:text-stone-400 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2";

    return (
        <div className="fixed inset-0 z-[40000] flex items-center justify-center p-6 bg-navy-950/80 backdrop-blur-xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-stone-50 dark:bg-navy-900 rounded-[3rem] w-full max-w-4xl shadow-2xl border border-white/20 dark:border-navy-700 relative flex flex-col max-h-[90vh]"
            >
                <div className="bg-navy-950 p-10 text-center relative shrink-0">
                    <button onClick={onClose} className="absolute top-8 right-8 text-stone-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                    <div className="w-16 h-16 bg-saffron-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <HardHat className="text-navy-900 w-8 h-8" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-stone-50 tracking-tight uppercase">{t('admin.genesis_title') || 'Strategic Project Genesis'}</h3>
                    <p className="text-[10px] font-mono text-saffron-500 uppercase tracking-widest mt-2 font-black italic">{t('admin.genesis_subtitle') || 'Initiating Municipal Infrastructure Node'}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-12 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 border-b border-stone-100 dark:border-navy-800 pb-2">{t('admin.id_node')}</h4>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>{t('modal.name_en')}</label>
                                <input type="text" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} required placeholder="e.g. MG Road Resurfacing" className={inputClasses} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>{t('modal.name_hi')}</label>
                                    <input type="text" value={form.name_hi} onChange={e => setForm({...form, name_hi: e.target.value})} required placeholder="नाम (हिंदी)" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{t('modal.name_mr')}</label>
                                    <input type="text" value={form.name_mr} onChange={e => setForm({...form, name_mr: e.target.value})} required placeholder="नाव (मराठी)" className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 pt-4 border-b border-stone-100 dark:border-navy-800 pb-2">{t('admin.strat_meta')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>{t('modal.category')}</label>
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClasses}>
                                    <option value="Roads">{t('cat.roads')}</option>
                                    <option value="Water Supply">{t('cat.water')}</option>
                                    <option value="Sanitation">{t('cat.sanitation')}</option>
                                    <option value="Electricity">{t('cat.elec')}</option>
                                    <option value="Parks & Admin">{t('cat.parks')}</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>{t('modal.dept_name')}</label>
                                <input type="text" value={form.dept_en} onChange={e => setForm({...form, dept_en: e.target.value})} required placeholder="e.g. PWD" className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>{t('modal.budget_l')} ({t('common.million')} ₹)</label>
                            <div className="relative">
                                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-500" />
                                <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} required placeholder="Amount" className={`${inputClasses} pl-12`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 border-b border-stone-100 dark:border-navy-800 pb-2">{t('admin.temp_spatial')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>{t('modal.start')}</label>
                                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>{t('modal.deadline')}</label>
                                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>{t('modal.contractor')}</label>
                            <input type="text" value={form.contractor} onChange={e => setForm({...form, contractor: e.target.value})} required placeholder="Contracting Company Name" className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>{t('admin.lat')}</label>
                                <input type="number" step="0.001" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>{t('admin.lng')}</label>
                                <input type="number" step="0.001" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} required className={inputClasses} />
                            </div>
                        </div>

                        <div className="pt-8">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-saffron-500 text-navy-900 font-black py-6 rounded-2xl text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-saffron-400 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.genesis_btn')}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>

                <style dangerouslySetInnerHTML={{ __html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E8A317; border-radius: 10px; }
                ` }} />
            </motion.div>
        </div>
    );
};

export default ProjectGenesisModal;
