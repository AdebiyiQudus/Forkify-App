// Model => rep the data and business logic of the application. It holds the state of the application
// query => A query ia a request for a specific data and it is often part of a URL or request body specifying information we want

// regenerator-runtime provides neccessary runtime functions and utilities to make ES6+ fetures work across different environments, ensuring compatibility with older browsers,                                                                                                                                                                                                                                                                                                                                                                                                                                                      .
// regenerator-runtime is a runtime library for supporting generators and async/await functions to handle an asynchronous code or operations
import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { entries } from 'core-js/es/array';

// state refers to the current condition or data of the application.
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // default page
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // to create a new recipe object format
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Using AND short circuting with destructuring object => if the recipe.key exist (truthy) return recipe key object  value from data parsed in
    ...(recipe.key && { key: recipe.key }),
  };
};

// Create loadRecipe function and it responsible for fetching recipe data from the forkify API
export const loadRecipe = async function (id) {
  // Adding an error handling
  try {
    // awaits the res.json data and also load my API KEY data
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // STORING Bookmarks => loop through each of the bookmarks and if any of the bookmark id is == to id we received(marked), then set the bookmark to true(active class)
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temporary error handling
    console.error(`${err} 💥💥💥💥`);
    // Re-throwing error => To handle the error message so it can be accessed inside the controller.js from model.js handling, so the promise been return from AJAX will be rejected value or id
    throw err;
  }
};

// The loadSearchResults is an async function bcos it's from an AJAX and it's going to be called by the controller so it will tell loadSearchResults what to search for parsing in query as parameter
export const loadSearchResults = async function (query) {
  try {
    // set the search query to the recipe data reqeusted
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Store new array object in the state after creating a new array object from all the recipe data array (getJSON => API)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Reset page back to 1 when searching for different recipe
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    // Re-throwing error => To handle the error message so it can be accessed inside the controller.js from model.js handling, so the promise been return from getJSON will be rejected value or id
    throw err;
  }
};

// Create a new function for displaying a search result of 10 in a page
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  // the slice method does not include the last value that we parse in (start at 0 end at 9)
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // for each of the ingredients change the qty with the formular specified below
  state.recipe.ingredients.forEach(ing => {
    // newQty = oldQty * newServings / oldSerevings => 2 * 8 / 4 = 4 (for 8 servings)
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // Update the servings value
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  // Storing bookmarks to LC
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // To add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked => i.e if the id parsed(recipe markeed) === to the current id that is loaded by the application
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // find the index of the element of the id that was parsed in(received or marked)
  const index = state.bookmarks.findIndex(el => el.id === id);
  // delete 1 item from the bookmarks array
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked => i.e if the id parsed(recipe clicked or marked) === to the current id that is loaded by the application
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // if the storage exist , then convert the string in the LC to an object, get the item and store it in the bookmarks
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// To clear all bookmarks after reloading the page
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks(); // => Don't call the clearBookmarks coz the all bookmarks will automatically be empty when loading the page

// Making a request to the forkify API which will return an async functiton and receive data for a new recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    //Create a new array and convert the newRecipe object into an array
    const ingredients = Object.entries(newRecipe)
      // filter out the first element(ing) that start with 'ingredient' and the second element(qty) is not an empty string
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // split from the second ingredient string into multiple part which returns a new array then loop through and trim each of the element
        const ingArr = ing[1].split(',').map(el => el.trim()); // trim() => removes the leading and trailing white space and line terminator characters from a string.
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        // return the three element specified using destrucuturing, if the qty is a qty or exist convert to a number else return null value for qty
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // Creating a recipe object for the new UploadRecipe just like the state.recipe format so the API can recieve the data(UploadRecipe) object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Creating AJAX request with sendJSON
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // Store data into state
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
