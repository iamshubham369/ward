import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import WardDashboard from './pages/WardDashboard';
import MasterAdmin from './pages/MasterAdmin';

const App = () => (
    <AppProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/ward/:wardId" element={<WardDashboard />} />
                <Route path="/master" element={<MasterAdmin />} />
            </Routes>
        </Router>
    </AppProvider>
);

export default App;
