import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import humidity from '../../assets/humidity-icon.png'
import wind from '../../assets/wind-icon.png'
import toast from "react-hot-toast";


const Weather = () => {
    const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');


  const search = async (city) => {

    if(city == ""){
        toast.error('Enter City Name');
        return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        toast.error(data.message);
        return;
      }

      console.log(data);
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = () => {
    if (city) {
      search(city);
    }
  };

  useEffect(() => {
    search('Kozhikode'); // Default city on initial load
  }, []);

  return (
    <div className='bg-violet-300 h-screen flex flex-col items-center justify-center'>
      {/* Search Bar */}
      <div className='flex items-center rounded-full bg-white shadow-lg p-4 mb-6'>
        <input 
        ref={inputRef}
          type="text" 
          placeholder='Search for the weather...' 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className='outline-none border-none bg-transparent text-gray-700 placeholder-gray-500 px-4 py-2 w-64' 
        />
        <CiSearch 
          className='text-gray-500 text-2xl cursor-pointer hover:text-sky-700 transition-all' 
          onClick={()=>search(inputRef.current.value)}
        />
      </div>

      {/* Weather Info */}
      {weatherData && (
        <>
          <div className='flex flex-col items-center mb-6'>
            <img 
              src={weatherData.icon} 
              alt="Weather icon" 
              className='w-32 h-32 mb-4'
            />
            <p className='text-6xl font-bold text-gray-800'>{weatherData.temperature}°C</p>
            <p className='text-xl text-gray-600 mt-2'>{weatherData.location}</p>
          </div>

          {/* Additional Weather Data */}
          <div className='grid grid-cols-2 gap-6'>
            {/* Humidity */}
            <div className='flex items-center bg-white p-4 rounded-xl shadow-md'>
              <img 
                src={humidity} 
                alt="Humidity icon" 
                className='w-12 h-12'
              />
              <div className='ml-4'>
                <p className='text-2xl font-semibold text-gray-800'>{weatherData.humidity}%</p>
                <span className='text-gray-500'>Humidity</span>
              </div>
            </div>

            {/* Wind Speed */}
            <div className='flex items-center bg-white p-4 rounded-xl shadow-md'>
              <img 
                src={wind} 
                alt="Wind icon" 
                className='w-12 h-12'
              />
              <div className='ml-4'>
                <p className='text-2xl font-semibold text-gray-800'>{weatherData.windSpeed} km/h</p>
                <span className='text-gray-500'>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
