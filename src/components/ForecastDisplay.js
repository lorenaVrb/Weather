import React from "react";

export default function ForecastDisplay({ forecastData }) {
  // Helper function to format date as '24 Aug'
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  // Function to group forecast data by day and calculate averages
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

      // Collect data to calculate averages
      dailyForecasts[date].temps.push(forecast.main.temp);
      dailyForecasts[date].feelsLikeTemps.push(forecast.main.feels_like); // Collect 'feels like' temperatures
      dailyForecasts[date].humidities.push(forecast.main.humidity);
      dailyForecasts[date].windSpeeds.push(forecast.wind.speed);
      dailyForecasts[date].weatherDescriptions.push(
        forecast.weather[0].description
      );
      dailyForecasts[date].weatherIcons.push(forecast.weather[0].icon);
    });

    // Convert grouped data into an array of average values
    const averagedForecasts = Object.entries(dailyForecasts).map(
      ([date, data]) => {
        const avgTemp = (
          data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length
        ).toFixed(1);
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
          avgTemp,
          avgFeelsLikeTemp, // Include 'feels like' temperature
          avgHumidity,
          avgWindSpeed,
          description: commonDescription,
          icon: commonIcon,
        };
      }
    );

    // Sort the forecasts by date (just to be safe)
    return averagedForecasts.sort((a, b) => a.date - b.date);
  };

  // Get daily forecasts
  const dailyForecasts = getDailyForecasts(forecastData.list);

  return (
    <div className="forecast-display">
      <h2>Forecast</h2>
      <div className="forecast-details">
        {dailyForecasts.map((forecast, index) => (
          <div className="forecast-item" key={index}>
            <p>{formatDate(forecast.date)}</p>
            <p>{forecast.avgTemp}°C</p>
            <img
              className="forecast-icon"
              src={`${process.env.PUBLIC_URL}/custom-icons/${forecast.icon}.png`}
              alt="weather icon"
            />

            <p>🌡️ {forecast.avgFeelsLikeTemp}°C</p>
            <p>💧 {forecast.avgHumidity}%</p>
            <p>🌫️ {forecast.avgWindSpeed} m/s</p>
          </div>
        ))}
      </div>
    </div>
  );
}
