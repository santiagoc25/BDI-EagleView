// src/components/admin/ContentManagement.jsx

/** ContentManagement.jsx: Admin interface to manage (CRUD) all content. */

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ContentFormModal from './ContentFormModal';
import { theme } from '../../styles/theme';

// --- Styled Components ---
const SectionTitle = styled.h2`
  font-size: 2rem; font-weight: 500; margin-bottom: 20px;
  color: #fff; border-left: 4px solid ${props => props.theme.colors.primary};
  padding-left: 15px;
`;
const Toolbar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 30px; flex-wrap: wrap; gap: 20px;
`;
const AddButton = styled.button`
  padding: 12px 25px; font-size: 1rem; font-weight: 600; color: white;
  background: linear-gradient(90deg, #36d1dc, #5b86e5); border: none;
  border-radius: 8px; cursor: pointer; transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 8px 25px rgba(71, 169, 226, 0.3); }
`;
const SearchInput = styled.input`
  padding: 12px 15px; width: 300px; background: #2a2a2a;
  border: 1px solid #444; border-radius: 8px; color: #e5e5e5;
  font-size: 1rem; transition: all 0.3s;
  &:focus { outline: none; border-color: ${props => props.theme.colors.primary}; box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2); }
`;
const ContentGrid = styled(motion.div)`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
`;
const AdminContentCard = styled(motion.div)`
  background: #1f1f1f; border-radius: 12px; overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: flex; flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative;
  &:hover { transform: translateY(-10px); }
`;
const CardImage = styled.img`width: 100%; height: 270px; object-fit: cover;`;
const CardOverlay = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(31,31,31,1) 20%, rgba(31,31,31,0.7) 60%, transparent 100%);
  padding: 20px 15px 15px; opacity: 0; transition: opacity 0.3s ease-in-out;
  ${AdminContentCard}:hover & { opacity: 1; }
`;
const CardTitle = styled.h4`
  font-size: 1rem; font-weight: 600; color: white; margin: 0 0 15px 0;
  text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const CardActions = styled.div`display: flex; gap: 10px;`;
const ActionButton = styled.button`
  flex: 1; padding: 10px; font-size: 0.9rem; font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer;
  color: white; backdrop-filter: blur(5px); transition: all 0.2s ease-in-out;
  background: ${props => props.color || 'rgba(40, 40, 40, 0.7)'};
  &:hover { transform: scale(1.05); border-color: white; background: ${props => props.$hoverColor || props.color}; }
`;

/** Manages the display, search, and CRUD operations for content. */
const ContentManagement = () => {
  // State for content list, modal, editing state, and search term.
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetches all content from the API.
  const fetchContent = async () => {
    setLoading(true);
    try {
      setAllContent((await api.getContent()).data);
    } catch (error) { console.error("Error fetching content:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(); }, []);

  // Filters content efficiently using `useMemo`.
  const filteredContent = useMemo(() => {
    if (!searchTerm) return allContent;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(lowercasedFilter) ||
      item.id_content.toString().includes(lowercasedFilter)
    );
  }, [searchTerm, allContent]);
    
  // Handler to delete content with confirmation.
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.deleteContent(id);
        setAllContent(current => current.filter(item => item.id_content !== id));
      } catch (error) { alert(error.response?.data?.message || 'Error deleting content.'); }
    }
  };

  const handleOpenCreateModal = () => { setEditingContent(null); setIsModalOpen(true); };
  const handleOpenEditModal = (content) => { setEditingContent(content); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingContent(null); };
    
  if (loading) return <p>Cargando</p>;

  return (
    <div theme={theme}>
      <SectionTitle theme={theme}>Todos los contenidos</SectionTitle>
      <Toolbar>
        <AddButton onClick={handleOpenCreateModal}>+ Añadir nuevo contenido</AddButton>
        <SearchInput
          placeholder="Bucar por titulo o ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          theme={theme}
        />
      </Toolbar>
      
      <ContentGrid>
        {filteredContent.map(item => (
          <AdminContentCard key={item.id_content}>
            <CardImage src={item.image_route || 'https://via.placeholder.com/180x270'} alt={item.title} />
            <CardOverlay>
              <CardTitle>{item.title}</CardTitle>
              <CardActions>
                <ActionButton color="rgba(255, 193, 7, 0.4)" $hoverColor="rgba(255, 193, 7, 0.9)" onClick={() => handleOpenEditModal(item)}>Editar</ActionButton>
                <ActionButton color="rgba(229, 9, 20, 0.4)" $hoverColor={theme.colors.primary} onClick={() => handleDelete(item.id_content)}>Eliminar</ActionButton>
              </CardActions>
            </CardOverlay>
          </AdminContentCard>
        ))}
      </ContentGrid>
      
      <AnimatePresence>
        {isModalOpen && (
          <ContentFormModal 
            key={editingContent ? `edit-${editingContent.id_content}` : 'create'}
            initialData={editingContent} 
            onClose={handleCloseModal}
            onSave={() => { fetchContent(); handleCloseModal(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentManagement;