const { Wit } = require("node-wit");
const _ = require("lodash");
const { getWeatherInfo } = require("./utils/weather_info");
const { location_info } = require("./utils/location_info");
const { log } = require("./utils/util");
const { get_joke } = require("./utils/get_jokes.js");
const { insult } = require("./utils/get_insult");
const { flirt } = require("./utils/get_pickupLines");
const { holidays } = require("./utils/get_holidays");
const { cases } = require("../constant/cases");


// Wit API access token
const WIT_TOKEN = process.env.WIT_TOKEN || "";

// Set up the wit client
const client = new Wit({
  accessToken: WIT_TOKEN,
});


/**
 * Generates a response for the user based on the chatbot's intent and entities
 * @param {string} intent - The intention identified by the chatbot
 * @param {object} entities - The entities identified by the chatbot
 * @returns {object} - A response object with a text property
 */
async function generateResponse(intent, entities) {
  log.info("Intention Identified as : " + intent);
  const response = {
    intention:intent,
    text:""
  }
  
  switch (intent) {
    case cases.GREETING:
      // Greeting response
      response.text = "Hello! How can I help you today?";
      break;
    case cases.WEATHER:
    case cases.TEMPERATURE:
      // Use the entities to determine the location for the weather request
      try {
        response.text = await getWeatherInfo(entities?.location?.[0]?.body);
      } catch (error) {
        log.error(error);
        response.text = "Sorry, Not able to retrive weather";
      }
      break;
    case cases.LOCATION:
      // Use the entities to determine the location for the info request
      try {
        response.text = await location_info(entities?.location);
      } catch (error) {
        log.error(error);
        response.text = `Sorry, Not able to retrive details ${entities?.location?.[0]?.body
            ? `for ${entities?.location?.[0]?.body}`
            : ""
          }`;
      }
      break;
    case cases.JOKES:
      // Get a joke based on the genre specified in the entities
      try {
        const joke = await get_joke(entities?.genre);
        response.text = joke.text;
        if (joke.setup) {
          response.setup = joke.setup;
          response.delivery = joke.delivery;
        }
      } catch (error) {
        response.text = "Sorry cannot get you a joke for now :("
      }
      break;
    case cases.INSULT:
      // Generate an insult based on the person specified in the entities
      try {
        const res = await insult(entities?.person);
        response.text = res.text;
      } catch (error) {
        log.error(error);
        response.text = "Not worth of my insults"
      }
      break;
    case cases.FLIRT:
        // Generate a pickup line
        try {
          const res = await flirt();
          response.text = res.text;
        } catch (error) {
          log.error(error);
          response.text = "Not worth of my pickup line"
        }
        break;
    case cases.HOLIDAYS:
          // Generate a pickup line
          try {
            const res = await holidays(entities?.location?.[0]?.body);
            response.text = res.text;
          } catch (error) {
            log.error(error);
            response.text = "I am sorry I was not able to find any holidays for you :("
          }
          break;
    default:
      if (intent) {
        // Default response for recognized but unsupported intents
        response.text = `Hey I get you intention of : ${intent} \nbut currently I cannot help you with it :(`
      }else{
        // Default response for unrecognized intents
        response.text = "I am sorry, I do not understand your request.";
      }
      break;
  }

  return response;
}


/**
 * Sends a message to the chatbot and receives a response
 * @param {string} message - The message to send to the chatbot
 * @returns {object} - A response object with a text property
 */
async function chat(message) {
  try {
    // Log the message sent by the user
    log.info("User asked for: " + message);

    const context = {}
    // Send the message to the chatbot
    const response = await client.message(message, context);
    log.info("result has been received from server");

    // Extract the relevant information from the chatbot's response
    let intent = response.intents[0]?.name;
    let entities = response.entities;

    if (intent && intent.includes("$")) {
      // Remove the "$" from the beginning of the intent name
      intent = intent.split("$")[1];
    }
    if (Object.keys(entities).length > 0) {
      // Remove the ":" from the beginning of the entity names
      entities = _.mapKeys(entities, (v, k) => {
        if (k.includes(":")) {
          return k.split(":")[1];
        } else {
          return k;
        }
      });
    }

    // Use the intent and entities to generate a response for the user
    return await generateResponse(intent, entities);
  } catch (error) {
    log.error(error);
    // Return a default error response
    return { text: "Sorry, something went wrong. Could you please try again?" };
  }
}


module.exports = {
  chat,
};


