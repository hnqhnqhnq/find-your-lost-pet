const fs = require("fs");
const axios = require("axios");

const writeInJSON = async (data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(
      "./../data/cities-and-countries.json",
      jsonData
    );
    console.log("Data successfully written to file");
  } catch (err) {
    console.error("Error writing to file", err);
  }
};

const getCountriesAndCities = async () => {
  try {
    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );
    const data = response.data.data;

    await writeInJSON(data);
  } catch (err) {
    console.error("Error fetching countries and cities:", err);
  }
};

getCountriesAndCities();
