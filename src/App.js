import React, { useEffect, useState } from "react";
import "./App.css";
import ForecastChart from "./components/ForecastChart";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = "94675afaee3233bc6672fd5642b7a020"; // Using your key directly

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;

        // Fetch current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        // Fetch weather data
        Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
          .then(([weatherRes, forecastRes]) => 
            Promise.all([weatherRes.json(), forecastRes.json()])
          )
          .then(([weatherData, forecastData]) => {
            setWeather(weatherData);
            setForecast(forecastData.list);
            setLoading(false);
          })
          .catch(err => {
            console.error("ERROR:", err);
            setError("Failed to load weather");
            setLoading(false);
          });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to get your location");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="App">
      <h1>🌤️ ClimateCast</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading ? (
        <p>Loading weather data...</p>
      ) : (
        <div className="weather-container">
          {weather && (
            <div className="weather-card">
              <h2>{weather.name}</h2>
              <p>Temp: {weather.main?.temp}°C</p>
              <p>Feels like: {weather.main?.feels_like}°C</p>
              <p>{weather.weather?.[0]?.description}</p>
            </div>
          )}
          
          {forecast && <ForecastChart forecast={forecast} />}
        </div>
      )}
    </div>
  );
};

export default App;
