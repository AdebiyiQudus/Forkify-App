// Rendering bookmarks result by creating a new bookmarks view

import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  // creating error message if our result search does'nt exist(defualt error message)
  _errorMessage = 'No bookmarks yet, Find a nice recipe and bookmark it ;)';
  _successMessage = '';

  // Render bookmark whenever the page is loaded
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // create markup() in the result view, so we can generate the markup in the resultView(.results)
  _generateMarkup() {
    console.log(this._data);
    // loop through each of the data bookmark, display the preview result when the bookmark is clicked and join as a string
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

// Creating instance of an object from the class of the BookmarksView => The class instance is exported as the default export, making it accessible for use in other parts of the application.
export default new BookmarksView();