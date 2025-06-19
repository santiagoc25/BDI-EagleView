/*
 HeroSection.jsx: Displays the featured content at the top
 of a page and allows playing its trailer in a modal.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import YouTube from 'react-youtube';

import Button from '../ui/Button';
import { theme } from '../../styles/theme';

//  INTERNAL COMPONENT: TRAILERMODAL

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  width: 80vw;
  max-width: 900px;
  aspect-ratio: 16 / 9;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -45px;
  right: -10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
`;

/*
Internal component to display the YouTube trailer in a modal.
- props.youtubeKey - The YouTube video ID to play.
- props.onClose - Callback to close the modal.
 */
const TrailerModal = ({ youtubeKey, onClose }) => {
  const opts = { // YouTube player options
    height: '100%',
    width: '100%',
    playerVars: { autoplay: 1 },
  };

  return (
    // The backdrop closes the modal on click.
    <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
       {/* - stopPropagation -  prevents clicks on the video from closing the modal.*/}
      <ModalContent initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <YouTube videoId={youtubeKey} opts={opts} style={{width: '100%', height: '100%'}}/>
      </ModalContent>
    </ModalBackdrop>
  );
};

//  MAIN COMPONENT: HEROSECTION

// Main section container.
const HeroWrapper = styled.div`
  height: 80vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 50px;
  overflow: hidden;
`;

// Background image.
const HeroBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  z-index: 1;
`;

// Gradient overlay for text legibility
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(12,12,12,1) 15%, transparent 50%),
              linear-gradient(to right, rgba(12,12,12,0.8) 20%, transparent 60%);
  z-index: 2;
`;

// Text and button content.
const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 45%;
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-family: 'Rajdhani', sans-serif;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.7);
  margin-bottom: 15px;
`;

const HeroSynopsis = styled.p`
  font-size: 1.2rem;
  margin: 20px 0 30px 0;
  line-height: 1.6;
  max-width: 90%;
`;

const ButtonWrapper = styled.div`
  width: 200px;
`;

/**
 Displays the main section with featured content.
 props.featuredContent - Object with data to display (title, synopsis, image_route).
 */
const HeroSection = ({ featuredContent }) => {
  // State to control the trailer's visibility and ID.
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // If there's no featured content, show a simple background.
  if (!featuredContent) {
    return <HeroWrapper style={{ background: '#111' }} />;
  }
  
  const backgroundImageUrl = featuredContent.image_route;

  // Extracts the ID from a YouTube link and opens the modal.
  const handlePlayTrailer = () => {
    const trailerLink = "https://youtu.be/3hP2nRFHwNM?si=iHiCeVuNzIonY8yW";
    try {
      const url = new URL(trailerLink);
      const videoId = url.pathname.substring(1); 

      if (videoId) {
        setTrailerKey(videoId);
        setShowTrailer(true);
      } else {
        alert("No se pudo obtener la ID del video desde el link.");
      }
    } catch (error) {
      alert("El link del tráiler es inválido.");
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <React.Fragment>
      <HeroWrapper>
        <HeroBackground src={backgroundImageUrl} alt={featuredContent.title} />
        <GradientOverlay />
        <HeroContent>
          <HeroTitle>{featuredContent.title}</HeroTitle>
          <HeroSynopsis>{featuredContent.synopsis}</HeroSynopsis>
          <ButtonWrapper>
            <Button color={theme.colors.primary} onClick={handlePlayTrailer}>
              Ver Trailer
            </Button>
          </ButtonWrapper>
        </HeroContent>
      </HeroWrapper>
      {/* - AnimatePresence - allows the modal to have an exit animation.*/}
      <AnimatePresence>
        {showTrailer && (
          <TrailerModal 
            youtubeKey={trailerKey} 
            onClose={handleCloseTrailer} 
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default HeroSection;