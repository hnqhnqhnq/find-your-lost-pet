import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangeData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showFirstName, setShowFirstName] = useState(false);
  const [showLastName, setShowLastName] = useState(false);
  const [showCountryCity, setShowCountryCity] = useState(false);

  const navigate = useNavigate();

  const citiesAndCountries = require("./../data/cities-and-countries.json");

  const handleSave = async () => {
    const updateData = {};
    if (showFirstName) updateData.firstName = firstName;
    if (showLastName) updateData.lastName = lastName;
    if (showCountryCity) {
      updateData.country = country;
      updateData.city = city;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/changeUserData",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Data updated successfully.");
        navigate("/profile");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const countries = citiesAndCountries.map((item) => item.country);

  const cities = country
    ? citiesAndCountries.find((item) => item.country === country)?.cities || []
    : [];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[300px]'>
        <h2 className='text-2xl font-bold mb-6'>Change User Data</h2>

        {error && <div className='text-red-600 text-center mb-4'>{error}</div>}
        {success && (
          <div className='text-green-600 text-center mb-4'>{success}</div>
        )}

        <div className='mb-4 text-left'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            <input
              type='checkbox'
              checked={showFirstName}
              onChange={(e) => setShowFirstName(e.target.checked)}
              className='mr-2'
            />
            Change First Name
          </label>
          {showFirstName && (
            <input
              type='text'
              className='w-full px-3 py-2 border rounded-lg'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Enter new first name'
            />
          )}
        </div>

        <div className='mb-4 text-left'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            <input
              type='checkbox'
              checked={showLastName}
              onChange={(e) => setShowLastName(e.target.checked)}
              className='mr-2'
            />
            Change Last Name
          </label>
          {showLastName && (
            <input
              type='text'
              className='w-full px-3 py-2 border rounded-lg'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Enter new last name'
            />
          )}
        </div>

        <div className='mb-4 text-left'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            <input
              type='checkbox'
              checked={showCountryCity}
              onChange={(e) => setShowCountryCity(e.target.checked)}
              className='mr-2'
            />
            Change Country and City
          </label>
          {showCountryCity && (
            <>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm mb-4'
              >
                <option value=''>Select your country</option>
                {countries.map((countryName, index) => (
                  <option key={index} value={countryName}>
                    {countryName}
                  </option>
                ))}
              </select>

              {country && (
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow placeholder-gray-400 shadow-sm'
                >
                  <option value=''>Select your city</option>
                  {cities.map((cityName, index) => (
                    <option key={index} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>

        <button
          className='mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangeData;
