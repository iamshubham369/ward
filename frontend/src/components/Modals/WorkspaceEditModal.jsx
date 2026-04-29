import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const WorkspaceEditModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { API_BASE, currentWorkspace, fetchWorkspaceData, showToast } = useContext(AppContext);
    
    const [formData, setFormData] = useState({
        city: '',
        ward_name: '',
        admin_name: '',
        admin_email: '',
        contact_number: '',
        population_estimate: '',
        ward_description: '',
        theme: 'Tactical Dark'
    });
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentWorkspace) {
            setFormData({
                city: currentWorkspace.city || '',
                ward_name: currentWorkspace.ward_name || '',
                admin_name: currentWorkspace.admin_name || '',
                admin_email: currentWorkspace.admin_email || '',
                contact_number: currentWorkspace.contact_number || '',
                population_estimate: currentWorkspace.population_estimate || '',
                ward_description: currentWorkspace.ward_description || '',
                theme: currentWorkspace.theme || 'Tactical Dark'
            });
        }
    }, [currentWorkspace]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`${API_BASE}/workspaces/${currentWorkspace.id}`, formData);
            await fetchWorkspaceData(currentWorkspace.id);
            showToast('Workspace metadata successfully synchronized', 'success');
            onClose();
        } catch (error) {
            console.error('Failed to update workspace', error);
            showToast('Failed to push updates to central node', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-navy-800 bg-navy-950/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center text-saffron-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-display font-black text-xl text-stone-100 uppercase tracking-tight">Personalize Workspace</h2>
                            <p className="text-[10px] font-mono text-saffron-500 uppercase tracking-widest">{currentWorkspace?.id} CONFIGURATION</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg bg-navy-800 text-stone-400 hover:text-white transition-colors border border-navy-700"><X className="w-5 h-5" /></button>
                </div>

                <div className="overflow-y-auto p-6 md:p-8 flex-1">
                    <form id="edit-workspace-form" onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">City / Municipality</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Ward Number / Name</label>
                                <input type="text" name="ward_name" value={formData.ward_name} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Administrator Name</label>
                                <input type="text" name="admin_name" value={formData.admin_name} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Administrator Email</label>
                                <input type="email" name="admin_email" value={formData.admin_email} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Contact Number</label>
                                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Population Estimate</label>
                                <input type="number" name="population_estimate" value={formData.population_estimate} onChange={handleChange} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Ward Description / Status</label>
                            <textarea name="ward_description" value={formData.ward_description} onChange={handleChange} rows="3" className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all"></textarea>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Aesthetic Profile</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Tactical Dark', 'Civic Light', 'Cybernetic', 'Minimalist'].map((tOption) => (
                                    <label key={tOption} className={`cursor-pointer border ${formData.theme === tOption ? 'border-saffron-500 bg-saffron-500/10' : 'border-navy-800 bg-navy-950'} rounded-xl p-3 text-center transition-all hover:border-saffron-500/50`}>
                                        <input type="radio" name="theme" value={tOption} checked={formData.theme === tOption} onChange={handleChange} className="sr-only" />
                                        <span className={`text-xs font-bold ${formData.theme === tOption ? 'text-saffron-500' : 'text-stone-400'}`}>{tOption}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-navy-800 bg-navy-950/50 shrink-0 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-stone-300 hover:bg-navy-800 transition-colors">Cancel</button>
                    <button type="submit" form="edit-workspace-form" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-saffron-500 text-navy-900 font-black hover:bg-saffron-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? 'Syncing...' : 'Save Configuration'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default WorkspaceEditModal;
