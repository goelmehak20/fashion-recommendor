import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ToolCard from '../components/ToolCard';
import axios from 'axios';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  season: string;
  icon: string;
}

interface Suggestion {
  title: string;
  description: string;
  imageUrl: string;
}

const WeatherSuggestion: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setIsLoading(true);

    try {
      // Replace with your actual API URL and key
      const response = await axios.get('https://www.weatherapi.com/my/', {
        params: {
          q: 'Punjab', // Change to your desired city
          appid: 'bb184681b38f4b3f9fb92309250403',
          units: 'metric', // Use 'metric' for Celsius
        },
      });

      const data = response.data;
      const temp = data.main.temp;
      const condition = data.weather[0].main;
      const icon = data.weather[0].icon;
      const season = getSeason(temp);

      const weather = {
        city: data.name,
        temperature: temp,
        condition,
        season,
        icon: `http://openweathermap.org/img/w/${icon}.png`, // Icon from OpenWeather API
      };

      setWeatherData(weather);
      generateSuggestion(weather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeason = (temp: number): string => {
    if (temp < 10) return 'Winter';
    if (temp < 18) return 'Spring';
    if (temp < 25) return 'Summer';
    return 'Fall';
  };

  const generateSuggestion = (weather: WeatherData) => {
    let suggestion: Suggestion;

    if (weather.temperature < 10) {
      suggestion = {
        title: 'Winter Outfit',
        description: 'A warm coat with scarf, thermal layers, jeans, and waterproof boots will keep you comfortable in the cold weather.',
        imageUrl: 'https://images.pexels.com/photos/2881785/pexels-photo-2881785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
    } else if (weather.temperature < 18) {
      suggestion = {
        title: 'Spring/Fall Outfit',
        description: 'A light jacket or sweater with jeans or chinos and comfortable sneakers is perfect for the mild temperature.',
        imageUrl: 'https://images.pexels.com/photos/6766239/pexels-photo-6766239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
    } else if (weather.temperature < 25) {
      suggestion = {
        title: 'Warm Weather Outfit',
        description: 'Light fabrics like cotton t-shirts, shorts or light pants, and casual shoes or sandals are ideal for warm days.',
        imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
    } else {
      suggestion = {
        title: 'Hot Weather Outfit',
        description: 'Lightweight, breathable fabrics such as linen shirts, shorts, sundresses, and sandals will help you stay cool.',
        imageUrl: 'https://images.pexels.com/photos/7691064/pexels-photo-7691064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
    }

    setSuggestion(suggestion);
  };

  const handleRefresh = () => {
    toast.success('Refreshing weather data');
    fetchWeatherData();
  };

  return (
    <ToolCard title="Weather Based Suggestions" icon={<CloudSun size={24} />}>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">{weatherData?.city}</h3>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6 flex items-center">
                  <div className="text-6xl font-light">{weatherData?.temperature ?? '--'}°</div>
                  <div className="ml-4">
                    <div className="text-4xl">{weatherData?.icon}</div>
                    <div className="mt-1 text-lg">{weatherData?.condition}</div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  <span>Current Season: {weatherData?.season ?? '--'}</span>
                </div>
              </div>
              
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Tips For Today</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      {weatherData?.temperature && weatherData.temperature < 15
                        ? 'Layer your clothing for warmth'
                        : 'Wear breathable fabrics'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      {weatherData?.season} is here! Perfect time for outfits tailored for {weatherData?.season.toLowerCase()}.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-400 to-teal-500 rounded-lg p-6 text-white"
            >
              <h3 className="text-xl font-semibold">{suggestion?.title}</h3>
              <p className="mt-4">{suggestion?.description}</p>
              <img className="mt-6 rounded-md" src={suggestion?.imageUrl} alt="Suggestion" />
            </motion.div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};

export default WeatherSuggestion;
