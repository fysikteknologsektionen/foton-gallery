import {Link} from 'react-router-dom';
import React from 'react';

export const GalleryPagination: React.VFC<{
  count: number;
  currentPage: number;
}> = ({count, currentPage}) => {
  // Total number of pages
  const numPages = Math.ceil(count / 32);
  // Maximum length of direct links in the pagination list
  const paginationLength = 5;

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

  /**
   * Function that generates pagination buttons
   * @param i Page number
   * @returns Pagination button component
   */
  const paginationButton = (i: number) => (
    <li className={`page-item ${i === currentPage ? 'active' : ''}`} key={i}>
      <Link className="page-link" to={`/page/${i}`} aria-label="Föregående">
        {i}
      </Link>
    </li>
  );

  // Generate direct link-buttons
  const paginationButtons = paginationPages.map((i) => paginationButton(i));

  // Add 1 & '...' buttons
  if (paginationButtons[0].key !== '1') {
    if (paginationButtons[0].key !== '2') {
      paginationButtons.unshift(
          <li
            className="page-item disabled"
            aria-hidden="true"
            key="dots-start"
          >
            <span className="page-link">...</span>
          </li>,
      );
    }
    paginationButtons.unshift(paginationButton(1));
  }

  // Add '...' & last page buttons
  const lastIndex = paginationButtons.length - 1;
  if (paginationButtons[lastIndex].key !== numPages.toString()) {
    if (paginationButtons[lastIndex].key !== (numPages - 1).toString()) {
      paginationButtons.push(
          <li className="page-item disabled" aria-hidden="true" key="dots-end">
            <span className="page-link">...</span>
          </li>,
      );
    }
    paginationButtons.push(paginationButton(numPages));
  }

  return (
    <nav className="mt-3" aria-label="Sidnavigering">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link
            className="page-link"
            to="/page/1"
            aria-label="Första sidan"
            aria-disabled={currentPage === 1 ? 'true' : 'false'}
          >
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link
            className="page-link"
            to={`/page/${currentPage - 1}`}
            aria-label="Föregående sida"
            aria-disabled={currentPage === 1 ? 'true' : 'false'}
          >
            <span aria-hidden="true">&lsaquo;</span>
          </Link>
        </li>
        {paginationButtons}
        <li
          className={`page-item ${currentPage === numPages ? 'disabled' : ''}`}
        >
          <Link
            className="page-link"
            to={`/page/${currentPage + 1}`}
            aria-label="Nästa sida"
            aria-disabled={currentPage === numPages ? 'true' : 'false'}
          >
            <span aria-hidden="true">&rsaquo;</span>
          </Link>
        </li>
        <li
          className={`page-item ${currentPage === numPages ? 'disabled' : ''}`}
        >
          <Link
            className="page-link"
            to={`/page/${numPages}`}
            aria-label="Sista sidan"
            aria-disabled={currentPage === numPages ? 'true' : 'false'}
          >
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
