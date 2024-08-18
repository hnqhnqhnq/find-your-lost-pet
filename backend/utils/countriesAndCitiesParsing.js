const fs = require("fs");

const countriesAndCities = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/cities-and-countries.json`, "utf-8")
);

const countries = countriesAndCities.map((data) => data.country);
const citiesOfCountries = countriesAndCities.reduce((acc, data) => {
  acc[data.country] = data.cities;
  return acc;
}, {});

module.exports = {
  countries,
  citiesOfCountries,
};
