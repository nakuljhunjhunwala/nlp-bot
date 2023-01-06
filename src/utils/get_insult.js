const axios = require("axios");
const URL = "https://evilinsult.com/generate_insult.php?lang=en&type=json";
const _ = require("lodash");

/**
 * Generate an insult
 * @param {string} name - The name of the person to be insulted (optional)
 * @return {Object} response - An object containing the insult text
 */
async function insult(name) {
  // Initialize response object
  const response = {
    text: "",
  };

  // Check if name was provided and capitalize it
  if (name) {
    name = name[0].body;
    name = _.capitalize(name);
  }

  // Special case if name is "nakul"
  if (name && name.toLowerCase() === "nakul") {
    response.text = "Hell nahh, I won't insult my master.";
    return response;
  }
  // Add name to response text if provided
  else if (name) {
    response.text = `${name}, `;
  }

  try {
    // Get insult from API
    let insultResponse = await axios.get(URL);
    insultResponse = insultResponse.data;

    // Add insult to response text
    response.text = response.text + insultResponse.insult;
  } catch (error) {
    log.error(error);
    response.text = "I don't wanna waste any more of my insults.";
  }

  return response;
}

module.exports = {
  insult,
};
