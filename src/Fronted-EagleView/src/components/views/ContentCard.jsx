import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';
import { api } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

// --- UI & Style Definitions ---
// Icons and all styled-components for the card and its modals are defined below
const HeartIcon = () => '❤️';
const RatingsIcon = () => '⭐';
const ModalBackdrop = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center;
  align-items: center; z-index: 2000; padding: 40px;
`;
const ModalWrapper = styled(motion.div)`
  width: 100%; max-width: 900px; background: #181818;
  border-radius: 10px; overflow: hidden; position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
  display: flex; flex-direction: column; max-height: 90vh;
`;
const BackgroundImage = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-image: url(${props => props.src}); background-size: cover;
  background-position: center; opacity: 0.15; filter: blur(5px); z-index: 0;
`;
const CloseButton = styled.button`
  position: absolute; top: 15px; right: 15px; width: 35px; height: 35px;
  border-radius: 50%; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.5);
  color: white; font-size: 1.5rem; line-height: 1; cursor: pointer; z-index: 10;
  transition: all 0.3s ease; &:hover { background: white; color: black; }
`;
const DetailsView = styled(motion.div)`
  position: relative; z-index: 2; padding: 40px; display: flex; gap: 40px;
  width: 100%; height: 100%; overflow-y: auto;
  background: linear-gradient(to right, rgba(24, 24, 24, 0.98) 40%, rgba(24, 24, 24, 0.9) 70%, rgba(24, 24, 24, 0.75) 100%);
  @media (max-width: 768px) { flex-direction: column; align-items: center; }
`;
const PosterImage = styled.img`
  width: 250px; min-width: 250px; height: 375px; border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5); object-fit: cover;
`;
const InfoColumn = styled.div`color: white; flex: 1;`;
const Title = styled.h1`font-size: 2.8rem; font-weight: 700; span {font-weight: 300; color: #ccc;}`;
const MetaData = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 15px;
  margin: 10px 0 25px 0; color: #ccc; font-size: 0.9rem;
  span.rating-tag { border: 1px solid #ccc; padding: 2px 5px; border-radius: 3px; }
`;
const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// --- CAMBIO: Círculo de puntuación más grande ---
const ScoreCircle = styled.div`
  width: 55px; 
  height: 55px; 
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(closest-side, #181818 79%, transparent 80% 100%),
              conic-gradient(${props => props.$color} ${props => props.$percentage}%, #444 ${props => props.$percentage}%);
  position: relative;
`;

const ScoreText = styled.span`
  color: white;
  font-size: 1rem; 
  font-weight: 700;
`;

const ActionsRow = styled.div`display: flex; align-items: center; gap: 15px; margin-bottom: 25px;`;

const ActionButton = styled.button`
  background: rgba(0,0,0,0.6);
  border: 1px solid ${props => props.$isActive ? theme.colors.primary : '#888'};
  color: ${props => props.$isActive ? theme.colors.primary : 'white'};
  padding: 10px 20px;
  border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: all 0.3s; font-weight: 500;
  &:hover { background: ${theme.colors.primary}; color: white; border-color: ${theme.colors.primary}; }
  &:disabled { cursor: not-allowed; opacity: 0.7; }
  
  .icon {
    font-size: 0.85rem; 
    position: relative;
    top: -1px; 
  }
`;

const Overview = styled.div`
  h4 { font-size: 1.4rem; margin-bottom: 10px; font-weight: 600; border-left: 3px solid ${theme.colors.primary}; padding-left: 10px; }
  p { line-height: 1.7; color: #ddd; }
`;
const PlatformsGrid = styled.div`display: flex; flex-wrap: wrap; gap: 15px; img { height: 40px; border-radius: 5px; }`;
const RatingsPanelOverlay = styled(motion.div)`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(10, 10, 10, 0.9); z-index: 100;
  display: flex; justify-content: center; align-items: center;
`;
const RatingsPanelContent = styled(motion.div)`
  background: #222; padding: 30px; border-radius: 8px;
  width: 90%; max-width: 600px; color: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; gap: 20px;
  max-height: 80vh;
`;
const RatingsHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  h3 { font-size: 1.8rem; margin: 0; }
  button { background: none; border: 1px solid #777; color: white; width: 30px; height: 30px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: all 0.2s; &:hover{ background: #eee; color: #111; }}
`;
const RatingsList = styled.div`
  overflow-y: auto; max-height: 200px; padding-right: 15px;
  display: flex; flex-direction: column; gap: 15px;
`;
const RatingItem = styled.div`
  background: #333; padding: 15px; border-radius: 5px; border-left: 3px solid ${theme.colors.primary};
  .user-info { font-weight: bold; }
  p { margin: 0; margin-top: 8px; font-style: italic; color: #ccc; }
`;
const RatingForm = styled.form`
  display: flex; flex-direction: column; gap: 15px;
  h4 { font-size: 1.2rem; margin: 0; border-top: 1px solid #444; padding-top: 20px; }
`;
const StarContainer = styled.div`display: flex; gap: 5px;`;
const StarButton = styled.button`
  background: none; border: none; font-size: 2rem;
  color: ${props => props.$isActive ? '#ffc107' : '#555'};
  cursor: pointer; padding: 0; transition: color 0.2s;
`;
const CommentTextarea = styled.textarea`
  width: 100%; background: #333; border: 1px solid #555;
  border-radius: 5px; padding: 10px; color: white;
  min-height: 80px; resize: vertical;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;
const SubmitButton = styled.button`
  background: ${theme.colors.primary}; color: white; border: none;
  padding: 10px 20px; border-radius: 20px; font-weight: 600;
  cursor: pointer; align-self: flex-end;
  &:hover { background: ${theme.colors.secondary}; }
  &:disabled { background: #555; color: #aaa; cursor: not-allowed; }
`;
const DeleteButton = styled.button`
  background: #611a15; color: #ffcdd2; border: 1px solid #c62828;
  border-radius: 4px; padding: 2px 8px; font-size: 0.8rem;
  cursor: pointer; margin-left: auto; transition: all 0.2s;
  &:hover { background: #c62828; color: white; }
`;

/** A reusable 5-star input with hover feedback. */
const StarRatingInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map(star => (
        <StarButton
          key={star} type="button" $isActive={star <= (hoverRating || rating)}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >★</StarButton>
      ))}
    </StarContainer>
  );
};

/** Panel for viewing, adding, and deleting content ratings. */
const RatingsPanel = ({ contentId, onClose }) => {
  // State for ratings list, new rating form, and loading status.
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized user ID to check ownership of ratings.
  const currentUserId = useMemo(() => {
    try {
      const token = localStorage.getItem('authToken');
      return token ? jwtDecode(token).user.id : null; 
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return null;
    }
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await api.getRatingsByContentId(contentId);
      setRatings(response.data || []);
    } catch (err) {
      console.error("Error al cargar calificaciones:", err);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [contentId]);

  // Handlers for submitting and deleting a rating.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      alert("Por favor, selecciona al menos una estrella.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.postRating(contentId, { stars: newRating, comment: newComment });
      fetchRatings();
      setNewRating(0);
      setNewComment('');
    } catch (err) {
      console.error("Error al enviar calificación:", err);
      const errorMessage = err.response?.data?.message || 'Hubo un error al enviar tu calificación.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ratingIdToDelete) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar tu calificación?')) {
      return;
    }
    try {
      await api.deleteRating(contentId, ratingIdToDelete);
      setRatings(prevRatings => prevRatings.filter(r => r.id_rating !== ratingIdToDelete));
      alert('Tu calificación ha sido borrada.');
    } catch (error) {
      console.error("Error al borrar la calificación:", error);
      alert('Hubo un error al borrar tu calificación.');
    }
  };

  return (
    <RatingsPanelOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <RatingsPanelContent initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()}>
        <RatingsHeader>
          <h3>Calificaciones</h3>
          <button onClick={onClose}>×</button>
        </RatingsHeader>

        <RatingsList>
          {loading ? (<p>Cargando calificaciones...</p>)
            : ratings.length > 0 ? (
              ratings.map((r) => (
                <RatingItem key={r.id_rating}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="user-info">{r.user?.username || 'Anónimo'}</span> - {'⭐'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                    {currentUserId != null && currentUserId == r.user?.id_user && (
                      <DeleteButton onClick={() => handleDelete(r.id_rating)}>
                        Borrar
                      </DeleteButton>
                    )}
                  </div>
                  {r.comment && <p>"{r.comment}"</p>}
                </RatingItem>
              ))
            ) : (<p>Aún no hay calificaciones. ¡Sé el primero!</p>)
          }
        </RatingsList>

        <RatingForm onSubmit={handleSubmit}>
          <h4>Deja tu calificación</h4>
          <StarRatingInput rating={newRating} setRating={setNewRating} />
          <CommentTextarea
            placeholder="Añade un comentario (opcional)..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <SubmitButton type="submit" disabled={newRating === 0 || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
          </SubmitButton>
        </RatingForm>
      </RatingsPanelContent>
    </RatingsPanelOverlay>
  );
};

/** The main modal, showing full details. Fetches its own data. */
const DetailsModalInternal = ({ initialContent, onClose }) => {
  // State for full content data, loading, and user actions (favorite, etc.).
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatings, setShowRatings] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [contentRes, favoritesRes] = await Promise.all([
          api.getContentById(initialContent.id_content),
          api.getFavorites()
        ]);
        
        setContent(contentRes.data);
        const favoritesData = favoritesRes.data || [];
        const isContentFavorite = favoritesData.some(fav => fav.id_content === initialContent.id_content);
        setIsFavorite(isContentFavorite);
      } catch (err) {
        console.error("Error cargando datos del modal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [initialContent.id_content]);

  // Toggles favorite status via API.
  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    const contentId = initialContent.id_content;

    try {
      if (isFavorite) {
        await api.removeFavorite(contentId);
        setIsFavorite(false);
      } else {
        await api.toggleFavorite(contentId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error al cambiar estado de favorito:", err);
      alert("Hubo un error al actualizar tus favoritos.");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Use full data if loaded, otherwise fall back to initial data.
  const displayData = loading || !content ? initialContent : content;
  const { title, release_year, image_route, synopsis, ageRating, type, genres, duration, languages, streamingSources, calification_general } = displayData;
  const scorePercentage = calification_general ? calification_general * 10 : 0;
  const scoreColor = scorePercentage >= 75 ? '#2ecc71' : scorePercentage >= 50 ? '#f1c40f' : '#e74c3c';
  const genreNames = Array.isArray(genres) ? genres.map(g => g.name).join(', ') : '';
  const languageNames = Array.isArray(languages) ? languages.map(l => l.name).join(', ') : '';
  const uniqueStreamingSources = Array.isArray(streamingSources) ? Array.from(new Map(streamingSources.map(s => [s.id_streaming_source, s])).values()) : [];

  // Renders the modal into the 'modal-root' DOM node using a Portal.
  return ReactDOM.createPortal(
    <ModalBackdrop onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <BackgroundImage src={image_route} />
        {loading ? <p style={{color:'white', textAlign:'center', width:'100%'}}>Cargando...</p> : (
          <DetailsView>
            <PosterImage src={image_route} alt={title} />
            <InfoColumn>
              <Title>{title} <span>({release_year})</span></Title>
              <MetaData>
                {ageRating?.abbreviation && <span className="rating-tag">{ageRating.abbreviation}</span>}
                {type?.name && <span>{type.name}</span>}
                {genreNames && <span>• {genreNames}</span>}
                {duration && <span>• {duration}</span>}
              </MetaData>
              
              <ActionsRow>
                {calification_general > 0 && (
                  <ScoreWrapper>
                    <ScoreCircle $percentage={scorePercentage} $color={scoreColor}>
                      <ScoreText>{Math.round(scorePercentage)}%</ScoreText>
                    </ScoreCircle>
                  </ScoreWrapper>
                )}
                <ActionButton $isActive={isFavorite} onClick={handleToggleFavorite} disabled={isTogglingFavorite}>
                  <span className="icon"><HeartIcon /></span>
                  {isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
                </ActionButton>
                <ActionButton onClick={() => setShowRatings(true)}>
                  <span className="icon"><RatingsIcon /></span> 
                  Calificaciones
                </ActionButton>
              </ActionsRow>
              
              <Overview><h4>Sipnosis</h4><p>{synopsis || 'No disponible.'}</p></Overview>
              {languageNames && <div style={{marginTop: '20px'}}><h4>Idiomas</h4><p style={{color: '#ccc'}}>{languageNames}</p></div>}
              {uniqueStreamingSources.length > 0 && <div style={{marginTop: '20px'}}><h4>Disponible en</h4><PlatformsGrid>{uniqueStreamingSources.map(s=><img key={s.id_streaming_source} src={s.logo_path} alt={s.name} title={s.name}/>)}</PlatformsGrid></div>}
            </InfoColumn>
          </DetailsView>
        )}
        <AnimatePresence>
          {showRatings && <RatingsPanel contentId={displayData.id_content} onClose={() => setShowRatings(false)} />}
        </AnimatePresence>
      </ModalWrapper>
    </ModalBackdrop>, 
    document.getElementById('modal-root')
  );
};


// --- Componente Principal ContentCard ---
const CardContainer = styled(motion.div)`
  display: flex; flex-direction: column; gap: 12px;
  width: 220px; flex-shrink: 0;
`;
const CardWrapper = styled(motion.div)`
  width: 100%; height: 330px; position: relative;
  cursor: pointer; border-radius: 5px; overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
`;
const CardImage = styled.img`
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease;
  ${CardWrapper}:hover & { transform: scale(1.1); }
`;
const Overlay = styled(motion.div)`
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  display: flex; justify-content: center; align-items: flex-end; padding: 20px;
  pointer-events: none;
`;
const ViewMoreButton = styled.button`
  background: ${theme.colors.primary};
  color: white; border: none; border-radius: 20px;
  padding: 8px 15px; font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: background-color 0.3s;
  pointer-events: auto;
  &:hover { background: ${theme.colors.secondary}; }
`;
const ContentTitle = styled.p`
  color: #e5e5e5; font-size: 1rem; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 5px;
`;

/**
 * The main exported component. Shows a content summary card.
 * Manages the state to show/hide the details modal.
 */
const ContentCard = ({ content }) => {
  // State to control the modal's visibility.
  const [showDetails, setShowDetails] = useState(false);
  const imageUrl = content.image_route;

  return (
    <>
      {/* The summary card view */}
      <CardContainer>
        <CardWrapper whileHover="hover">
          <CardImage src={imageUrl} alt={content.title} />
          <Overlay variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}>
            <ViewMoreButton onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}>Ver más</ViewMoreButton>
          </Overlay>
        </CardWrapper>
        <ContentTitle>{content.title}</ContentTitle>
      </CardContainer>
      {/* AnimatePresence handles the modal's enter/exit animations. */}
      <AnimatePresence>
        {showDetails && <DetailsModalInternal initialContent={content} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ContentCard;