/**
 * FilteredGrid.jsx: A presentational component that renders a grid
 * of content items. It's "dumb" in the sense that it only cares about
 * displaying the data it receives, without handling complex logic.
 */

import React from 'react';
import styled from 'styled-components';
import ContentCard from './ContentCard'; 

// The main container that defines the responsive grid structure.

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 35px 25px; 
  padding: 0 40px;
`;


/**
 Renders a grid of `ContentCard` components from an array of items.
 props.items - An array of objects, where each object is a piece of content to display.
 */
// The `onShowDetails` prop was removed because ContentCard now handles its own modal internally.
const FilteredGrid = ({ items }) => {
  // Ensures that 'items' is an array to prevent rendering errors.
  if (!Array.isArray(items)) {
    console.error("FilteredGrid esperaba 'items' como un array, pero recibió:", items);
    return null; // Or display an error message in the UI.
  }
    
  return (
    <GridWrapper>
      {items.map((item, index) => (
        <ContentCard 
          key={`grid-${item.id_content}-${index}`} // La key está bien
          content={item}
          // La prop 'onShowDetails' se ha eliminado porque era innecesaria
        />
      ))}
    </GridWrapper>
  );
};

export default FilteredGrid;