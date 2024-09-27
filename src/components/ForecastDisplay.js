import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureQuarter } from "@fortawesome/free-solid-svg-icons"; // Import the temperature icon

export default function ForecastDisplay({ forecastData }) {
  // Helper function to format date as '24 Aug'
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  // Helper function to get the day name
  const getDayName = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });
  };

  // Function to group forecast data by day and calculate highest and lowest temps
  const getDailyForecasts = (list) => {
    const dailyForecasts = {};

    list.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).setHours(0, 0, 0, 0); // Normalize to day only

      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          temps: [],
          feelsLikeTemps: [],
          humidities: [],
          windSpeeds: [],
          weatherDescriptions: [],
          weatherIcons: [],
        };
      }

      // Collect data for highest and lowest temps
      dailyForecasts[date].temps.push(forecast.main.temp);
      dailyForecasts[date].feelsLikeTemps.push(forecast.main.feels_like);
      dailyForecasts[date].humidities.push(forecast.main.humidity);
      dailyForecasts[date].windSpeeds.push(forecast.wind.speed);
      dailyForecasts[date].weatherDescriptions.push(
        forecast.weather[0].description
      );
      dailyForecasts[date].weatherIcons.push(forecast.weather[0].icon);
    });

    // Convert grouped data into an array of highest and lowest values
    const dailyForecastData = Object.entries(dailyForecasts).map(
      ([date, data]) => {
        const highestTemp = Math.max(...data.temps).toFixed(1);
        const lowestTemp = Math.min(...data.temps).toFixed(1);
        const avgFeelsLikeTemp = (
          data.feelsLikeTemps.reduce((sum, temp) => sum + temp, 0) /
          data.feelsLikeTemps.length
        ).toFixed(1);
        const avgHumidity = (
          data.humidities.reduce((sum, humidity) => sum + humidity, 0) /
          data.humidities.length
        ).toFixed(0);
        const avgWindSpeed = (
          data.windSpeeds.reduce((sum, wind) => sum + wind, 0) /
          data.windSpeeds.length
        ).toFixed(1);

        // Choose the most common weather description and icon for the day
        const descriptionFrequency = {};
        const iconFrequency = {};

        data.weatherDescriptions.forEach((desc) => {
          descriptionFrequency[desc] = (descriptionFrequency[desc] || 0) + 1;
        });

        data.weatherIcons.forEach((icon) => {
          iconFrequency[icon] = (iconFrequency[icon] || 0) + 1;
        });

        const commonDescription = Object.keys(descriptionFrequency).reduce(
          (a, b) => (descriptionFrequency[a] > descriptionFrequency[b] ? a : b)
        );

        const commonIcon = Object.keys(iconFrequency).reduce((a, b) =>
          iconFrequency[a] > iconFrequency[b] ? a : b
        );

        return {
          date: new Date(Number(date)),
          highestTemp,
          lowestTemp,
          avgFeelsLikeTemp,
          avgHumidity,
          avgWindSpeed,
          description: commonDescription,
          icon: commonIcon,
        };
      }
    );

    // Sort the forecasts by date (just to be safe)
    return dailyForecastData.sort((a, b) => a.date - b.date);
  };

  // Get daily forecasts
  const dailyForecasts = getDailyForecasts(forecastData.list);

  return (
    <div className="forecast-display">
      <div className="forecast-details">
        {dailyForecasts.map((forecast, index) => (
          <div className="forecast-item" key={index}>
             <p>{getDayName(forecast.date)} <br></br>{formatDate(forecast.date)}</p>
            <img
              className="forecast-icon"
              src={`${process.env.PUBLIC_URL}/custom-icons/${forecast.icon}.png`}
              alt="weather icon"
            />
            <p>💧 {forecast.avgHumidity}%</p>
            <p>
              <FontAwesomeIcon icon={faTemperatureQuarter} style={{ color: "red" }} />{" "}
              {forecast.highestTemp}°C
            </p> 
            <p><FontAwesomeIcon icon={faTemperatureQuarter} style={{ color: "blue" }} />{" "}
            {forecast.lowestTemp}°C</p>
            <p>
              <FontAwesomeIcon icon={faTemperatureQuarter} style={{ color: "green" }} />{" "}
              Real Feel: {forecast.avgFeelsLikeTemp}°C
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
