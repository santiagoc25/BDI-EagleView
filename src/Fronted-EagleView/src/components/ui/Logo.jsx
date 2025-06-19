/**
 * Logo.jsx: A simple, reusable component for displaying the application logo.
 */

import React from 'react';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png'; 

// Styles for the logo image, ensuring it fills its container.
const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  display: block; // Removes extra space below the image.
`;

/**
 * Renders the application logo. It takes no props.
 */
const Logo = () => {
  // The 'alt' text is important for accessibility.
  return <LogoImg src={logoImage} alt="Eagle View+ Logo" />;
};

export default Logo;