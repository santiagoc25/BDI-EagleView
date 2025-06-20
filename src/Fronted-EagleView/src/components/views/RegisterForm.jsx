/**
 RegisterForm.jsx: A form for new user registration.
 It manages the input fields and validates data before submission.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

// - Styled Components -

// Main form container with a glassmorphism effect.
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

/*
  Renders the user registration form.
  - props.onSubmit - Callback function executed on form submission. Receives the user data.
 */
const RegisterForm = ({ onSubmit }) => {
  // State hooks to manage the form's input field values.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (event) => {
    // Prevents the form's default behavior (page reload).
    event.preventDefault();

    // Basic validation to ensure required fields are not empty.
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert('Por favor, completa el nombre de usuario, email y contraseña.');
      return;
    }
     // Calls the - onSubmit - prop (from the parent component) with the form data.
    onSubmit({ username, email, password, age: age ? parseInt(age) : null });
  };

  return (
    // Renders the form, binding state values to the - InputField - components.
    <FormWrapper onSubmit={handleSubmit}>
      <Title>Crear Cuenta de Usuario</Title>
      <InputField 
        type="text" 
        placeholder="Nombre de usuario" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
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
      <InputField 
        type="number" 
        min="1"
        placeholder="Edad" 
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <Button type="submit">Registrarse</Button>
    </FormWrapper>
  );
};

export default RegisterForm;