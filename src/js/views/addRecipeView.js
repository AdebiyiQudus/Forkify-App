// Math.ceil => To round  to the nwxt highest whole number or integer
// toggle => This is will add a specific class when it ia there and remove the class when it its not there
// Entries() => this method is used to loop through key/value pairs of an array or an object

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // creating a constructor function => super() function is used to call the constructor function of the parent class(View) to inherit it's properties
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // creating toggleWindow() as an handlwe for the ._btnOpen event click
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // BIND METHOD => This method allows us to create a new function from an existing function, change the new function's this context, and provide any arguments you want the new function to return i.e (this._overlay and this._ window)
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // FormData() => is used to gather data from HTML form and the 'this' parsed in the FormData is pointing to the Upload form(i.e the data we want to gather), and it will return an object so we spread the object into an array with [...] i.e the spread operator
      const dataArr = [...new FormData(this)];
      // fromEntries() => This method takes an array of entries and convert it to a new object
      const data = Object.fromEntries(dataArr);
      handler(data); // This is the data we want to upload to the API
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();``