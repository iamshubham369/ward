import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { X, Plus, Rocket, HardHat, IndianRupee, Calendar, Briefcase, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

const ProjectModal = ({ isOpen, onClose }) => {
    const { language, API_BASE, fetchProjects, showToast } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name_en: '', category: 'Roads', dept_en: '', budget: '', start_date: '', deadline: '', contractor: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/projects`, {
                ...formData,
                name_hi: formData.name_en, // Auto-filling to avoid backend null constraints
                name_mr: formData.name_en
            });
            showToast('Strategic Deployment Successful', 'success');
            fetchProjects();
            onClose();
            setFormData({ name_en: '', category: 'Roads', dept_en: '', budget: '', start_date: '', deadline: '', contractor: '' });
        } catch (err) {
            showToast('System Error: Sync Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-navy-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-stone-200 dark:border-navy-700">
                <div className="px-10 py-10 border-b border-stone-100 dark:border-navy-800 flex items-center justify-between sticky top-0 bg-white dark:bg-navy-900 z-10">
                   <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-saffron-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-saffron-500/30 font-black"><Plus className="w-8 h-8 text-navy-900" /></div>
                       <div>
                           <h3 className="font-display font-black text-2xl text-navy-900 dark:text-stone-50 leading-tight tracking-tight uppercase">Initiate Protocol</h3>
                           <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black mt-1 opacity-60 italic">Strategic Deployment Center</p>
                       </div>
                   </div>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-navy-800 text-stone-400 hover:text-navy-900 dark:hover:text-stone-100 transition-all active:scale-95 border border-transparent hover:border-stone-200 dark:hover:border-navy-700 shadow-sm"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <InputGroup label="Project Name" val={formData.name_en} set={v => setFormData({...formData, name_en: v})} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10">
                        <div className="group">
                             <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-[0.3em] mb-4 group-focus-within:text-saffron-500 transition-colors flex items-center gap-2 italic">Category <Zap className="w-3 h-3" /></label>
                             <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-stone-200 dark:border-navy-800 dark:bg-navy-950 text-sm outline-none focus:border-saffron-500 transition-all bg-stone-50 dark:text-stone-100 shadow-inner appearance-none font-bold">
                                <option value="Roads">ROADS</option>
                                <option value="Water Supply">WATER SUPPLY</option>
                                <option value="Electricity">ELECTRICITY</option>
                                <option value="Sanitation">SANITATION</option>
                            </select>
                        </div>
                        <InputGroup label="Dept Name" val={formData.dept_en} set={v => setFormData({...formData, dept_en: v})} icon={<Briefcase className="w-3 h-3" />} />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <InputGroup label="Budget (L)" type="number" val={formData.budget} set={v => setFormData({...formData, budget: v})} icon={<IndianRupee className="w-3 h-3" />} />
                        <InputGroup label="Start" type="date" val={formData.start_date} set={v => setFormData({...formData, start_date: v})} icon={<Calendar className="w-3 h-3" />} />
                        <InputGroup label="Deadline" type="date" val={formData.deadline} set={v => setFormData({...formData, deadline: v})} icon={<Calendar className="w-3 h-3" />} />
                    </div>

                    <InputGroup label="Contractor / Agency" val={formData.contractor} set={v => setFormData({...formData, contractor: v})} icon={<HardHat className="w-3 h-3" />} />

                    <button type="submit" disabled={loading} className="w-full bg-navy-900 dark:bg-saffron-500 text-white dark:text-navy-900 font-black py-6 rounded-3xl text-xs font-mono uppercase tracking-[0.4em] hover:bg-navy-800 dark:hover:bg-saffron-400 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform" /> Deploy Strategic Dashboard</>}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 translate-x-[-101%] group-hover:translate-x-[101%] transition-transform duration-1000"></div>
                    </button>
                </form>
            </div>
        </div>
    );
};

const InputGroup = ({ label, val, set, type = 'text', icon }) => (
    <div className="group">
        <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-[0.3em] mb-4 group-focus-within:text-saffron-500 transition-colors flex items-center gap-2 italic">{label} {icon}</label>
        <input type={type} value={val} onChange={e => set(e.target.value)} required className="w-full px-5 py-4 rounded-2xl border border-stone-200 dark:border-navy-800 dark:bg-navy-950 text-sm outline-none focus:border-saffron-500 transition-all bg-stone-50 dark:text-stone-100 shadow-inner font-bold" />
    </div>
);

export default ProjectModal;
