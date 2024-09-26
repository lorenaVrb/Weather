import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "../App.css";

export default function WeatherDisplay({ weatherData }) {
  const [weatherClass, setWeatherClass] = useState("");
  const [iconSrc, setIconSrc] = useState("");
  const [cityTime, setCityTime] = useState("");

  const updateCityTime = () => {
    try {
      if (!weatherData || !weatherData.name || !weatherData.sys) {
        throw new Error("Weather data is incomplete");
      }

      const timezoneOffset = weatherData.timezone; // Timezone offset in seconds
      const currentTime = moment().utc().add(timezoneOffset, "seconds");
      setCityTime(currentTime.format("h:mm:ss A"));

      // Log sunrise and sunset times
      const sunrise = moment.unix(weatherData.sys.sunrise).utc().add(timezoneOffset, "seconds");
      const sunset = moment.unix(weatherData.sys.sunset).utc().add(timezoneOffset, "seconds");
      // console.log("Current Time:", currentTime.format("h:mm:ss A"));
      // console.log("Sunrise:", sunrise.format("h:mm:ss A"));
      // console.log("Sunset:", sunset.format("h:mm:ss A"));

      // Determine if it is daytime or nighttime
      const isDaytime = currentTime.isBetween(sunrise, sunset, null, '[]'); // Include sunrise/sunset
      // console.log(`Is Daytime for ${weatherData.name}:`, isDaytime);

      // Determine background and icon based on weather conditions
      const weatherCondition = weatherData.weather[0].main.toLowerCase();
      let weatherClassName = "";
      let iconName = "";

      switch (weatherCondition) {
        case "clear":
          weatherClassName = isDaytime ? "clear-day-bg" : "clear-night-bg";
          iconName = isDaytime ? "clear-day" : "clear-night";
          break;
        case "rain":
          weatherClassName = isDaytime ? "rain-day-bg" : "rain-night-bg";
          iconName = isDaytime ? "rain-day" : "rain-night";
          break;
        case "snow":
          weatherClassName = isDaytime ? "snow-day-bg" : "snow-night-bg";
          iconName = isDaytime ? "snow-day" : "snow-night";
          break;
        case "clouds":
          weatherClassName = isDaytime ? "cloudy-day-bg" : "cloudy-night-bg";
          iconName = isDaytime ? "cloudy-day" : "cloudy-night";
          break;
        case "thunderstorm":
          weatherClassName = isDaytime ? "thunderstorm-day-bg" : "thunderstorm-night-bg";
          iconName = isDaytime ? "thunderstorm-day" : "thunderstorm-night";
          break;
        default:
          weatherClassName = isDaytime ? "default-day-bg" : "default-night-bg";
          iconName = isDaytime ? "default-day" : "default-night";
          break;
      }

      setWeatherClass(weatherClassName);
      setIconSrc(`${process.env.PUBLIC_URL}/custom-icons/${iconName}.png`);
    } catch (error) {
      console.error("Error in updating city time:", error);
      setCityTime("Error fetching time");
      setWeatherClass("default-night-bg");
      setIconSrc(`${process.env.PUBLIC_URL}/custom-icons/default-night.png`);
    }
  };

  useEffect(() => {
    if (weatherData) {
      updateCityTime();
      const intervalId = setInterval(updateCityTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [weatherData]);

  return (
    <div className={`weather-display ${weatherClass}`}>
      {/* Video background */}
      <video key={weatherClass} autoPlay muted loop>
        <source
          src={`${process.env.PUBLIC_URL}/backgrounds/${weatherClass}.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="current-main">
        <div className="city-name">
          <h2>{weatherData ? weatherData.name : "City Name"}</h2>
          <p className="time">🕒 {cityTime}</p>
          <p>{weatherData ? weatherData.main.temp : "Temperature"}°C</p>
        </div>
      </div>

      <div className="current-details">
        <p>
          Weather:{" "}
          {weatherData ? weatherData.weather[0].description : "Description"}
        </p>
        <p>Humidity: {weatherData ? weatherData.main.humidity : "Humidity"}%</p>
        <p>
          Wind Speed: {weatherData ? weatherData.wind.speed : "Wind Speed"} m/s
        </p>
      </div>
    </div>
  );
}
