import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const WeatherApp = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4733a21b8144f2480f062e883113d74b&units=metric`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div>
      {weatherData ? (
        <div className='container'>
         <h1>Weather for {city}</h1>
         <br></br>
         <div className='info'>
         <p className='temp'>Temperature: {weatherData.main.temp}°C   </p>
         {/* <span className='tempicon'>  <FaTemperatureHigh /> </span> */}

          <p className='desc'>{weatherData.weather[0].description}</p>
          
          <p className='humi'>Humidity: {weatherData.main.humidity}%</p>
          <p className='wind'>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p className='pressure'>Atmospheric Pressure: {weatherData.main.pressure} hPa</p>
         
        </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherApp;
