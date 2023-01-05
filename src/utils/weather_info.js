const axios = require('axios').default;
const apiKey = process.env.OPEN_WEATHER_TOKEN;
const url = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Get the current weather information for a given location
 * @param {string} location - The location for which to retrieve weather information
 * @param {string} time - The time for which to retrieve weather information (optional)
 * @return {string} weatherSentence - A sentence describing the current weather in the given location
 */
async function getWeatherInfo(location, time = null) {
  // Add condition if location is not provided, ask for it
  if (!location) {
    return "Please provide a location in your question.";
  }

  // Make a request to the OpenWeatherMap API to get the current weather for the given location
  const weatherUrl = `${url}?q=${location}&appid=${apiKey}&units=metric`;
  try {
    let weatherData = await axios.get(weatherUrl);
    weatherData = weatherData.data;

    // Extract the temperature and weather description from the API response
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    // Format the temperature and description into a sentence
    const weatherSentence = `The current temperature in ${location} is ${temperature} degrees Celsius with ${description}.`;

    // Return the weather sentence
    return weatherSentence;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getWeatherInfo,
};
