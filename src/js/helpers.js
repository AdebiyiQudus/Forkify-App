// helpers.js => The goal of this file is to contain couple of function we reuse in our project
// getJSON() => is used to fetch data from an AJAX request which takes a URL as first parameter abd a callback function as second parameter. The callback function get executed when the request is successful, and then it receives the JSON data returned from the server as its argument
// This function do the fetching of data and converting to JSON'
// POST => is used to send data in order to create or update a resource(data API) on the server(Forkify)

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // If uploadData exist
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          // headers(piece of text) => Information about the request itself
          headers: {
            // This will specify in the request that the data we're going to send is in JSON format , only then our API can accept the data and create a new recipe in the database
            'Content-Type': 'application/json',
          },
          // The data that we want to send => converting the uploadData to a string
          body: JSON.stringify(uploadData),
        }) //else
      : fetch(url);

    // API for Pizza recipes => // Promise.race => if it is the url parsed in that got executed before the timeout, then the res.json data will be fetched otherwise if the timeout runs before the fetch(url) then the promise will get rejected and an error will be throwned
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    // convert to json and read the data in the response object recipe
    const data = await response.json();
    // if response.ok is false (not true) throw a new error
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    // Re-throwing error => To handle the error message inside the model.js from helpers.js, so the promise been return from getJSON will be the reject value or id
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);    
    const data = await response.json();
    
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    
    throw err;
  }
};

// Creating a method for sending JSON
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
    // headers(piece of text) => Information about the request itself
      headers: {
      // This will specify in the request that the data we're going to send is in JSON format , only then our API can accept the data and create a new recipe in the database
        'Content-Type': 'application/json' 
      },
      // The data that we want to send => converting the uploadData to a string
      body: JSON.stringify(uploadData),
    });
 
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
 */
