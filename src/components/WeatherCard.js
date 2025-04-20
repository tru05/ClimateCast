import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Register Chart.js components at the top level
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

const ForecastChart = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return <p>Loading chart data...</p>;
  }

  // Prepare hourly data (assuming 3h intervals)
  const hourlyLabels = forecast.slice(0, 12).map((_, i) => `${i * 3}h`);
  const hourlyTemps = forecast.slice(0, 12).map(item => item.main.temp);

  // Prepare daily data
  const dailyData = forecast.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        temps: [],
        date: date
      };
    }
    acc[date].temps.push(item.main.temp);
    return acc;
  }, {});

  // Get sorted daily labels and temps
  const dailyLabels = Object.keys(dailyData).sort();
  const dailyTemps = dailyLabels.map(date => 
    dailyData[date].temps.reduce((a, b) => a + b, 0) / dailyData[date].temps.length
  );

  return (
    <div className="chart-section">
      <h3>12-Hour Forecast (3h intervals)</h3>
      <div className="chart-container">
        <Line
          data={{
            labels: hourlyLabels,
            datasets: [{
              label: "Temp (°C)",
              data: hourlyTemps,
              borderColor: "blue",
              tension: 0.4,
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
              y: { 
                title: { 
                  display: true, 
                  text: "Temperature °C" 
                } 
              } 
            }
          }}
        />
      </div>

      <h3>7-Day Forecast</h3>
      <div className="chart-container">
        <Line
          data={{
            labels: dailyLabels,
            datasets: [{
              label: "Avg Temp (°C)",
              data: dailyTemps,
              borderColor: "green",
              tension: 0.4,
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
              y: { 
                title: { 
                  display: true, 
                  text: "Temperature °C" 
                } 
              } 
            }
          }}
        />
      </div>
    </div>
  );
};

export default ForecastChart;
