import '../../../styles/masonry-grid.scss';

import Masonry from 'react-masonry-css';
import React from 'react';

/**
 * Component that renders a masonry grid
 * @param children Children to render in a masonry grid
 * @param breakpoints Breakpoints to use for setting number of columns
 * @returns MasonryGrid component
 */
export const MasonryGrid: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  // Breakpoints for deciding # of columns in the masonry layout
  // These are based on BS breakpoints to make it flow properly
  const breakpoints = {
    768: 1,
    992: 2,
    1400: 3,
    default: 4,
  };

  return (
    <Masonry
      breakpointCols={breakpoints}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
};
