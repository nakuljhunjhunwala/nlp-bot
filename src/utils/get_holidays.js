const axios = require("axios");
const moment = require("moment");
const _ = require("lodash");
const BASE_URL = "https://api.api-ninjas.com/v1";
const token = process.env.API_NINJA;


async function holidays(country) {
  if (!country) {return{
    text:"Hey, I get your excitment for holidays, but i need country name too in your question :)"
  }}


  const holidayText = {
    text :`Well I have found some upcoming holidays for you in ${_.capitalize(country)}:\n\n`
  }
const year = new Date().getFullYear()
  const url = BASE_URL + `/holidays?country=${country}&year=${year}`;
  const config = {
    method: "get",
    url: url,
    headers: {
      "X-Api-Key": token,
    },
  };
  try {
    let { data } = await axios(config);
    if (data.length === 0) {
      holidayText.text = `So, Sorry I am not able to get holidays for ${_.capitalize(country)}`
      return holidayText
    }
    data = data.filter(element=> {
      const dateA = moment(element.date);
      const dateB = moment(new Date());
      return dateA.isAfter(dateB);
    })
    data = data.sort((a, b) => {
      const dateA = moment(a.date);
      const dateB = moment(b.date);
      if (dateA.isBefore(dateB)) return -1;
      if (dateA.isAfter(dateB)) return 1;
      return 0;
    });
data = data.slice(0,10)
    data.forEach((holiday,i) =>{
      holidayText.text = holidayText.text + `${i+1} : On ${holiday.date} i.e (${holiday.day}) you have ${holiday.name}\n`
    })
    return holidayText
  } catch (error) {
    throw error;
  }
}

module.exports = {
  holidays
}
