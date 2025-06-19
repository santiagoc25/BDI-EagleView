/**
 * Background.jsx: A decorative component that creates a subtle,
 * full-screen animated background for the application.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

// Defines the back-and-forth animation for the color "particles".
const move = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(-20%, -10%); }
  100% { transform: translate(0, 0); }
`;

// Main wrapper that fixes the background to the screen.
const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  z-index: -1; // Key: ensures it's behind all other content.
`;

// The layer that contains and animates the color "particles".
// It's larger than the screen for smooth, seamless movement.
const ParticleLayer = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  // Uses radial gradients to simulate the colored blobs.
  background-image: radial-gradient(#4D4DFF, transparent 30%),
                    radial-gradient(#C566FF, transparent 30%),
                    radial-gradient(#FFD700, transparent 30%);
  background-size: 500px 500px, 300px 300px, 400px 400px;
  background-position: 0 0, 150px 100px, 50px 250px;
  // Applies the slow, infinite movement animation.
  animation: ${move} 30s linear infinite;
  opacity: 0.1; // Low opacity keeps the effect subtle.
`;

/**
 * Renders the animated background component.
 */
const Background = () => {
  return (
    <BackgroundWrapper>
      <ParticleLayer />
    </BackgroundWrapper>
  );
};

export default Background;