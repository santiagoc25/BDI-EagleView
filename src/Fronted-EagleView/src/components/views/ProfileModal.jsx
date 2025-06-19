
 // ProfileModal.jsx: A modal for the user to manage their profile, view favorites, and securely delete their account.

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api'; 
import { theme } from '../../styles/theme';
import userIcon from '../../assets/icon1.jpg';

// - Styled Components -
// Define the appearance of the modal, tabs, forms, and danger zone.

// Dark backdrop covering the page.
const ModalBackdrop = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center;
  align-items: center; z-index: 2000; padding: 40px;
`;

// Main modal container.
const ModalWrapper = styled(motion.div)`
  background: #1c1c1e; color: white; border-radius: 12px;
  width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
  max-height: 80vh; 
  overflow-y: auto;
`;

// Header with icon and username.
const Header = styled.div`
  padding: 20px; display: flex; align-items: center; gap: 15px;
  border-bottom: 1px solid #333;
  img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
  h2 { margin: 0; font-size: 1.8rem; }
`;

const TabContainer = styled.div`display: flex; border-bottom: 1px solid #333;`; // Container for the tab buttons.

// Container for the tab buttons.
const TabButton = styled.button`
  flex: 1; padding: 15px; background: transparent; border: none; color: white;
  font-size: 1rem; cursor: pointer; position: relative;
  opacity: ${props => props.$isActive ? 1 : 0.6};
  &::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 3px; background: ${theme.colors.primary};
    transform: ${props => props.$isActive ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }
`;
const ContentArea = styled.div`padding: 25px; min-height: 250px;`; // Container for the tab buttons.

const Form = styled.form`display: flex; flex-direction: column; gap: 15px;`;  // Generic form for updates or deletion.

// Standard text input field.
const Input = styled.input`
  background: #2a2a2c; border: 1px solid #444; border-radius: 8px;
  padding: 12px; color: white; font-size: 1rem;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

// Main action button.
const Button = styled.button`
  background: ${theme.colors.primary}; color: white; border: none;
  padding: 12px; border-radius: 8px; font-weight: 600; font-size: 1rem;
  cursor: pointer; margin-top: 10px; transition: background-color 0.2s;
  &:hover { background: ${theme.colors.secondary}; }
  &.logout { background: #555; }
`;

// List of favorite items.
const FavoritesList = styled.div`
  display: flex; flex-direction: column; gap: 10px;
  max-height: 250px; overflow-y: auto;
`;

// Item in the favorites list.
const FavoriteItem = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: #2a2a2c; padding: 10px; border-radius: 8px;
  img { width: 40px; height: 60px; object-fit: cover; border-radius: 4px; }
  span { flex: 1; margin: 0 15px; }
`;

// Button to remove a favorite.  
const RemoveButton = styled.button`
  background: ${theme.colors.primary}; color: white; border: none;
  width: 30px; height: 30px; border-radius: 50%; font-size: 1rem;
  cursor: pointer; transition: background-color 0.2s;
  &:hover { background: #B22222; }
`;

// Section for destructive actions like account deletion.
const DangerZone = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #444;
`;

// Specific button for the danger zone.
const DangerButton = styled.button`
  width: 100%;
  background: ${props => props.$confirming ? '#8B0000' : 'transparent'};
  border: 1px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 0 15px rgba(229, 9, 20, 0.4);
  }
