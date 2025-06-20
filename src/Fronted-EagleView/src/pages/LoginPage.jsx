/**
 * @fileoverview Login page for the application.
 * @version 1.0.0
 * @description This component renders the login page, which acts as a container
 * for the login form, a back button, and an optional link to navigate
 * to the registration page.
 */
import React from 'react';
import styled from 'styled-components';
import LoginForm from '../components/views/LoginForm';
import Background from '../components/views/Background';
import { theme } from '../styles/theme';

/**
 * @description A styled main wrapper that fills the viewport and centers its content.
 */
const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

/**
 * @description A styled button for navigating back, positioned at the top-left corner.
 */
const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 40px;
  background: transparent;
  border: none;
  color: ${theme.colors.grey};
  font-size: 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${theme.colors.white};
    transform: scale(1.2);
  }
`;

/**
 * @description A styled paragraph containing the link to switch to the registration page.
 */
const SwitchToRegisterLink = styled.p`
  position: absolute;
  bottom: 40px;
  color: #aaa;
  
  span {
    color: white;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

/**
 * Functional component representing the login page.
 * @param {object} props - The component's properties.
 * @param {string} props.role - The role for which the user is logging in ('user' or 'admin').
 * @param {function} props.onLogin - Callback function executed on form submission.
 * @param {function} props.onBack - Callback function for the back button.
 * @param {function} props.onSwitchToRegister - Callback function for the register link.
 * @returns {JSX.Element} The layout of the login page.
 */
const LoginPage = ({ role, onLogin, onBack, onSwitchToRegister }) => {
  const showRegisterLink = role === 'user';

  return (
    <PageWrapper>
      <Background />
      <BackButton onClick={onBack}>←</BackButton>
      <LoginForm role={role} onSubmit={onLogin} />
      {showRegisterLink && (
        <SwitchToRegisterLink theme={theme}>
          ¿No tienes cuenta? <span onClick={onSwitchToRegister}>Regístrate</span>
        </SwitchToRegisterLink>
      )}
    </PageWrapper>
  );
};

export default LoginPage;