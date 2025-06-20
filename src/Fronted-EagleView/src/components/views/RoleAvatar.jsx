/*
 RoleAvatar.jsx: A reusable component that displays an interactive avatar for a specific role.
 It includes hover animations for the border, image, and role name.
 */

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// - Styled Components -

// Main avatar container. Manages size, click events, and hover animations.
const AvatarWrapper = styled(motion.div)`
  position: relative;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// The avatar's image. Scales up on hover.
const AvatarImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover; // Asegura que la imagen llene el espacio
`;

// SVG overlay used to create the animated, glowing border around the avatar.
const OutlineSVG = styled(motion.svg)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible; // Permite que el brillo se vea
`;

// The rectangle inside the SVG that gets "drawn" on hover.
const OutlineRect = styled(motion.rect)`
  width: 100%;
  height: 100%;
  fill: transparent;
  stroke-width: 4px;
  stroke: ${props => props.color};
  filter: drop-shadow(0 0 15px ${props => props.color});
`;

// The role's name, positioned below the avatar.
const RoleName = styled(motion.p)`
  position: absolute;
  bottom: -45px; 
  font-size: 1.3rem;
  font-weight: 350;
  letter-spacing: 1px; // Espaciado normal
  color: rgb(250, 250, 250);
  }
`;

/*
 Displays a single role avatar with hover effects.
    props.role - Object with role data
    props.onSelect - Callback function executed on click, passing the role type
    props.size - The avatar's size 
 */
const RoleAvatar = ({ role, onSelect, size }) => {
   // Animation variants for the outline (rest and hover states).
   // -pathLength- animates the drawing of the SVG stroke.
  const outlineVariants = {
    rest: { pathLength: 0, opacity: 0 }, 
    hover: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }
  };

  return (
    <AvatarWrapper 
      onClick={() => onSelect(role.type)}
      whileHover="hover" //triggers the 'hover' variant on all motion children.
      initial="rest"
      animate="rest"
      size={size}
    >
      <AvatarImage 
        src={role.avatar}
        alt={role.name}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.1 }
        }}
      />
      <OutlineSVG>
        <OutlineRect
          color={role.color}
          variants={outlineVariants}
        />
      </OutlineSVG>
      <RoleName
        variants={{
          rest: { opacity: 0.7 },
          hover: { opacity: 1 }
        }}
      >
        {role.name}
      </RoleName>
    </AvatarWrapper>
  );
};

export default RoleAvatar;