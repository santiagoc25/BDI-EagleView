// Header.jsx: Main app header with filters and profile access. 

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import userIcon from '../../assets/icon1.jpg';
import ProfileModal from '../views/ProfileModal';
import { AnimatePresence } from 'framer-motion';

// --- Styled components for the header ---
const HeaderWrapper = styled.header`
  width: 100%; padding: 15px 40px; display: flex; justify-content: space-between;
  align-items: center; position: fixed; top: 0; left: 0; z-index: 1000;
  transition: background-color 0.4s ease;
  background: ${props => props.$scrolled ? '#141414' : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'};
`;
const LeftSection = styled.div`display: flex; align-items: center; gap: 20px;`;
const RightSection = styled.div`display: flex; align-items: center; gap: 30px;`;
const SearchBar = styled.div`input { background: rgba(0,0,0,0.5); border: 1px solid #444; border-radius: 5px; padding: 8px 15px; color: white; width: 250px; }`;
const FilterSelect = styled.select`background: rgba(0,0,0,0.5); border: 1px solid #444; color: white; padding: 8px; border-radius: 5px; font-family: 'Poppins', sans-serif;`;
const ProfileIcon = styled.img`height: 35px; width: 35px; cursor: pointer; border-radius: 50%; background: #333;`;


/** Renders the header with filters and user profile. */
const Header = ({ genres, types, activeFilters = {}, onFilterChange, onSearchChange, onLogout }) => {
  // Controls header background on scroll.
  const [scrolled, setScrolled] = useState(false);
  // Controls profile modal visibility.
  const [showProfile, setShowProfile] = useState(false);

  // Detects scroll to change the background.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Closes modal before logging out.
  const handleLogout = () => {
    setShowProfile(false);
    onLogout();
  };

  return (
    <>
      <HeaderWrapper $scrolled={scrolled}>
        <LeftSection>
        </LeftSection>
        <RightSection>
          <SearchBar><input type="text" placeholder="Buscar..." value={activeFilters.search || ''} onChange={(e) => onSearchChange(e.target.value)} /></SearchBar>
          <FilterSelect name="type" value={activeFilters.type || ''} onChange={(e) => onFilterChange('type', e.target.value)}>
            <option value="">Todo tipo</option>
            {types?.map(type => <option key={type.id_type} value={type.name}>{type.name}</option>)}
          </FilterSelect>
          <FilterSelect name="genero" value={activeFilters.genre || ''} onChange={(e) => onFilterChange('genre', e.target.value)}>
            <option value="">Todos los generos</option>
            {genres?.map(genre => <option key={genre.id_genre} value={genre.name}>{genre.name}</option>)}
          </FilterSelect>
          
          {/* Opens the profile modal. */}
          <ProfileIcon src={userIcon} alt="Perfil" onClick={() => setShowProfile(true)} />
        </RightSection>
      </HeaderWrapper>

      {/* Animates modal's enter/exit. */}
      <AnimatePresence>
        {showProfile && (
          <ProfileModal 
            onClose={() => setShowProfile(false)} 
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;