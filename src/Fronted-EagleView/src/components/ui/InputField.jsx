/**
 * InputField.jsx: A reusable UI component for a text input field.
 * It centralizes styles for a consistent look and feel across the app.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// The styled input element.
const Input = styled.input`
  width: 100%;
  padding: 15px 10px;
  background: transparent;
  border: none;
  // Bottom border that changes color on focus.
  border-bottom: 2px solid ${theme.colors.grey};
  color: ${theme.colors.white};
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;

  // Styles applied when the input is active (in focus).
  &:focus {
    outline: none;
    border-bottom-color: ${theme.colors.primary};
  }
`;

/**
 * Renders a styled input field.
 * Accepts all standard HTML <input> props 
 */
const InputField = (props) => {
  // Spreads all received props directly onto the styled component.
  // This makes it fully flexible and reusable.
  return <Input {...props} />;
};

export default InputField;