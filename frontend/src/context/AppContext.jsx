import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authenticateWithGoogle } from '../utils/firebase';

export const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('wcip_theme') === 'dark');
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('wcip_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    });
    
    const [issues, setIssues] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [view, setView] = useState('map');
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    // Global Preference Persistence
    useEffect(() => {
        localStorage.setItem('wcip_theme', darkMode ? 'dark' : 'light');
        if (darkMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, [darkMode]);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // --- RECOVERY & AUTH PROTOCOLS ---
    
    const fetchIssues = async () => {
        try {
            const res = await axios.get(`${API_BASE}/issues`);
            setIssues(res.data);
        } catch (e) { console.error('Fetch Protocol Failure: Issues node offline'); }
    };

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${API_BASE}/projects`);
            setProjects(res.data);
        } catch (e) { console.error('Fetch Protocol Failure: Project nodes offline'); }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE}/notifications`);
            setNotifications(res.data);
        } catch (e) { console.error('Fetch Protocol Failure: Advisory nodes offline'); }
    };

    useEffect(() => {
        fetchIssues();
        fetchProjects();
        fetchNotifications();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('wcip_user', JSON.stringify(res.data.user));
                showToast(`Agent Detected: ${res.data.user.name}`, 'success');
                return true;
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'Authentication Code Rejected', 'error');
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            // High-Security Federated Handshake
            const googleUser = await authenticateWithGoogle();
            
            // Link Identity Node to Ward-14 Metadata Matrix
            const res = await axios.post(`${API_BASE}/auth/google`, googleUser);
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('wcip_user', JSON.stringify(res.data.user));
                showToast(`Firebase Protocol Verified: ${res.data.user.name}`, 'success');
                return true;
            }
        } catch (e) {
            showToast('Firebase Handshake Refused: Check Config Protocols', 'error');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/register`, userData);
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('wcip_user', JSON.stringify(res.data.user));
                showToast('Deployment Successful: Agent Node Linked', 'success');
                return true;
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'Enrollment Identity Conflict', 'error');
            return false;
        }
    };

    const getSecurityQuestion = async (email) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/get-question`, { email });
            return res.data.question;
        } catch (e) {
            showToast('Identity Identity Node Not Found', 'error');
            return null;
        }
    };

    const recoverPassword = async (recoveryData) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/recover`, recoveryData);
            if (res.data.success) {
                showToast('Key Synchronization Complete', 'success');
                return true;
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'Verification Answer Mismatch', 'error');
            return false;
        }
    };

    const updatePassword = async (userId, answer, newPassword) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/update-password`, { userId, answer, newPassword });
            if (res.data.success) {
                showToast('Security Key Modification Finalized', 'success');
                return true;
            }
        } catch (e) {
            showToast('Authorization Denied: Verification Answer Incorrect', 'error');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('wcip_user');
        showToast('System session terminated', 'info');
    };

    // Exported Strategic State
    const addProject = async (projectData) => {
        try {
            const res = await axios.post(`${API_BASE}/projects`, projectData);
            if (res.data.success) {
                fetchProjects();
                showToast('Strategic Project Commissioned', 'success');
                return true;
            }
        } catch (e) {
            showToast('Project Genesis Fault', 'error');
            return false;
        }
    };

    const updateProject = async (projectData) => {
        try {
            const res = await axios.put(`${API_BASE}/projects/${projectData.id}`, projectData);
            if (res.data.success) {
                fetchProjects();
                showToast('Strategic Metadata Synchronized', 'success');
                return true;
            }
        } catch (e) {
            showToast('Modification Access Denied', 'error');
            return false;
        }
    };

    const value = {
        darkMode, setDarkMode,
        user, setUser, 
        login, loginWithGoogle, register, logout, updatePassword, getSecurityQuestion, recoverPassword,
        issues, setIssues, fetchIssues,
        projects, addProject, updateProject, setProjects, fetchProjects,
        selectedProjectId, setSelectedProjectId,
        view, setView,
        notifications, fetchNotifications,
        toast, showToast, API_BASE
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
