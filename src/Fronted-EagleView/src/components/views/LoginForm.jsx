/*
 LoginForm.jsx: A form for user login.
 It validates that fields are not empty and submits the credentials.
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { theme } from '../../styles/theme';

// - Styled Components -
// Form container with a glassmorphism effect.
const FormWrapper = styled(motion.form)`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: rgba(10, 10, 10, 0.7);
  padding: 40px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// The form's title.
const Title = styled.h2`
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

// Link to switch to the registration form.
const SwitchFormLink = styled.p`
  color: ${theme.colors.grey};
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.white};
    text-decoration: underline;
  }
`;

/*
 - props.role - The user's role, to conditionally show the register link.
 - props.onSubmit - Callback executed with credentials on form submission.
 - props.onSwitchToRegister - Callback to switch to the registration view.
 */

const LoginForm = ({ role, onSubmit, onSwitchToRegister }) => {
  // State for the email and password fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    // Prevents the page from reloading on form submission.
    event.preventDefault();

   
    // Simple validation: ensures fields are not empty.
    if (!email.trim() || !password.trim()) {
      alert('Por favor, completa todos los campos.'); 
      return;  // Stops execution if validation fails.
    }

     // If validation passes, call the parent component's function.
    onSubmit({ email, password });
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Title> Iniciar Sesión</Title>
      <InputField 
        type="email" 
        placeholder="Correo electrónico" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <InputField 
        type="password" 
        placeholder="Contraseña" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Ingresar</Button>
    {/*The link to register is only shown if the role is 'user'. */}
    {role === 'user' && (
        <SwitchFormLink onClick={onSwitchToRegister}>
        </SwitchFormLink>
      )}
    </FormWrapper>
  );
};

export default LoginForm;