`;

/**
 Displays a modal with the user's profile options.
 - props.onClose - Callback to close the modal.
 - props.onLogout - Callback to log the user out (used after profile deletion).
 */
const ProfileModal = ({ onClose, onLogout }) => {
  // - State -
  const [activeTab, setActiveTab] = useState('profile');  // Active tab: 'profile' or 'favorites'.
  const [userData, setUserData] = useState({ username: '', email: '', age: '' });  // User's profile data.
  const [favorites, setFavorites] = useState([]); // List of favorites.
  const [loading, setLoading] = useState(true);  // Indicates if initial data is being loaded.
  const [isDeleting, setIsDeleting] = useState(false); // Controls visibility of the confirmation form.
  const [password, setPassword] = useState(''); // Password to confirm account deletion.

  // Loads user profile and favorites data when the modal opens.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, favoritesRes] = await Promise.all([
          api.getProfile(),
          api.getFavorites()
        ]);
        setUserData(profileRes.data);
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Error al cargar datos del perfil:", err);
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [onClose]); 

  // - Handlers -
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(userData);
      alert('Perfil actualizado con éxito.');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  const handleRemoveFavorite = async (contentId) => {
    try {
      await api.removeFavorite(contentId);
      setFavorites(prev => prev.filter(fav => fav.id_content !== contentId));
    } catch (err) {
      alert('Error al quitar de favoritos.');
    }
  };

  const handleDeleteProfile = async (e) => {
    e.preventDefault();
    if (!password) {
      alert("Por favor, introduce tu contraseña para confirmar.");
      return;
    }
    try {
      await api.deleteProfile(password);
      alert('Tu perfil ha sido eliminado exitosamente.');
      onLogout();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar tu perfil.');
    }
  };

  return (
    // The - ModalBackdrop - closes the modal when clicked.
    <ModalBackdrop onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalWrapper onClick={e => e.stopPropagation()} initial={{ y: -50 }} animate={{ y: 0 }}> {/* - stopPropagation - prevents clicks on the modal from propagating and closing it.*/}
        <Header>
          <img src={userIcon} alt="Perfil" />
          <h2>{userData.username || 'Mi Perfil'}</h2>
        </Header>
        <TabContainer>
          <TabButton $isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>Mi Perfil</TabButton>
          <TabButton $isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>Mis Favoritos</TabButton>
        </TabContainer>
        <ContentArea>
          {loading ? <p>Cargando...</p> : (
            <AnimatePresence mode="wait"> {/* Handles transitions when switching tabs.*/}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form onSubmit={handleProfileUpdate}>
                    {/* - buttons -*/}
                    <Input name="username" value={userData.username || ''} onChange={handleInputChange} placeholder="Nombre de usuario" />
                    <Input name="email" type="email" value={userData.email || ''} onChange={handleInputChange} placeholder="Email" />
                    <Input name="age" type="number"  min="1" value={userData.age || ''} onChange={handleInputChange} placeholder="Edad" />
                    <Button type="submit">Guardar Cambios</Button>
                  </Form>
                  <Button className="logout" onClick={onLogout} style={{ marginTop: '20px', width: '100%' }}>Cerrar Sesión</Button>
                  <DangerZone> {/* The delete profile button toggles the confirmation form.*/}
                    <DangerButton type="button" onClick={() => setIsDeleting(!isDeleting)}>
                      {isDeleting ? 'Cancelar' : 'Eliminar Perfil'}
                    </DangerButton>
                    <AnimatePresence>
                      {isDeleting && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: '15px' }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Form onSubmit={handleDeleteProfile}>
                            <p style={{fontSize: '0.9rem', color: '#ccc', margin: '0 0 10px 0'}}>Introduce tu contraseña para confirmar la eliminación:</p>
                            <Input 
                              type="password"
                              placeholder="Tu contraseña actual"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              autoFocus
                            />
                            <DangerButton type="submit" $confirming={true}>Confirmar y Eliminar</DangerButton>
                          </Form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </DangerZone>
                </motion.div>
              )}
              {activeTab === 'favorites' && (
                <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {favorites.length > 0 ? (
                    <FavoritesList>
                      {favorites.map(fav => (
                        <FavoriteItem key={fav.id_content}>
                          <img src={fav.image_route} alt={fav.title} />
                          <span>{fav.title}</span>
                          <RemoveButton onClick={() => handleRemoveFavorite(fav.id_content)}>×</RemoveButton>
                        </FavoriteItem>
                      ))}
                    </FavoritesList>
                  ) : <p>Aún no tienes favoritos.</p>}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </ContentArea>
      </ModalWrapper>
    </ModalBackdrop>
  );
};

export default ProfileModal;