import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { X, Layout, MapPin, Calendar, HardHat, CircleDollarSign, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectGenesisModal = ({ isOpen, onClose }) => {
    const { addProject, showToast } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name_en: '',
        category: 'Roads',
        dept_en: '',
        budget: '',
        start_date: '',
        deadline: '',
        contractor: '',
        lat: 21.145,
        lng: 79.088
    });

    // Translations are now fully handled natively by the Google Translate API widget.

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await addProject({
            ...form,
            name_hi: form.name_en,
            name_mr: form.name_en,
            budget: parseFloat(form.budget),
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng)
        });
        if (success) {
            onClose();
            setForm({ name_en: '', category: 'Roads', dept_en: '', budget: '', start_date: '', deadline: '', contractor: '', lat: 21.145, lng: 79.088 });
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
                    <h3 className="font-display font-black text-2xl text-stone-50 tracking-tight uppercase">Strategic Project Genesis</h3>
                    <p className="text-[10px] font-mono text-saffron-500 uppercase tracking-widest mt-2 font-black italic">Initiating Municipal Infrastructure Node</p>
                </div>

                <form onSubmit={handleSubmit} className="p-12 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 border-b border-stone-100 dark:border-navy-800 pb-2">Identification Node</h4>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>Project Name</label>
                                <input type="text" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} required placeholder="e.g. MG Road Resurfacing" className={inputClasses} />
                            </div>
                        </div>

                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 pt-4 border-b border-stone-100 dark:border-navy-800 pb-2">Strategic Metadata</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Category</label>
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClasses}>
                                    <option>Roads</option>
                                    <option>Water Supply</option>
                                    <option>Sanitation</option>
                                    <option>Lighting</option>
                                    <option>Parks</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Department</label>
                                <input type="text" value={form.dept_en} onChange={e => setForm({...form, dept_en: e.target.value})} required placeholder="e.g. PWD" className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Budget (Million ₹)</label>
                            <div className="relative">
                                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-500" />
                                <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} required placeholder="Amount" className={`${inputClasses} pl-12`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-2 border-b border-stone-100 dark:border-navy-800 pb-2">Temporal & Spatial Parameters</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Kick-off Date</label>
                                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Target Deadline</label>
                                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Contractor Node</label>
                            <input type="text" value={form.contractor} onChange={e => setForm({...form, contractor: e.target.value})} required placeholder="Contracting Company Name" className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Latitude (Lat)</label>
                                <input type="number" step="0.001" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Longitude (Lng)</label>
                                <input type="number" step="0.001" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} required className={inputClasses} />
                            </div>
                        </div>

                        <div className="pt-8">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-saffron-500 text-navy-900 font-black py-6 rounded-2xl text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-saffron-400 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Project Commissioning"}
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
