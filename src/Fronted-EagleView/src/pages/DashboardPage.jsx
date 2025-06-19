/**
 * @fileoverview Main dashboard page for authenticated users.
 * @version 1.0.0
 * @description This component serves as the main content hub for users. It fetches and
 * displays all content, handles dynamic filtering and searching, and conditionally
 * renders different layouts (carousels vs. grid) based on user interaction.
 * It also manages loading and error states.
 */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';

import Header from '../components/layout/Header';
import HeroSection from '../components/views/HeroSection';
import ContentCarousel from '../components/views/ContentCarousel';
import FilteredGrid from '../components/views/FilteredGrid';
import Background from '../components/views/Background';

/**
 * @description A styled wrapper for the entire page to set the background color.
 */
const PageWrapper = styled.div`
  background: #141414;
  min-height: 100vh;
`;

/**
 * @description The main content container, with dynamic padding to adjust for the filter state.
 */
const MainContainer = styled.main`
  padding: 40px 0;
  padding-top: ${props => props.$isFiltered ? '120px' : '40px'};
`;

/**
 * @description A styled component to display loading or error messages.
 */
const StatusMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: white;
  font-size: 2rem;
`;

/**
 * The main dashboard component.
 * @param {object} props - The component's properties.
 * @param {function} props.onLogout - Function to handle the user logout event.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const DashboardPage = ({ onLogout }) => {
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [types, setTypes] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ genre: '', type: '', search: '' });

  /**
   * Effect hook to fetch initial filter options (genres and types) on component mount.
   */
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [genresRes, typesRes] = await Promise.all([api.getGenres(), api.getTypes()]);
        setGenres(genresRes.data || []);
        setTypes(typesRes.data || []);
      } catch (err) {
        console.error("Error cargando opciones de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  /**
   * Effect hook to fetch content from the API whenever the active filters change.
   * Includes a debounce timer to prevent excessive API calls during user input.
   */
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getContent(activeFilters);
        const contentData = Array.isArray(response.data) ? response.data : [];

        const uniqueContentMap = new Map();
        contentData.forEach(item => uniqueContentMap.set(item.id_content, item));
        setAllContent(Array.from(uniqueContentMap.values()));

      } catch (err) {
        setError("No se pudo cargar el contenido.");
        if (err.response?.status === 401) onLogout();
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchContent, 500);
    return () => clearTimeout(timer);
  }, [activeFilters, onLogout]);

  /**
   * Callback to handle changes in genre or type filters.
   * @param {string} filterType - The type of filter being changed ('genre' or 'type').
   * @param {string} value - The new value for the filter.
   */
  const handleFilterChange = useCallback((filterType, value) => {
    setActiveFilters(prev => ({ ...prev, search: '', [filterType]: value }));
  }, []);

  /**
   * Callback to handle changes in the search input.
   * @param {string} value - The search query.
   */
  const handleSearchChange = useCallback((value) => {
    setActiveFilters(prev => ({ genre: '', type: '', search: value }));
  }, []);

  const isFiltered = !!(activeFilters.genre || activeFilters.type || activeFilters.search);
  
  /**
   * Groups content by genre for display in carousels when no filters are active.
   */
  const contentByGenre = !isFiltered ? allContent.reduce((acc, content) => {
    if (Array.isArray(content.genres) && content.genres.length > 0) {
      const uniqueGenreNames = new Set(content.genres.map(g => g.name).filter(Boolean));
      uniqueGenreNames.forEach(genreName => {
        if (!acc[genreName]) acc[genreName] = [];
        acc[genreName].push(content);
      });
    }
    return acc;
  }, {}) : {};
  
  /**
   * Selects a featured content item for the Hero section.
   */
  const featured = !isFiltered ? (allContent.find(item => item.id_content === 8) || allContent[0]) : null;

  /**
   * Renders the main content area based on the current state (loading, error, filtered, or default).
   * @returns {JSX.Element} The appropriate content view.
   */
  const renderContent = () => {
    if (loading) return <StatusMessage>Cargando...</StatusMessage>;
    if (error) return <StatusMessage>{error}</StatusMessage>;
    
    if (isFiltered) {
      return allContent.length > 0 ? 
        <FilteredGrid items={allContent} /> : 
        <StatusMessage>No se encontraron resultados.</StatusMessage>;
    } 
    
    return Object.keys(contentByGenre).length > 0 ? (
      Object.entries(contentByGenre).map(([genre, items]) => (
        <ContentCarousel key={genre} title={genre} contentList={items.slice(0, 10)} />
      ))
    ) : (
      !loading && <StatusMessage>No hay contenido para mostrar.</StatusMessage>
    );
  };

  return (
    <PageWrapper>
      <Background />
      <Header 
        genres={genres} 
        types={types}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onLogout={onLogout}
      />
      
      {!isFiltered && <HeroSection featuredContent={featured} />}
      
      <MainContainer $isFiltered={isFiltered}>
        {renderContent()}
      </MainContainer>
    </PageWrapper>
  );
};

export default DashboardPage;