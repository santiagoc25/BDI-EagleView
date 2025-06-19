/**
 * Button.jsx: A reusable UI component for a styled button,
 * featuring glow and hover effects.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// The button element styled with `styled-components`.
const StyledButton = styled.button`
  width: 100%;
  padding: 15px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.colors.white};
  background: transparent;
  border: 2px solid ${props => props.color || theme.colors.primary};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  box-shadow: 0 0 10px ${props => props.color || theme.colors.primary};

  // Effects applied when hovering over the button.
  &:hover {
    background: ${props => props.color || theme.colors.primary};
    box-shadow: 0 0 25px ${props => props.color || theme.colors.primary};
  }
`;

/**
 * Renders a styled and customizable button.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content of the button (e.g., the text).
 * @param {string} [props.color] - An optional color for the border and glow effect.
 * It also accepts all other standard HTML <button> props (onClick, type, etc.).
 */
const Button = ({ children, ...props }) => {
  // Separates `children` for the content and uses `...props` to pass down
  // all other attributes (e.g., onClick, type) directly to the button.
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;