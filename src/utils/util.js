
/**
 * Asynchronously sleep for a given number of milliseconds
 * @param {number} ms - The number of milliseconds to sleep
 * @return {Promise} - A promise that resolves after the specified number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * An object containing functions for logging messages to the console and a file
 */
const log = {
  /**
   * Log an info message to the console and a file
   * @param {string} message - The message to log
   */
  info: (message) => {
    const currentDate = new Date().toISOString();
    const logMessage = `[${currentDate}] || INFO ||  ${message}`;
    console.log(logMessage);
    // fs.appendFileSync('./logs.txt', "\n" + logMessage);
  },
  /**
   * Log an error message to the console and a file
   * @param {string} message - The message to log
   */
  error: (message) => {
    const currentDate = new Date().toISOString();
    const logMessage = `[${currentDate}] || ERROR ||  ${message}`;
    console.error(logMessage);
    // fs.appendFileSync('./logs.txt', "\n" + logMessage);
  },
};

function getRandomIndex(array) {
  // Generate a random number between 0 and the length of the array
  const randomNumber = Math.random() * array.length;
  // Round the number down to the nearest integer to get a whole number
  // that is within the bounds of the array
  return Math.floor(randomNumber);
}

module.exports = {
  sleep,
  getRandomIndex,
  log,
};
