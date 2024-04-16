//  Parcel is a web application bundler that helps package and optimize your JS, CSS and other assets for deployment. And it simplifies the build process by automatically analyzing and bundling project dependencies(external libraries, modules or packages)
// afterbegin => This occurs when we inseting a new child element at the beginning of a parent element
// polyfiling => refers to the practice of adding new features ES6) to older browsers that don't suppoprt them natively(To use features by adding external code to make it work across all browsers)
// Hot module relaoding(HMR) => it replaces, adds or remove modules that have been changed
// update() method will only update text and attribute in DOM without having to re-render the entire view
// pushState take 3 arguments => pushState(null, '', URL i.e `#id`)

// To import all the export of a module at the same time (state and loadRecipe)
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// For polyfilling anything else in our codebase
import 'core-js/stable';
// For polyfilling async, await
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    // point to the current url and remove the first character in the id and leave the rest starting from index 1
    const id = window.location.hash.slice(1);

    // using guard clause => Only if id doesn't exist do nothing but if does exist then return all the code below
    if (!id) return;
    // call the renderSpinner()
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id); // loadRecipe is an async fucntion which will return a promise

    // 3) Rendering recipe => create a method called render, so the recipeView can have access to the recipe object and point to all the properties inside the object
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Display error message in the UI
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query => create a method that will be called from the controller called getQuery
    const query = searchView.getQuery();
    // Using Guard clause => if there's a query then return value
    if (!query) return;

    // 2) Load search results => to call the loadSearchResult we built by creating a new function
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(1));

    // 4) Render initial pagination buttons at the same time when displaying the search result
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Creating a new controller => This is the controller that will be executed whenever we click on one of the buttons happens
const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons at the same time when displaying the search result
  paginationView.render(model.state.search);
};

// Creating new controller for servings
const controlServings = function (newServings) {
  // Update the recipe dervings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark => if bookmark is not marked when click then add bookmark with the active class
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // else delete the bookmark
  else model.deleteBookmark(model.state.recipe.id);

  //2) update the bookmarks
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Rendering the newly created recipe to the UI
    recipeView.render(model.state.recipe);

    // Success mesage
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // To change ID in the URL => .history is pointing to the history API of the browser and pushState() method will allow us to change the URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
