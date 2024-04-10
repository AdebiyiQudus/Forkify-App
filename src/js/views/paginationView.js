// Math.ceil => To round  to the nwxt highest whole number or integer

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaiginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Using the Publisher-Subscriber Pattern
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // find the closest parent element that matches with the class of .btn--inline
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // To Go get number of the btn clicked
      const goToPage = +btn.dataset.goto;
      handler(goToPage); // This is reffering to controlPagination
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // if we are on Page 1, and they are other pages then the current pages must be < number of pages
    if (curPage === 1 && numPages > 1) {
      return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
    `;
    }

    // if we are on the  Last page
    if (curPage === numPages && numPages > 1) {
      return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>
    `;
    }

    // Other page
    if (curPage < numPages) {
      return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
   </button>
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
   </button>
    `;
    }

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaiginationView();