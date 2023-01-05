const JokeAPI = require("sv443-joke-api");
const axios = require("axios");
const _ = require("lodash");
const BASE_URL = "https://api.api-ninjas.com/v1/";
const token = process.env.API_NINJA;

// Enable internal handling of API responses
JokeAPI.SETTINGS.handleResponsesInternally = true;

/**
 * Retrieve a joke from the JokeAPI
 * @param {string} genre - The genre of the joke to retrieve
 * @return {Object} joke - An object containing the joke text and, if applicable, the joke setup and delivery
 */
async function get_joke(genre) {
  // Initialize joke object
  let joke = {
    text: "",
  };

  try {
    // Check if genre was provided
    if (genre) {
      genre = genre[0].body;

      // Get list of available categories
      let categories = await JokeAPI.getCategories();
      categories = categories.categories;

      // Convert categories to lowercase
      categories = categories.map((text) => _.toLower(text));

      // Check if provided genre is valid
      if (!categories.includes(genre)) {
        joke.text = `Hey, I don't have any jokes in the ${genre} genre, but here's something for you:\n`;
        genre = "Any";
      }
      return await jokeAPI(genre,joke)
    } else {
      genre = "Any";
    }

    // joke = jokeAPI(genre, joke);
    const randomNumber = Math.floor(Math.random() * 4);

    switch (randomNumber) {
      case 0:
        return await jokeAPI(genre,joke);
        break;
      case 1:
        return await apiNinjaDadJoke(joke);
        break;
      case 2:
        return await chuckNorrisJoke(joke);
        break;
      case 3:
        return await apiNinjaJoke(joke);
        break;
      default:
        return await apiNinjaJoke(joke);
        break;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function jokeAPI(genre, joke) {
  try {
    // Make request to API for joke in specified genre
    const response = await JokeAPI.makeRequestToApi(`/joke/${genre}`, {});

    // Check if joke is two-part
    if (response.type === "twopart") {
      joke.text = joke.text + `${response.setup}\n\n${response.delivery}`;
      joke.setup = response.setup;
      joke.delivery = response.delivery;
    } else {
      joke.text = joke.text + response.joke;
    }

    return joke;
  } catch (error) {
    throw error;
  }
}

async function apiNinjaDadJoke(joke) {
  const url = BASE_URL + "dadjokes?limit=1";
  const config = {
    method: "get",
    url: url,
    headers: {
      "X-Api-Key": token,
    },
  };
  try {
    const { data } = await axios(config);
    joke.text = data[0]?.["joke"];
    return joke;
  } catch (error) {
    throw error;
  }
}

async function apiNinjaJoke(joke) {
  const url = BASE_URL + "jokes?limit=1";
  const config = {
    method: "get",
    url: url,
    headers: {
      "X-Api-Key": token,
    },
  };
  try {
    const { data } = await axios(config);
    joke.text = data[0]?.["joke"];
    return joke;
  } catch (error) {
    throw error;
  }
}

async function chuckNorrisJoke(joke) {
  const url = BASE_URL + "chucknorris";
  const config = {
    method: "get",
    url: url,
    headers: {
      "X-Api-Key": token,
    },
  };
  try {
    const { data } = await axios(config);
    joke.text = data?.["joke"];
    return joke;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  get_joke,
};
