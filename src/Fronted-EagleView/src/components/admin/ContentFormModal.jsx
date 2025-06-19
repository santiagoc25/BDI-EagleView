/**
 * @fileoverview Modal component for creating and editing content.
 * @version 1.0.0
 * @description This component renders a modal with a comprehensive form for an
 * administrator to create a new content item or edit an existing one. It fetches
 * all necessary options (genres, types, etc.) from the API and handles form
 * state, validation, and submission.
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { theme } from '../../styles/theme';

/**
 * @description A styled, animated backdrop for the modal.
 */
const ModalBackdrop = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center;
  align-items: center; z-index: 3000; padding: 40px;
  backdrop-filter: blur(8px);
`;
/**
 * @description The main styled container for the modal's content.
 */
const ModalContent = styled(motion.div)`
  background: #181818; color: white; padding: 40px; border-radius: 12px;
  width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;
  position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  border: 1px solid #333;
`;
/**
 * @description A styled button to close the modal.
 */
const CloseButton = styled.button`
  position: absolute; top: 15px; right: 15px; width: 35px; height: 35px;
  border-radius: 50%; background: #333; border: 1px solid #555;
  color: white; font-size: 1.5rem; line-height: 1; cursor: pointer; display: flex;
  justify-content: center; align-items: center; transition: all 0.2s;
  &:hover { background: white; color: black; transform: rotate(90deg); }
`;
/**
 * @description The main form element, using CSS Grid for layout.
 */
const Form = styled.form` display: grid; grid-template-columns: 1fr 1fr; gap: 25px; `;
/**
 * @description A styled container for a single form field (label and input).
 */
const FormGroup = styled.div`
  display: flex; flex-direction: column;
  label { margin-bottom: 10px; font-weight: 500; font-size: 0.9rem; color: #a0a0a0; text-transform: uppercase; letter-spacing: 0.5px; }
  input, select, textarea {
    padding: 12px 15px; background: #2a2a2a; border: 1px solid ${props => props.$error ? theme.colors.primary : '#444'};
    border-radius: 8px; color: #e5e5e5; font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    &:focus { outline: none; border-color: ${props => props.theme.colors.primary}; box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2); }
  }
  textarea { min-height: 120px; resize: vertical; font-family: inherit; }
  select[multiple] { height: 150px; padding: 10px; }
`;
/**
 * @description A styled component to display validation error messages.
 */
const ErrorMessage = styled.p` color: ${theme.colors.primary}; font-size: 0.8rem; margin-top: 5px; margin-bottom: 0; `;
/**
 * @description A form group that spans the full width of the grid layout.
 */
const FullWidthGroup = styled(FormGroup)` grid-column: 1 / -1; `;
/**
 * @description The main title for the modal.
 */
const ModalTitle = styled.h2`
  font-size: 2.2rem; font-weight: 600; margin: 0; margin-bottom: 30px;
  text-align: left; color: #fff; padding-bottom: 20px;
  border-bottom: 1px solid #444;
`;
/**
 * @description A container for the form's action buttons (Save, Cancel).
 */
const ButtonContainer = styled.div`
  grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 15px; 
  margin-top: 30px; padding-top: 20px; border-top: 1px solid #444;
`;
/**
 * @description A base styled button with common properties.
 */
const BaseButton = styled.button`
  padding: 12px 30px; font-size: 1rem; font-weight: 600;
  border-radius: 8px; cursor: pointer; transition: all 0.3s; border: none;
  &:disabled { background: #555; color: #888; cursor: not-allowed; transform: none; box-shadow: none; }
`;
/**
 * @description The primary action button for submitting the form.
 */
const SubmitButton = styled(BaseButton)`
  background-color: ${props => props.theme.colors.primary}; color: white;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3); filter: brightness(1.1); }
