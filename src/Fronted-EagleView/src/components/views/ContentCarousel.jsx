/**
 * ContentCarousel.jsx: A component that displays a list of content
 * in a horizontal, scrollable carousel.
 */

import React from 'react';
import styled from 'styled-components';
import ContentCard from './ContentCard';

// --- Styled Components ---

// Main wrapper for the entire carousel (title and cards).
const CarouselWrapper = styled.div`margin-bottom: 50px;`;

// The carousel's section title.
const CarouselTitle = styled.h2`
  font-family: 'Rajdhani', sans-serif; font-size: 1.8rem;
  color: white; margin-bottom: 20px; padding-left: 40px;
`;

// The container for the cards, with horizontal scroll and custom scrollbar styles.
const CardsContainer = styled.div`
  display: flex; gap: 20px; overflow-x: auto; padding: 0 40px 20px 40px;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #777; }
`;

/**
 * Renders a horizontal carousel for a specific content category.
 *  props.title - The title displayed above the carousel.
 * props.contentList - Array of content objects to display.
 * [props.onShowDetails] - [Deprecated] Kept for compatibility, but ContentCard no longer uses it.
 */
const ContentCarousel = ({ title, contentList, onShowDetails }) => {
  // If there's no content, the component doesn't render to avoid empty carousels.
  if (!contentList || contentList.length === 0) return null;

  return (
    <CarouselWrapper>
      <CarouselTitle>{title}</CarouselTitle>
      <CardsContainer>
        {/* Iterates over the content list to render each card. */}
        {contentList.map((item, index) => (
          <ContentCard 
            key={`carousel-${title}-${item.id_content}-${index}`} 
            content={item} 
            // onShowDetails is passed here, but ContentCard no longer uses it.
          />
        ))}
      </CardsContainer>
    </CarouselWrapper>
  );
};
export default ContentCarousel;