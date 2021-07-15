import {Link} from 'react-router-dom';
import React from 'react';

export const GalleryPagination: React.VFC<{
  count: number;
  currentPage: number;
}> = ({count, currentPage}) => {
  // Total number of pages
  const numPages = Math.ceil(count / 32);
  // Maimum length of the pagination list
  const paginationLength = 7;

  let paginationPages: number[];
  if (numPages <= paginationLength) {
    // Render links to all pages
    paginationPages = Array.from({length: numPages}, (_, i) => i + 1);
  } else {
    let fromPage: number;
    if (currentPage <= Math.ceil(paginationLength / 2)) {
      // Render links starting from the first page
      fromPage = 1;
    } else if (currentPage > numPages - Math.floor(paginationLength / 2)) {
      // Render links ending in the last page
      fromPage = numPages - paginationLength + 1;
    } else {
      // Render links in a span centered around the current page
      fromPage = currentPage - Math.floor(paginationLength / 2);
    }
    paginationPages = Array.from(
        {length: paginationLength},
        (_, i) => fromPage + i,
    );
  }

  const paginationButtons = paginationPages.map((i) => (
    <li className={`page-item ${i === currentPage ? 'active' : ''}`} key={i}>
      <Link className="page-link" to={`/page/${i}`} aria-label="Föregående">
        <span>{i}</span>
      </Link>
    </li>
  ));

  return (
    <nav className="mt-3" aria-label="Sidnavigering">
      <ul className="pagination">
        {currentPage > 1 && (
          <>
            <li className="page-item">
              <Link
                className="page-link"
                to="/page/1"
                aria-label="Första sidan"
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link"
                to={`/page/${currentPage - 1}`}
                aria-label="Föregående sida"
              >
                <span aria-hidden="true">&lsaquo;</span>
              </Link>
            </li>
          </>
        )}
        {paginationButtons}
        {currentPage < numPages && (
          <>
            <li className="page-item">
              <Link
                className="page-link"
                to={`/page/${currentPage + 1}`}
                aria-label="Nästa sida"
              >
                <span aria-hidden="true">&rsaquo;</span>
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link"
                to={`/page/${numPages}`}
                aria-label="Sista sidan"
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
