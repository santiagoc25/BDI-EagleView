/*
 IntroAnimation.jsx: A full-screen intro animation.
 It's displayed on app launch and notifies its parent component
 (`App.jsx`) when the animation is complete.
 */

import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { theme } from '../../styles/theme';

// - Styled Components -

// Main full-screen wrapper for the animation.
const AnimationWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.black};
  z-index: 9999;
  overflow: hidden;
`;

// Container for the logo, used for positioning it in the center.
const LogoContainer = styled(motion.div)`
  width: 400px;
  height: auto;
  position: relative;
`;

// Keyframes animation for the "glitch" effect applied to the logo.
const glitchAnimation = keyframes`
  0% { transform: translate(0); }
  10% { transform: translate(-5px, 5px); clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%); }
  20% { transform: translate(5px, -5px); clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); }
  30% { transform: translate(-3px, 3px); }
  40% { transform: translate(3px, -3px); clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%); }
  50% { transform: translate(0); }
  100% { transform: translate(0); }
`;

// The logo's base layer, which also applies the glitch effect via a pseudo-element.
const BaseLogoLayer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.logoSrc});
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0;
    animation: ${glitchAnimation} 0.8s linear infinite;
  }
`;

// Color fragments that fly in towards the center of the screen.
const Fragment = styled(motion.div)`
  position: absolute;
  width: 55px;
  height: 55px;
  background: ${props => props.color};
  filter: blur(5px);
`;

/*
 - Renders the intro animation sequence.
 - props.onAnimationComplete - Callback function executed when the animation finishes.
 */
const IntroAnimation = ({ onAnimationComplete }) => {
  // useEffect to notify the parent component that the animation has finished.
  useEffect(() => {
    // A timer is set to call `onAnimationComplete` after the animation's duration
    const timer = setTimeout(() => {
      onAnimationComplete(); 
    }, 4000);

    // Cleans up the timer if the component unmounts prematurely.
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // Configuration for the animated fragments.
  const fragments = [
    { x: -250, y: -200, color: theme.colors.primary },
    { x: 300, y: 150, color: theme.colors.secondary },
    { x: -200, y: 250, color: theme.colors.accent },
    { x: 220, y: -220, color: theme.colors.primary },
    { x: 350, y: -100, color: theme.colors.secondary },
  ];

  const fragmentTravelDuration = 1.8;
  const logoImageSrc = '/src/assets/logo.svg'; 

  return (
    <AnimationWrapper
      // The exit animation is managed by AnimatePresence in App.jsx.
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/*Renders and animates the fragments towards the center in a staggered sequence.*/}
      {fragments.map((frag, i) => (
        <Fragment
          key={i}
          color={frag.color}
          initial={{ x: frag.x, y: frag.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
          transition={{ duration: fragmentTravelDuration, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
       {/*The logo appears once the fragments have converged.*/}
      <LogoContainer>
        <BaseLogoLayer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: fragmentTravelDuration - 0.5 }}
          logoSrc={logoImageSrc}
        >
          <Logo />
        </BaseLogoLayer>
      </LogoContainer>
    </AnimationWrapper>
  );
};

export default IntroAnimation;