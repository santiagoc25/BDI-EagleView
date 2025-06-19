
 // App.jsx: Main component. Manages the app's view flow  by acting as a state machine.

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './services/api';
import { jwtDecode } from 'jwt-decode';

// Views and Pages
import IntroAnimation from './components/views/IntroAnimation';
import RoleSelector from './components/views/RoleSelector';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {

  // State to control the current view of the application.
  const [appState, setAppState] = useState('loading');

  // Stores the role selected by the user before login.
  const [selectedRole, setSelectedRole] = useState(null);

  // On app load, check if an active session already exists to redirect.
  const fetchUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken.user?.roles?.includes('administrador');
        
        if (isAdmin) {
          setAppState('admin_dashboard');
        } else {
          setAppState('dashboard');
        }
      } catch (error) {
        console.error("Error decodificando el token:", error);
        localStorage.removeItem('authToken');
        setAppState('intro');
      }
    } else {
      setAppState('intro');
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  // Handlers that change the app state to navigate between views.
  const handleIntroComplete = () => {
    if (appState === 'intro') setAppState('role_selection');
  };

  const handleRoleSelected = (role) => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await api.login(credentials);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        fetchUserRole();  // Redirect to the corresponding dashboard.
      } else {
        alert('No se recibió un token de autenticación.');
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Credenciales incorrectas."}`);
    }
  };

  const handleRegister = async (userData) => {
    try {
      await api.register(userData);
      alert("¡Registro exitoso! Por favor, inicia sesión.");
      setAppState('login');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "No se pudo completar el registro."}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAppState('role_selection');
  };

  const handleGoBack = () => setAppState('role_selection');
  const switchToRegister = () => setAppState('register');
  const switchToLogin = () => setAppState('login');

  return (
    // AnimatePresence handles animations when views change.
    <AnimatePresence mode="wait">
      {appState === 'loading' && <div key="loading"></div>}
      {appState === 'intro' && (<IntroAnimation key="intro" onAnimationComplete={handleIntroComplete} />)}
      {appState === 'role_selection' && (<motion.div key="role-selector"><RoleSelector onRoleSelect={handleRoleSelected} /></motion.div>)}
      {appState === 'login' && (<motion.div key="login-page"><LoginPage role={selectedRole} onLogin={handleLogin} onBack={handleGoBack} onSwitchToRegister={switchToRegister} /></motion.div>)}
      {appState === 'register' && (<motion.div key="register-page"><RegisterPage onRegister={handleRegister} onBackToLogin={switchToLogin} /></motion.div>)}
      {appState === 'dashboard' && (<motion.div key="dashboard"><DashboardPage onLogout={handleLogout} /></motion.div>)}
      {appState === 'admin_dashboard' && (<motion.div key="admin_dashboard"><AdminDashboardPage onLogout={handleLogout} /></motion.div>)}
    </AnimatePresence>
  );
}

export default App;