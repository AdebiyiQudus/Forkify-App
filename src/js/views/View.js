// createRange() => This a range of object that rep a range of text in the DOM. Andit is also used in selecting texting, replacing text or applying styles to a specific range of text
// DocumentFragment is used when you need o manipulate a group of nodes before inserting them into the DOM.
// createContextualFragment => This is a container that can hold a collection of nodes, such as elements, text nodes or other document fragment. This is useful for parsing HTML strings into DOM including current state and structure
// createContextualFragment => is used to create DocumentFragment from a string of HTML markup
// converting a nodeList into a an array with Array.from
// isEqualNode => It's used to compare two DOM nodes to determine if they are equal in terms of their structure and content.
// trim() method is used to remove whitespace characters from both ends of a string. Whitespace characters include spaces, tabs, and newlines
// setAttribute() method is used to add a new attribute or update an exiating attribute of an HTML element

// Parcel 2 => to acccess any static assets that are not programming files (images, videos or sound files) from another modules or files use parcel 2
import icons from 'url:../../img/icons.svg';

// We will use this as parent class for other child  class in the recipeView and resultView
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance(object)
   * @author Adebiyi Qudus
   * @todo Finish implementation
   */

  // The render method that accepts and receives the recipe data and then store it inside the RecipeView class object
  render(data, render = true) {
    // when the render() is first called and its receives the data for the first time, check if the data doesn't exist or if there's data and the array is empty (=== 0)
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // if render is false return the markup that was just generated
    if (!render) return markup;

    // To remove the previous markup before displaying our recipe details (ingredient, icon, time)in the DOM
    this._clear();
    // To insert the markup variable at the beginning of a parent element(class of 'recipe i.e the recipeContainer)
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Convert markup string into a DOM object so it can be to compare with the actual DOM on the page
    // And creating a container of a markup string from the generatedMarkup from the updated data fetched
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // select all the element that contains the new element with the '*' symbol
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        // Using optional chaining => text content of the firstChild of the newEl is !== ''
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES => change attribute when the new one is different from the old one
      if (!newEl.isEqualNode(curEl))
        // converting the attribute into an array and looping through each of the attribute
        Array.from(newEl.attributes).forEach(attr =>
          // update curEl attr.name and value from the newEl attribute
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // This clear() will be usuable for all the views as long as they have the parentElement property
  _clear() {
    this._parentElement.innerHTML = ''; // paarentElement is cleared before new markup is been generated
  }

  // To display a spinner
  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    // before we display the spinner remove or clear the parent element(recipe container)
    this._clear();
    // To display the spinner as a child of the parentElement in the DOM using the afterbegin(inserting child at the beginning of a parent element)
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // If no message is parsed in as error message then display the default error message in the UI
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
      <p>${message}</p>
    </div>
  `;
    // before we display the spinner remove or clear the parent element(recipe container)
    this._clear();
    // before we display the error message, remove or clear the parent element(recipe container) and display at the beginning of the recipe container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Implementing method for a success message
  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
        <p>${message}</p>
      </div>
    `;
    // before we display the spinner remove or clear the parent element(recipe container)
    this._clear();
    // before we display the error message, remove or clear the parent element(recipe container) and display at the beginning of the recipe container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
