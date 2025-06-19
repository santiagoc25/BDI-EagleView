/**
 * @fileoverview Registration page for new users.
 * @version 1.0.0
 * @description This component renders the registration page, which acts as a
 * container for the registration form and a link to return to the
 * login page.
 */
import React from 'react';
import styled from 'styled-components';
import RegisterForm from '../components/views/RegisterForm';
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
 * @description A styled link for navigating back to the login page.
 */
const BackToLoginLink = styled.a`
  position: absolute;
  top: 40px;
  left: 40px;
  color: ${theme.colors.grey};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: white;
  }
`;

/**
 * Functional component representing the registration page.
 * @param {object} props - The component's properties.
 * @param {function} props.onRegister - Callback function executed on form submission.
 * @param {function} props.onBackToLogin - Callback function for the "Back" link.
 * @returns {JSX.Element} The layout of the registration page.
 */
const RegisterPage = ({ onRegister, onBackToLogin }) => {
  return (
    <PageWrapper>
      <Background />
      <BackToLoginLink onClick={onBackToLogin}>← Volver</BackToLoginLink>
      <RegisterForm onSubmit={onRegister} />
    </PageWrapper>
  );
};

export default RegisterPage;