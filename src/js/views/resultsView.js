// Rendering a search result by creating a new search view

import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  // creating error message if our result search does'nt exist(defualt error message)
  _errorMessage = 'No recipes found for your query{: please try again ;)';
  _successMessage = '';

  // create markup() in the result view, so we can generate the markup in the resultView(.results)
  _generateMarkup() {
    // loop through each of the data bookmark, display the preview result when thw search btn is clicked and join as a string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// Creating instance of an object from the class of the ResultsView => The class instance is exported as the default export, making it accessible for use in other parts of the application.
export default new ResultsView();
