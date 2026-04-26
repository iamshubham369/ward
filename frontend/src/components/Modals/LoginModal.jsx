import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { X, ShieldHalf, User, Key, Mail, ChevronRight, RefreshCw, Loader2, ShieldQuestion, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose }) => {
    const { login, loginWithGoogle, register, updatePassword, getSecurityQuestion, recoverPassword, user, language, showToast } = useContext(AppContext);
    const { t } = useTranslation();
    
    // Modes: login, register, forgot_step1, forgot_step2, change
    const [mode, setMode] = useState('login'); 
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('What was your first pet?');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [recoveryQuestion, setRecoveryQuestion] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMode(user ? 'change' : 'login');
            setLoading(false);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const resetMode = (newMode) => {
        setMode(newMode);
        setPassword('');
        setConfirmPassword('');
        setSecurityAnswer('');
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const success = await loginWithGoogle();
        if (success) onClose();
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);

        try {
            if (mode === 'forgot_step1') {
                const question = await getSecurityQuestion(email);
                if (question) {
                    setRecoveryQuestion(question);
                    setMode('forgot_step2');
                }
            } else if (mode === 'login') {
                const success = await login(email, password);
                if (success) onClose();
            } else if (mode === 'register') {
                if (password !== confirmPassword) throw new Error('Key mismatch: Passwords do not align');
                const success = await register({ name, email, password, security_question: securityQuestion, security_answer: securityAnswer });
                if (success) onClose();
            } else if (mode === 'forgot_step2') {
                if (password !== confirmPassword) throw new Error('Key mismatch: Passwords do not align');
                const success = await recoverPassword({ email, answer: securityAnswer, newPassword: password });
                if (success) resetMode('login');
            } else if (mode === 'change') {
                if (password !== confirmPassword) throw new Error('Key mismatch: Passwords do not align');
                const success = await updatePassword(user.id, securityAnswer, password);
                if (success) resetMode('login');
            }
        } catch (err) {
            showToast(err.message || 'Operational Fault in Protocol', 'error');
        } finally {
            // Safety timeout to prevent infinite loading state
            setTimeout(() => setLoading(false), 500);
        }
    };

    const inputClasses = "w-full px-5 py-4 rounded-2xl border border-stone-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-xs font-bold outline-none focus:border-saffron-500 transition-all dark:text-stone-100 shadow-sm";
    const labelClasses = "block text-[9px] font-mono font-black text-stone-500 dark:text-stone-400 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2";

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-xl animate-in fade-in duration-500">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-stone-50 dark:bg-navy-800 rounded-[3rem] w-full max-w-lg shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20 dark:border-navy-700 relative flex flex-col max-h-[90vh]"
            >
                {/* Header (Sticky) */}
                <div className="bg-navy-900 p-10 text-center relative shrink-0">
                    <button onClick={onClose} className="absolute top-8 right-8 text-stone-500 hover:text-white transition-all active:scale-90 z-20"><X className="w-6 h-6" /></button>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-saffron-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-saffron-500/30">
                            {mode === 'login' ? <ShieldHalf className="text-navy-900 w-8 h-8" /> : mode === 'register' ? <Fingerprint className="text-navy-900 w-8 h-8" /> : <ShieldQuestion className="text-navy-900 w-8 h-8" />}
                        </div>
                        <h3 className="font-display font-black text-2xl text-stone-50 tracking-tight uppercase">
                            {mode === 'login' ? t('login.identity_control') : mode === 'register' ? t('login.protocol_genesis') : t('login.security_clearance')}
                        </h3>
                        <p className="text-[9px] font-mono text-saffron-500 uppercase tracking-widest mt-2 opacity-80 font-black italic">
                            {t('login.verifying')}
                        </p>
                    </div>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-transparent">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'register' && (
                            <div className="group">
                                <label className={labelClasses}><User className="w-3.5 h-3.5" /> {t('login.fullname')}</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={t('login.agent_name')} className={inputClasses} />
                            </div>
                        )}

                        {(mode !== 'change' && mode !== 'forgot_step2') && (
                            <div className="group">
                                <label className={labelClasses}><Mail className="w-3.5 h-3.5" /> {t('login.email')}</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={t('login.email_placeholder')} className={inputClasses} />
                            </div>
                        )}

                        {mode === 'forgot_step2' && (
                            <div className="bg-navy-900/5 dark:bg-navy-900/40 p-5 rounded-2xl border border-navy-500/10 mb-4">
                                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-1">{t('login.question')}</p>
                                <p className="text-sm font-bold text-navy-900 dark:text-stone-100">{recoveryQuestion}</p>
                            </div>
                        )}

                        {mode === 'change' && (
                            <div className="bg-navy-900/5 dark:bg-navy-900/40 p-5 rounded-2xl border border-navy-500/10 mb-4">
                                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-1">Identity Question:</p>
                                <p className="text-sm font-bold text-navy-900 dark:text-stone-100">{user?.security_question || 'Protocol Failure'}</p>
                            </div>
                        )}

                        {((mode === 'register' || mode === 'forgot_step2' || mode === 'change')) && (
                            <div className="group">
                                <label className={labelClasses}><ShieldQuestion className="w-3.5 h-3.5" /> {mode === 'register' ? t('login.strat_question') : t('login.id_answer')}</label>
                                {mode === 'register' && (
                                    <select value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} className={`${inputClasses} mb-3`}>
                                        <option>{t('login.pet')}</option>
                                        <option>{t('login.hero')}</option>
                                        <option>{t('login.birth')}</option>
                                    </select>
                                )}
                                <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required placeholder={t('login.answer_placeholder')} className={inputClasses} />
                            </div>
                        )}

                        {(mode !== 'forgot_step1') && (
                            <div className="group">
                                <label className={labelClasses}><Key className="w-3.5 h-3.5" /> {mode === 'forgot_step2' || mode === 'change' ? t('login.new_key') : t('login.security_key')}</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClasses} />
                            </div>
                        )}

                        {(mode === 'register' || mode === 'forgot_step2' || mode === 'change') && (
                            <div className="group">
                                <label className={labelClasses}><RefreshCw className="w-3.5 h-3.5" /> {t('login.verify_key')}</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" className={inputClasses} />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="w-full bg-navy-900 dark:bg-saffron-500 text-white dark:text-navy-900 font-black py-5 rounded-2xl text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-navy-800 dark:hover:bg-saffron-400 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? t('login.authenticate') : mode === 'forgot_step1' ? t('login.synthesize') : t('login.init_protocol')}
                            {!loading && <ChevronRight className="w-4 h-4" />}
                        </button>

                        {(mode === 'login' || mode === 'register') && (
                            <button 
                                type="button"
                                onClick={handleGoogleLogin} 
                                className="w-full bg-white dark:bg-navy-900 text-navy-900 dark:text-stone-100 font-bold py-5 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] border border-stone-200 dark:border-navy-700 hover:bg-stone-50 dark:hover:bg-navy-950 transition-all flex items-center justify-center gap-4 mt-2"
                            >
                                <svg viewBox="0 0 48 48" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#4285F4"/><path d="m6.3 12.9 7.2 5.3C15.2 15.1 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 15.8 2 8.9 6.2 6.3 12.9z" fill="#EA4335"/><path d="M24 46c5.9 0 11.1-2.2 15-5.9l-7.1-6c-2.2 1.6-5 2.5-7.9 2.5-6.5 0-11.9-4.2-13.9-10l-7.3 5.6C7.9 39.8 15.4 46 24 46z" fill="#34A853"/><path d="M10.1 26.6c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6l-7.2-5.3C1.1 13.9 0 18.8 0 24s1.1 10.1 2.9 13.9l7.2-5.3z" fill="#FBBC05"/></svg>
                                {t('login.google_sign_in')}
                            </button>
                        )}
                    </form>



                    {/* Navigation Nodes */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            {mode === 'login' ? (
                                <>
                                    <button type="button" onClick={() => resetMode('register')} className="text-[9px] font-mono font-bold text-stone-500 hover:text-saffron-500 uppercase tracking-widest">{t('login.new_enrollment')}</button>
                                    <button type="button" onClick={() => resetMode('forgot_step1')} className="text-[9px] font-mono font-bold text-stone-500 hover:text-saffron-500 uppercase tracking-widest">{t('login.lost_key')}</button>
                                </>
                            ) : (
                                <button type="button" onClick={() => resetMode('login')} className="text-[9px] font-mono font-black text-saffron-500 uppercase tracking-widest">{t('login.return_base')}</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* CSS for custom scrollbar */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E8A317; border-radius: 10px; }
                    .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #E8A317 transparent; }
                ` }} />
            </motion.div>
        </div>
    );
};

export default LoginModal;
