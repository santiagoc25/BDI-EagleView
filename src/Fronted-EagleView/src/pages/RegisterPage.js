/**
 * @fileoverview Página de registro de nuevos usuarios.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description Este componente renderiza la página de registro, que actúa como un
 * contenedor para el formulario de registro y un enlace para volver a la
 * página de inicio de sesión.
 */

import React from 'react';
import styled from 'styled-components';
import RegisterForm from '../components/views/RegisterForm';
import Background from '../components/views/Background';
import { theme } from '../styles/theme';

/**
 * @description Contenedor principal estilizado que ocupa toda la pantalla y centra su contenido.
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
 * @description Enlace estilizado para la navegación de vuelta a la página de login.
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
 * Componente funcional que representa la página de registro.
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onRegister - Función callback que se ejecuta al enviar el formulario de registro.
 * @param {function} props.onBackToLogin - Función callback para el enlace de "Volver".
 * @returns {JSX.Element} El layout de la página de registro.
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