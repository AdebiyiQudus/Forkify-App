// The view displays the information to the user and reflects the current state of the model
// Protected property => are not really private but we don't want any external code to accidentally have access or manipulate it
// Protected fields are accessible but can't be overwrite or change unless we use this._ which is wrong to access outside an object or class
// - is always converted into a camelCase notation

import View from './View.js';

// parce 1 import icons from '../img/icons.svg'
// Parcel 2 => to acccess any static assets that are not programming files (images, videos or sound files) from another modules or files use parcel 2
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';

// We want the RecipeView class to inherit the View class(all properties and methods)
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  // The default message we want to display
  _errorMessage = 'We could not find that recipe. Try another one!';
  _successMessage = '';

  addHandlerRender(handler) {
    // hashchange event is triggered when there is a chnage in the id (part of a URL that follows the # symbol) and load event fires off after the page has completely loaded
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  // Display the HTML Markup
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
      <img crossorigin="anonymous"  src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}"> 
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">

      ${this._data.ingredients
        // Loop through each of the ingredient and display
        .map(this._generateMarkupIngredient)
        // To transform all the array of string into big strings
        .join('')} 
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
      `;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        // if the ing quantity exist convert to a fractional string else set to an empty string
        ing.quantity ? fracty(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
  }
}

// Creating instance of an object from the class of the RecipeView => The class instance is exported as the default export, making it accessible for use in other parts of the application.
export default new RecipeView();
