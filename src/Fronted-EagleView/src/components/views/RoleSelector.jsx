
 // RoleSelector.jsx: A visual component that presents the user with the choice between a 'User' or 'Admin' role.
 
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import RoleAvatar from './RoleAvatar'; 
import { theme } from '../../styles/theme';

// Avatars for each role.
import userAvatar from '../../assets/icon1.jpg';
import adminAvatar from '../../assets/icon2.png';

// - Styled Components -

// Main wrapper that fills the screen and centers content.
const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 60px;
`;

// The main page title, with an entrance animation.
const Title = styled(motion.h1)`
  font-size: 2.8rem;
  font-weight: 400;   
 
  letter-spacing: 1px; // Un espaciado normal
  color: ${theme.colors.white};
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(117, 42, 187, 0.5)
`;

// Container to align the two role avatars.
const AvatarsContainer = styled(motion.div)`
  display: flex;
  gap: 150px;
`;

// Defines the data for each selectable role.
const roles = [
  { id: 1, name: 'Usuario', type: 'user', color: theme.colors.primary, avatar: userAvatar },
  { id: 2, name: 'Administrador', type: 'admin', color: theme.colors.accent, avatar: adminAvatar }
];

/*
 Displays the role options and handles the selection.
 props.onRoleSelect - Callback function executed when a role is selected. Receives the role type as an argument.
 */
const RoleSelector = ({ onRoleSelect }) => {
  return (
     <PageWrapper>
      <Title>Elige tu acceso</Title>
      <AvatarsContainer>
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.2 }}
          >
            <RoleAvatar 
              role={role} 
              onSelect={onRoleSelect}
              size={'200px'}
            />
          </motion.div>
        ))}
      </AvatarsContainer>
    </PageWrapper>
  );
};

export default RoleSelector;