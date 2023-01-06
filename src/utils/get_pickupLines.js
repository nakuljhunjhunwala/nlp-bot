const axios = require("axios");
const URL = "https://api-inference.huggingface.co/models/gagan3012/pickuplines";
const huggingfaceToken = process.env.HUGGING_FACE;

// List of possible start phrases
const startPhrases = [
  "I think",
  "Aside from being sexy",
  "There is plenty of fish in the sea",
  "Excuse me",
  "Believe me",
  "Somebody calls the cops",
  "Be mine",
  "You’ve got everything",
  "I’m not flirting",
  "Are you going to kiss me",
  "Smile if you",
  "Every time",
  "You are the reason",
  "Your eyes are like",
  "You are so beautiful that"
];

/**
 * Generate a flirtatious pickup line
 * @return {object} response - An object containing the generated pickup line
 */
async function flirt() {
  // Initialize response object
  const response = {
    text: "",
  };

  // Choose a random start phrase
  const randomText = startPhrases[Math.floor(Math.random() * startPhrases.length)];

  // Create request body
  const body = JSON.stringify({
    inputs: randomText,
    wait_for_model: true,
  });

  // Configure request options
  const config = {
    method: "post",
    url: URL,
    headers: {
      Authorization: `Bearer ${huggingfaceToken}`,
      "Content-Type": "application/json",
    },
    data: body,
  };

  try {
    // Send request to API
    let pickuplines = await axios(config);
    pickuplines = pickuplines.data;
    // Add generated text to response
    response.text = pickuplines[0].generated_text;
  } catch (error) {
    log.error(error);
    response.text = "Not in the mood right now. Come back later :)";
  }

  return response;
}

module.exports = {
  flirt,
};

