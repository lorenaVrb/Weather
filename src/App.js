import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';

function WeatherApp() {
  const [city, setCity] = useState(''); // State for storing the user's input city
  const [weatherData, setWeatherData] = useState(null); // State for storing weather data from API
  const [forecastData, setForecastData] = useState(null); // State for storing forecast data
  const [loading, setLoading] = useState(false); // State for handling loading state
  const [error, setError] = useState(null); // State for handling errors

  const apiKey = '11c73f11c25fe9f45197c00a2e42787a';

  // Mapping city names to their country codes
  const getCityWithCountryCode = (cityName) => {
    const cityCountryMap = {
      "Dublin": "IE",
      "Melbourne": "AU",
      // Add more cities here if needed
    };

    const countryCode = cityCountryMap[cityName] || "";
    return countryCode ? `${cityName},${countryCode}` : cityName;
  };

  // Function to fetch weather data using city name or coordinates
  const fetchWeatherData = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await axios.get(url);
      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${weatherResponse.data.name},${weatherResponse.data.sys.country}&appid=${apiKey}&units=metric`
      );
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError('Could not fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          fetchWeatherData(weatherUrl);
        },
        () => {
          setError('Unable to retrieve your location. Please search for your city.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Fetch current location weather data on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = (cityName) => {
    setCity(cityName); // Update the city state
    const titleCaseCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase(); // Convert to title case
    const cityWithCountry = getCityWithCountryCode(titleCaseCity);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityWithCountry}&appid=${apiKey}&units=metric`;
    fetchWeatherData(weatherUrl);
  };
  

  return (
    <div className="weather-app">
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weatherData && <WeatherDisplay weatherData={weatherData} />}
      {forecastData && <ForecastDisplay forecastData={forecastData} />}
    </div>
  );
}

export default WeatherApp;
