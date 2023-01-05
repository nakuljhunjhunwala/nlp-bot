const { sleep } = require("./util");
const axios = require("axios").default;

// Import the API key from environment variables
const apiKey = process.env.LOCATION_DETAILS_TOKEN;
const url = "https://wft-geo-db.p.rapidapi.com/v1";

/**
 * Retrieve information about a location
 * @param {string} location - The name of the location to look up
 * @return {string} - A description of the location
 */
async function location_info(location) {
  // Check if a location was provided
  if (!location) {
    return "Please provide a location in your question.";
  }

  // Determine the type of location (city or country)
  const locationType = location[0].resolved.values[0].domain;
  location = location[0].body;

  // Set up the request configuration
  const config = {
    method: "get",
    url: url,
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  // If the location is a country, retrieve information about the country
  if (locationType === "country") {
    const completeUrl = `${url}/geo/countries?namePrefix=${location}`;
    config.url = completeUrl;
    try {
      let data = await axios(config);
      data = data.data.data || [];

      // Wait one second before continuing to avoid rate limiting
      await sleep(1000);

      // If a country was found, retrieve detailed information about the country
      if (data.length > 0) {
        let text = "";
        const countryCode = data[0].code;
        const completeUrlForCountryDetail = `${url}/geo/countries/${countryCode}`;
        config.url = completeUrlForCountryDetail;
        let countryData = await axios(config);
        countryData = countryData.data.data || {};
        text = `${countryData.name} is a country with ${
          countryData.numRegions
        } region.
Capital: ${countryData.capital},
CallingCode: ${countryData.callingCode},
Currency: ${countryData.currencyCodes.join(",")},
Flag: ${countryData.flagImageUri},
Country Code: ${countryData.code}
        `;
        return text;
      } else {
        // If no country was found, return an error message
        return `Sorry! I don't have any information about ${location}.`;
      }
    } catch (error) {
      throw error;
    }
  } else {
    // If the location is a city, retrieve information about the city
    const completeUrl = `${url}/geo/cities?namePrefix=${location}`;
    config.url = completeUrl;
    try {
      let data = await axios(config);
      data = data.data.data || [];

      // Determine the number of cities found
      let text = "";
      if (data.length > 1) {
        text = "Well, I found multiple cities for your query.";
      } else if (data.length === 1) {
        text = "I have found one city for your query.";
      } else {
        text = `Sorry! I don't have any information about ${location}.`;
      }

      // Iterate through the list of cities and build the response string
      data.forEach((city, i) => {
        text += `
      ${i + 1}: ${city.city} is a ${city.type} situated in ${city.region}, ${
          city.country
        } with population of ${city.population}`;
      });
      return text;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  location_info,
};
