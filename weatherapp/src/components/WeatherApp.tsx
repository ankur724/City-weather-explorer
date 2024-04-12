import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

const WeatherApp = () => {
  const { city } = useParams<{ city: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response: AxiosResponse<WeatherData> = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4733a21b8144f2480f062e883113d74b&units=metric`);
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again later.');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : weatherData ? (
        <div className='container'>
          <h1>Weather for {city}</h1>
          <br />
          <div className='info'>
            <p className='temp'>Temperature: {weatherData.main.temp}°C</p>
            <p className='desc'>{weatherData.weather[0].description}</p>
            <p className='humi'>Humidity: {weatherData.main.humidity}%</p>
            <p className='wind'>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p className='pressure'>Atmospheric Pressure: {weatherData.main.pressure} hPa</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherApp;
