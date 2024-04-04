// In publisher subscriber pattern => The PUBLISHER is the one that know when to react to code i.e addHandlerSearch()
// The SUBSCRIBER =>  Is the code that we want to react to i.e controlRecipe()
// When we submit a form, we need to prevent it's default action so the same page won't reload

class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    // To get the value of the searchField from the Search parentEl
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // clear the search input field after getting the query
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // We want only when submit or click on search btn, then the controlSearchResult should get fired off
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // The handler function is the controSearchResult function
    });
  }
}

// Creating instance of an object from the class of the SearchView => The class instance is exported as the default export, making it accessible for use in other parts of the application.
export default new SearchView();