`;
/**
 * @description The secondary action button for canceling the form.
 */
const CancelButton = styled(BaseButton)`
  background-color: #404040; color: #e5e5e5; border: 1px solid #555;
  &:hover:not(:disabled) { background-color: #505050; border-color: #777; } 
`;
/**
 * @description A styled spinner to indicate loading state.
 */
const LoadingSpinner = styled.div`
  width: 50px; height: 50px; border: 5px solid #444;
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%; animation: spin 1s linear infinite;
  margin: 80px auto;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/**
 * A modal form for creating or editing content.
 * @param {object} props - The component's properties.
 * @param {object} [props.initialData] - The initial data for the content if editing. If null, the form is in 'create' mode.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {function} props.onSave - Callback function to execute after a successful save.
 * @returns {JSX.Element} The rendered modal component.
 */
const ContentFormModal = ({ initialData, onClose, onSave }) => {
  const isEditing = !!(initialData && initialData.id_content);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    synopsis: initialData?.synopsis || '',
    release_year: initialData?.release_year || '',
    duration: initialData?.duration || '',
    image_route: initialData?.image_route || '',
    id_type: initialData?.type?.id_type || '',
    id_age_rating: initialData?.ageRating?.id_age_rating || '',
    calification_general: initialData?.calification_general || 0,
    genreIds: initialData?.genres?.map(g => g.id_genre) || [],
    languageIds: initialData?.languages?.map(l => l.id_language) || [],
    streamingSourceIds: initialData?.streamingSources?.map(s => s.id_streaming_source) || [],
  });

  const [options, setOptions] = useState({ genres: [], types: [], ageRatings: [], languages: [], streamingSources: [] });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [yearError, setYearError] = useState('');

  /**
   * Effect hook to fetch all necessary options for the form's select fields.
   */
  useEffect(() => {
    const fetchAndBuildOptions = async () => {
      setLoading(true);
      try {
        const response = await api.getContent();
        const allContent = response.data;
        const allGenres = new Map(), allTypes = new Map(), allAgeRatings = new Map(), allLanguages = new Map(), allStreamingSources = new Map();
        for (const content of allContent) {
          if (content.type && !allTypes.has(content.type.id_type)) allTypes.set(content.type.id_type, content.type);
          if (content.ageRating && !allAgeRatings.has(content.ageRating.id_age_rating)) allAgeRatings.set(content.ageRating.id_age_rating, content.ageRating);
          content.genres?.forEach(g => { if (!allGenres.has(g.id_genre)) allGenres.set(g.id_genre, g); });
          content.languages?.forEach(l => { if (!allLanguages.has(l.id_language)) allLanguages.set(l.id_language, l); });
          content.streamingSources?.forEach(s => { if (!allStreamingSources.has(s.id_streaming_source)) allStreamingSources.set(s.id_streaming_source, s); });
          
        }
        setOptions({
          genres: [...allGenres.values()].sort((a,b) => a.name.localeCompare(b.name)),
          types: [...allTypes.values()].sort((a,b) => a.name.localeCompare(b.name)),
          ageRatings: [...allAgeRatings.values()].sort((a,b) => a.abbreviation.localeCompare(b.abbreviation)),
          languages: [...allLanguages.values()].sort((a,b) => a.name.localeCompare(b.name)),
          streamingSources: [...allStreamingSources.values()].sort((a,b) => a.name.localeCompare(b.name))
        });
      } catch (error) { alert("No se pudieron cargar las opciones del formulario."); onClose(); } 
      finally { setLoading(false); }
    };
    fetchAndBuildOptions();
  }, [onClose]);

  /**
   * Handles changes for standard input, select, and textarea fields.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'release_year') {
      const year = Number(value);
      const currentYear = new Date().getFullYear();
      if (value && (year < 1888 || year > currentYear)) {
        setYearError(`El año debe estar entre 1888 y ${currentYear}.`);
      } else { setYearError(''); }
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  /**
   * Handles changes for multi-select fields.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    
    const selectedValues = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(Number(options[i].value));
      }
    }
    
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: selectedValues
    }));
  };
  
  /**
   * Handles the form submission.
   * It builds the payload and calls the appropriate API endpoint (create or update).
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (yearError) {
      alert('Por favor, corrige los errores en el formulario.');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      synopsis: formData.synopsis,
      release_year: Number(formData.release_year),
      duration: formData.duration,
      image_route: formData.image_route,
      id_type: Number(formData.id_type),
      id_age_rating: Number(formData.id_age_rating),
      calification_general: parseFloat(formData.calification_general) || 0,
      genreIds: formData.genreIds,
      languageIds: formData.languageIds,
      streamingSourceIds: formData.streamingSourceIds,
    };
    
    try {
      if (isEditing) {
        await api.updateContent(initialData.id_content, payload);
      } else {
        await api.createContent(payload);
      }
      onSave();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar el contenido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }};

  return (
    <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence>
        <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3, ease: "easeInOut" }} onClick={e => e.stopPropagation()} theme={theme}>
          <CloseButton onClick={onClose}>×</CloseButton>
          <ModalTitle>{isEditing ? 'Editar Contenido' : 'Añadir Nuevo Contenido'}</ModalTitle>
          {loading ? <LoadingSpinner theme={theme}/> : (
            <Form onSubmit={handleSubmit}>
              <FormGroup theme={theme}><label>Título</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></FormGroup>
              <FormGroup theme={theme} $error={!!yearError}>
                <label>Año</label>
                <input type="number" name="release_year" value={formData.release_year} onChange={handleChange} required />
                {yearError && <ErrorMessage>{yearError}</ErrorMessage>}
              </FormGroup>
              <FormGroup theme={theme}><label>Duración</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} /></FormGroup>
              
              <FormGroup theme={theme}>
                <label>Calificación </label>
                <input 
                  type="number" 
                  name="calification_general"
                  value={formData.calification_general}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="10"
                />
              </FormGroup>

              <FullWidthGroup theme={theme}><label>URL de la Imagen</label><input type="text" name="image_route" value={formData.image_route} onChange={handleChange} required /></FullWidthGroup>
              <FullWidthGroup theme={theme}><label>Sinopsis</label><textarea name="synopsis" value={formData.synopsis} onChange={handleChange} required></textarea></FullWidthGroup>
              <FormGroup theme={theme}><label>Tipo</label><select name="id_type" value={formData.id_type} onChange={handleChange} required><option value="">Selecciona...</option>{options.types.map(o => <option key={o.id_type} value={o.id_type}>{o.name}</option>)}</select></FormGroup>
              <FormGroup theme={theme}><label>Clasificación</label><select name="id_age_rating" value={formData.id_age_rating} onChange={handleChange} required><option value="">Selecciona...</option>{options.ageRatings.map(o => <option key={o.id_age_rating} value={o.id_age_rating}>{o.abbreviation}</option>)}</select></FormGroup>
              <FullWidthGroup theme={theme}><label>Géneros (Ctrl+Click)</label><select name="genreIds" multiple value={formData.genreIds} onChange={handleMultiSelectChange}>{options.genres.map(o => <option key={o.id_genre} value={o.id_genre}>{o.name}</option>)}</select></FullWidthGroup>
              <FullWidthGroup theme={theme}><label>Idiomas (Ctrl+Click)</label><select name="languageIds" multiple value={formData.languageIds} onChange={handleMultiSelectChange}>{options.languages.map(o => <option key={o.id_language} value={o.id_language}>{o.name}</option>)}</select></FullWidthGroup>
              <FullWidthGroup theme={theme}><label>Plataformas (Ctrl+Click)</label><select name="streamingSourceIds" multiple value={formData.streamingSourceIds} onChange={handleMultiSelectChange}>{options.streamingSources.map(o => <option key={o.id_streaming_source} value={o.id_streaming_source}>{o.name}</option>)}</select></FullWidthGroup>
              <ButtonContainer>
                <CancelButton type="button" onClick={onClose} theme={theme}>Cancelar</CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting || !!yearError} theme={theme}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</SubmitButton>
              </ButtonContainer>
            </Form>
          )}
        </ModalContent>
      </AnimatePresence>
    </ModalBackdrop>
  );
};
export default ContentFormModal;