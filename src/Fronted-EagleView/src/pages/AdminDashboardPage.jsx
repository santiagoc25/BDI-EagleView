/**
 * @fileoverview Main page for the administration panel.
 * @version 1.0.0
 * @description This component renders the main interface for the admin dashboard,
 * using a tab-based navigation system to switch between content management
 * and user list views. It includes transition animations and a logout button.
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ContentManagement from '../components/admin/ContentManagement';
import UserList from '../components/admin/UserList';
import { theme } from '../styles/theme';

/**
 * @description The main styled wrapper for the entire admin dashboard page.
 */
const AdminWrapper = styled.div`
  padding: 40px 60px;
  color: #e5e5e5;
  min-height: 100vh;
  background: #141414;
  font-family: 'Poppins', sans-serif;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

/**
 * @description The styled header containing the panel title and logout button.
 */
const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #303030;

  h1 {
    font-size: 2.8rem;
    font-weight: 600;
    color: white;
    margin: 0;
  }
`;

/**
 * @description A styled button for the logout action.
 */
const LogoutButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e5e5;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #444;
    color: white;
    border-color: #777;
  }
`;

/**
 * @description The styled navigation bar containing the tab buttons.
 */
const AdminNav = styled.nav`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  border-bottom: 1px solid #303030;
`;

/**
 * @description An individual navigation button for each tab.
 * Its appearance changes if the `$isActive` prop is true.
 */
const NavButton = styled.button`
  padding: 15px 30px;
  background: transparent;
  color: ${props => (props.$isActive ? 'white' : '#a0a0a0')};
  border: none;
  border-bottom: 3px solid ${props => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    background: #1f1f1f;
  }
`;

/**
 * Functional component representing the admin dashboard page.
 * @param {object} props - The component's properties.
 * @param {function} props.onLogout - Function to handle the logout event.
 * @returns {JSX.Element} The layout of the admin dashboard.
 */
const AdminDashboardPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <AdminWrapper>
      <AdminHeader>
        <h1>Panel de Administrador</h1>
        <LogoutButton onClick={onLogout} theme={theme}>Cerrar Sesión</LogoutButton>
      </AdminHeader>
      
      <AdminNav>
        <NavButton $isActive={activeTab === 'content'} onClick={() => setActiveTab('content')} theme={theme}>
          Gestionar Contenido
        </NavButton>
        <NavButton $isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} theme={theme}>
          Ver Usuarios
        </NavButton>
      </AdminNav>
      
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'users' && <UserList />}
        </motion.main>
      </AnimatePresence>
    </AdminWrapper>
  );
};

export default AdminDashboardPage;