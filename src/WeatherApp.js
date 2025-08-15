<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer, Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Zap, Navigation, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('Casablanca');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [uvData, setUvData] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
  const searchRef = useRef(null);

  // Votre clé API OpenWeatherMap
  const API_KEY = 'VOTRE_CLE_API_ICI';

  // Villes populaires pour suggestions rapides
  const popularCities = [
    'Casablanca, MA', 'Rabat, MA', 'Marrakech, MA', 'Fes, MA', 'Tangier, MA',
    'Paris, FR', 'London, GB', 'New York, US', 'Tokyo, JP', 'Dubai, AE',
    'Madrid, ES', 'Berlin, DE', 'Rome, IT', 'Cairo, EG', 'Istanbul, TR',
    'Sydney, AU', 'Toronto, CA', 'Mexico City, MX', 'São Paulo, BR', 'Mumbai, IN'
  ];

  useEffect(() => {
    fetchAllWeatherData(city);
  }, [city, unit]);

  // Recherche de villes avec autocomplete
  const searchCities = async (query) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const cities = await response.json();
      
      const formattedCities = cities.map(city => ({
        name: `${city.name}, ${city.country}`,
        fullName: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`,
        lat: city.lat,
        lon: city.lon
      }));

      setCitySuggestions(formattedCities);
    } catch (error) {
      console.error('Erreur recherche villes:', error);
      // Fallback: filtrer les villes populaires
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      );
      setCitySuggestions(filtered.map(city => ({ name: city, fullName: city })));
    }
  };

  // Récupérer toutes les données météo
  const fetchAllWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Météo actuelle
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=fr`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Ville non trouvée. Vérifiez l\'orthographe.');
      }
      
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);

      const { lat, lon } = weatherResult.coord;

      // 2. Prévisions 5 jours
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=fr`
      );
      const forecastResult = await forecastResponse.json();
      setForecastData(forecastResult);

      // 3. Qualité de l'air
      try {
        const airResponse = await fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const airResult = await airResponse.json();
        setAirQualityData(airResult);
      } catch (error) {
        console.log('Qualité de l\'air non disponible');
        setAirQualityData(null);
      }

      // 4. Index UV
      try {
        const uvResponse = await fetch(
          `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const uvResult = await uvResponse.json();
        setUvData(uvResult);
      } catch (error) {
        console.log('Index UV non disponible');
        setUvData(null);
      }
      
    } catch (error) {
      console.error('Erreur API:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.length >= 2) {
      searchCities(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setSearchInput('');
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  const getWeatherIcon = (condition, isNight = false) => {
    const Moon = ({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    );

    const iconMap = {
      'Clear': isNight ? <Moon className="w-8 h-8 text-blue-200" /> : <Sun className="w-8 h-8 text-yellow-400" />,
      'Clouds': <Cloud className="w-8 h-8 text-gray-400" />,
      'Rain': <CloudRain className="w-8 h-8 text-blue-400" />,
      'Drizzle': <CloudDrizzle className="w-8 h-8 text-blue-300" />,
      'Thunderstorm': <Zap className="w-8 h-8 text-purple-400" />,
      'Snow': <CloudSnow className="w-8 h-8 text-blue-200" />,
      'Mist': <Cloud className="w-8 h-8 text-gray-300" />,
      'Fog': <Cloud className="w-8 h-8 text-gray-300" />,
      'Haze': <Cloud className="w-8 h-8 text-gray-300" />,
    };
    return iconMap[condition] || <Cloud className="w-8 h-8 text-gray-400" />;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayName = (dateString) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[new Date(dateString).getDay()];
  };

  const getHourlyForecast = () => {
    if (!forecastData?.list) return [];
    return forecastData.list.slice(0, 8);
  };

  const getDailyForecast = () => {
    if (!forecastData?.list) return [];
    
    const dailyData = {};
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date] || item.dt_txt.includes('12:00')) {
        dailyData[date] = item;
      }
    });
    return Object.values(dailyData).slice(0, 7);
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getUnitSymbol = () => {
    return unit === 'metric' ? '°C' : '°F';
  };

  const getWindUnit = () => {
    return unit === 'metric' ? 'km/h' : 'mph';
  };

  const convertWindSpeed = (speed) => {
    return unit === 'metric' ? (speed * 3.6).toFixed(1) : (speed * 2.237).toFixed(1);
  };

  const getAirQualityStatus = (aqi) => {
    const statuses = {
      1: { label: 'Excellent', color: 'text-green-400' },
      2: { label: 'Bon', color: 'text-green-300' },
      3: { label: 'Modéré', color: 'text-yellow-400' },
      4: { label: 'Mauvais', color: 'text-orange-400' },
      5: { label: 'Très mauvais', color: 'text-red-400' }
    };
    return statuses[aqi] || { label: 'Inconnu', color: 'text-gray-400' };
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { label: 'Faible', color: 'text-green-400' };
    if (uvIndex <= 5) return { label: 'Modéré', color: 'text-yellow-400' };
    if (uvIndex <= 7) return { label: 'Élevé', color: 'text-orange-400' };
    if (uvIndex <= 10) return { label: 'Très élevé', color: 'text-red-400' };
    return { label: 'Extrême', color: 'text-purple-400' };
  };

  // Clic en dehors pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <Loader2 className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 text-blue-400" />
          </div>
          <p className="text-white text-lg">Chargement des données météo...</p>
          <p className="text-slate-400 text-sm mt-2">Récupération des prévisions, qualité de l'air et UV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => fetchAllWeatherData(city)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const isNight = weatherData.weather[0].icon.includes('n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec recherche améliorée */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl font-bold">{weatherData.name}, {weatherData.sys.country}</h1>
            </div>
            
            <div className="relative" ref={searchRef}>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Rechercher une ville..."
                    className="px-4 py-2 pr-10 rounded-xl bg-slate-700/50 backdrop-blur border border-slate-600 focus:border-blue-400 focus:outline-none transition-all w-64"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Dropdown des suggestions */}
              {showSuggestions && (citySuggestions.length > 0 || popularCities.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-600 max-h-60 overflow-y-auto z-50">
                  {searchInput.length >= 2 && citySuggestions.length > 0 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-600">
                        Résultats de recherche
                      </div>
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city.name)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all flex items-center gap-3"
                        >
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{city.fullName || city.name}</span>
                        </button>
                      ))}
                    </>
                  ) : searchInput.length < 2 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-600">
                        Villes populaires
                      </div>
                      {popularCities.slice(0, 8).map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all flex items-center gap-3"
                        >
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{city}</span>
                        </button>
                      ))}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau principal gauche */}
          <div className="lg:col-span-2 space-y-6">
            {/* Température actuelle */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <div className={`absolute inset-0 ${isNight ? 'bg-blue-400/20' : 'bg-yellow-400/20'} rounded-full blur-3xl`}></div>
                    <div className={`relative bg-gradient-to-br ${isNight ? 'from-blue-300 to-blue-500' : 'from-yellow-300 to-orange-400'} rounded-full p-8`}>
                      {getWeatherIcon(weatherData.weather[0].main, isNight)}
                    </div>
                  </div>
                  <div>
                    <div className="text-7xl font-bold">
                      {Math.round(weatherData.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xl text-slate-300 mt-2 capitalize">
                      {weatherData.weather[0].description}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Ressenti: {Math.round(weatherData.main.feels_like)}{getUnitSymbol()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex gap-2">
                  <button
                    onClick={() => setUnit('metric')}
                    className={`px-4 py-2 rounded-lg transition-all ${unit === 'metric' ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit('imperial')}
                    className={`px-4 py-2 rounded-lg transition-all ${unit === 'imperial' ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>

            {/* Prévisions horaires étendues */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-4">Prévisions horaires (24h)</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {getHourlyForecast().map((item, index) => (
                  <div key={index} className="flex-shrink-0 bg-slate-700/30 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="text-sm text-slate-400">
                      {index === 0 ? 'Maintenant' : `${new Date(item.dt * 1000).getHours()}:00`}
                    </div>
                    <div className="my-3">
                      {getWeatherIcon(item.weather[0].main, item.weather[0].icon.includes('n'))}
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.round(item.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {Math.round(item.pop * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Détails météo étendus */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Vent</span>
                </div>
                <div className="text-2xl font-semibold">{convertWindSpeed(weatherData.wind?.speed || 0)} {getWindUnit()}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Direction: {getWindDirection(weatherData.wind?.deg || 0)}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Humidité</span>
                </div>
                <div className="text-2xl font-semibold">{weatherData.main.humidity}%</div>
                <div className="text-xs text-slate-400 mt-1">
                  Point de rosée: {Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5))}°
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Visibilité</span>
                </div>
                <div className="text-2xl font-semibold">{((weatherData.visibility || 10000) / 1000).toFixed(1)} km</div>
                <div className="text-xs text-slate-400 mt-1">
                  {weatherData.visibility > 8000 ? 'Excellent' : weatherData.visibility > 5000 ? 'Bon' : 'Limitée'}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Pression</span>
                </div>
                <div className="text-2xl font-semibold">{weatherData.main.pressure} hPa</div>
                <div className="text-xs text-slate-400 mt-1">
                  {weatherData.main.pressure > 1020 ? 'Élevée' : weatherData.main.pressure < 1000 ? 'Basse' : 'Normal'}
                </div>
              </div>

              {/* Index UV */}
              {uvData && (
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-slate-400">Index UV</span>
                  </div>
                  <div className="text-2xl font-semibold">{Math.round(uvData.value)}</div>
                  <div className={`text-xs mt-1 ${getUVLevel(uvData.value).color}`}>
                    {getUVLevel(uvData.value).label}
                  </div>
                </div>
              )}

              {/* Qualité de l'air */}
              {airQualityData && (
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Wind className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-400">Qualité Air</span>
                  </div>
                  <div className="text-2xl font-semibold">AQI {airQualityData.list[0].main.aqi}</div>
                  <div className={`text-xs mt-1 ${getAirQualityStatus(airQualityData.list[0].main.aqi).color}`}>
                    {getAirQualityStatus(airQualityData.list[0].main.aqi).label}
                  </div>
                </div>
              )}
            </div>

            {/* Graphique de température */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-4">Évolution de la température</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {getHourlyForecast().map((item, index) => {
                  const temps = getHourlyForecast().map(i => i.main.temp);
                  const maxTemp = Math.max(...temps);
                  const minTemp = Math.min(...temps);
                  const height = temps.length > 1 ? ((item.main.temp - minTemp) / (maxTemp - minTemp)) * 100 : 50;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500"
                           style={{ height: `${Math.max(height, 10)}%`, minHeight: '20px' }}>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {Math.round(item.main.temp)}{getUnitSymbol()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {index === 0 ? 'Now' : `${new Date(item.dt * 1000).getHours()}h`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panneau droit - Prévisions 7 jours */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-6">Prévisions 7 jours</h3>
            <div className="space-y-4">
              {getDailyForecast().map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-700/30 rounded-xl transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-slate-400 w-10">
                      {index === 0 ? 'Auj' : getDayName(day.dt_txt)}
                    </div>
                    <div>
                      {getWeatherIcon(day.weather[0].main, day.weather[0].icon.includes('n'))}
                    </div>
                    <div className="text-sm text-slate-400 capitalize">
                      {day.weather[0].description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {Math.round(day.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {Math.round(day.pop * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lever/Coucher du soleil */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="text-lg font-semibold mb-4">Soleil</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sunrise className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-slate-400">Lever</span>
                  </div>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sunset className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-slate-400">Coucher</span>
                  </div>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunset)}</span>
                </div>
              </div>
            </div>

            {/* Températures min/max */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-lg font-semibold mb-4">Températures</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-slate-400">Maximum</span>
                  </div>
                  <span className="font-semibold">{Math.round(weatherData.main.temp_max)}{getUnitSymbol()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Minimum</span>
                  </div>
                  <span className="font-semibold">{Math.round(weatherData.main.temp_min)}{getUnitSymbol()}</span>
                </div>
              </div>
            </div>

            {/* Détails pollution si disponible */}
            {airQualityData && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-lg font-semibold mb-4">Pollution</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CO</span>
                    <span>{airQualityData.list[0].components.co.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NO₂</span>
                    <span>{airQualityData.list[0].components.no2.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PM2.5</span>
                    <span>{airQualityData.list[0].components.pm2_5.toFixed(1)} μg/m³</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

=======
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer, Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Zap, Navigation, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('Casablanca');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [uvData, setUvData] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
  const searchRef = useRef(null);

  // Votre clé API OpenWeatherMap
  const API_KEY = '6e16e52468733575e288e0a7d4d30af1';

  // Villes populaires pour suggestions rapides
  const popularCities = [
    'Casablanca, MA', 'Rabat, MA', 'Marrakech, MA', 'Fes, MA', 'Tangier, MA',
    'Paris, FR', 'London, GB', 'New York, US', 'Tokyo, JP', 'Dubai, AE',
    'Madrid, ES', 'Berlin, DE', 'Rome, IT', 'Cairo, EG', 'Istanbul, TR',
    'Sydney, AU', 'Toronto, CA', 'Mexico City, MX', 'São Paulo, BR', 'Mumbai, IN'
  ];

  useEffect(() => {
    fetchAllWeatherData(city);
  }, [city, unit]);

  // Recherche de villes avec autocomplete
  const searchCities = async (query) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const cities = await response.json();
      
      const formattedCities = cities.map(city => ({
        name: `${city.name}, ${city.country}`,
        fullName: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`,
        lat: city.lat,
        lon: city.lon
      }));

      setCitySuggestions(formattedCities);
    } catch (error) {
      console.error('Erreur recherche villes:', error);
      // Fallback: filtrer les villes populaires
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      );
      setCitySuggestions(filtered.map(city => ({ name: city, fullName: city })));
    }
  };

  // Récupérer toutes les données météo
  const fetchAllWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Météo actuelle
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=fr`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Ville non trouvée. Vérifiez l\'orthographe.');
      }
      
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);

      const { lat, lon } = weatherResult.coord;

      // 2. Prévisions 5 jours
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=fr`
      );
      const forecastResult = await forecastResponse.json();
      setForecastData(forecastResult);

      // 3. Qualité de l'air
      try {
        const airResponse = await fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const airResult = await airResponse.json();
        setAirQualityData(airResult);
      } catch (error) {
        console.log('Qualité de l\'air non disponible');
        setAirQualityData(null);
      }

      // 4. Index UV
      try {
        const uvResponse = await fetch(
          `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const uvResult = await uvResponse.json();
        setUvData(uvResult);
      } catch (error) {
        console.log('Index UV non disponible');
        setUvData(null);
      }
      
    } catch (error) {
      console.error('Erreur API:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.length >= 2) {
      searchCities(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setSearchInput('');
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  const getWeatherIcon = (condition, isNight = false) => {
    const Moon = ({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    );

    const iconMap = {
      'Clear': isNight ? <Moon className="w-8 h-8 text-blue-200" /> : <Sun className="w-8 h-8 text-yellow-400" />,
      'Clouds': <Cloud className="w-8 h-8 text-gray-400" />,
      'Rain': <CloudRain className="w-8 h-8 text-blue-400" />,
      'Drizzle': <CloudDrizzle className="w-8 h-8 text-blue-300" />,
      'Thunderstorm': <Zap className="w-8 h-8 text-purple-400" />,
      'Snow': <CloudSnow className="w-8 h-8 text-blue-200" />,
      'Mist': <Cloud className="w-8 h-8 text-gray-300" />,
      'Fog': <Cloud className="w-8 h-8 text-gray-300" />,
      'Haze': <Cloud className="w-8 h-8 text-gray-300" />,
    };
    return iconMap[condition] || <Cloud className="w-8 h-8 text-gray-400" />;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayName = (dateString) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[new Date(dateString).getDay()];
  };

  const getHourlyForecast = () => {
    if (!forecastData?.list) return [];
    return forecastData.list.slice(0, 8);
  };

  const getDailyForecast = () => {
    if (!forecastData?.list) return [];
    
    const dailyData = {};
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date] || item.dt_txt.includes('12:00')) {
        dailyData[date] = item;
      }
    });
    return Object.values(dailyData).slice(0, 7);
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getUnitSymbol = () => {
    return unit === 'metric' ? '°C' : '°F';
  };

  const getWindUnit = () => {
    return unit === 'metric' ? 'km/h' : 'mph';
  };

  const convertWindSpeed = (speed) => {
    return unit === 'metric' ? (speed * 3.6).toFixed(1) : (speed * 2.237).toFixed(1);
  };

  const getAirQualityStatus = (aqi) => {
    const statuses = {
      1: { label: 'Excellent', color: 'text-green-400' },
      2: { label: 'Bon', color: 'text-green-300' },
      3: { label: 'Modéré', color: 'text-yellow-400' },
      4: { label: 'Mauvais', color: 'text-orange-400' },
      5: { label: 'Très mauvais', color: 'text-red-400' }
    };
    return statuses[aqi] || { label: 'Inconnu', color: 'text-gray-400' };
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { label: 'Faible', color: 'text-green-400' };
    if (uvIndex <= 5) return { label: 'Modéré', color: 'text-yellow-400' };
    if (uvIndex <= 7) return { label: 'Élevé', color: 'text-orange-400' };
    if (uvIndex <= 10) return { label: 'Très élevé', color: 'text-red-400' };
    return { label: 'Extrême', color: 'text-purple-400' };
  };

  // Clic en dehors pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <Loader2 className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 text-blue-400" />
          </div>
          <p className="text-white text-lg">Chargement des données météo...</p>
          <p className="text-slate-400 text-sm mt-2">Récupération des prévisions, qualité de l'air et UV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => fetchAllWeatherData(city)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const isNight = weatherData.weather[0].icon.includes('n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec recherche améliorée */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl font-bold">{weatherData.name}, {weatherData.sys.country}</h1>
            </div>
            
            <div className="relative" ref={searchRef}>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Rechercher une ville..."
                    className="px-4 py-2 pr-10 rounded-xl bg-slate-700/50 backdrop-blur border border-slate-600 focus:border-blue-400 focus:outline-none transition-all w-64"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Dropdown des suggestions */}
              {showSuggestions && (citySuggestions.length > 0 || popularCities.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-600 max-h-60 overflow-y-auto z-50">
                  {searchInput.length >= 2 && citySuggestions.length > 0 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-600">
                        Résultats de recherche
                      </div>
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city.name)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all flex items-center gap-3"
                        >
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{city.fullName || city.name}</span>
                        </button>
                      ))}
                    </>
                  ) : searchInput.length < 2 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-600">
                        Villes populaires
                      </div>
                      {popularCities.slice(0, 8).map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all flex items-center gap-3"
                        >
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{city}</span>
                        </button>
                      ))}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau principal gauche */}
          <div className="lg:col-span-2 space-y-6">
            {/* Température actuelle */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <div className={`absolute inset-0 ${isNight ? 'bg-blue-400/20' : 'bg-yellow-400/20'} rounded-full blur-3xl`}></div>
                    <div className={`relative bg-gradient-to-br ${isNight ? 'from-blue-300 to-blue-500' : 'from-yellow-300 to-orange-400'} rounded-full p-8`}>
                      {getWeatherIcon(weatherData.weather[0].main, isNight)}
                    </div>
                  </div>
                  <div>
                    <div className="text-7xl font-bold">
                      {Math.round(weatherData.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xl text-slate-300 mt-2 capitalize">
                      {weatherData.weather[0].description}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Ressenti: {Math.round(weatherData.main.feels_like)}{getUnitSymbol()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex gap-2">
                  <button
                    onClick={() => setUnit('metric')}
                    className={`px-4 py-2 rounded-lg transition-all ${unit === 'metric' ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit('imperial')}
                    className={`px-4 py-2 rounded-lg transition-all ${unit === 'imperial' ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>

            {/* Prévisions horaires étendues */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-4">Prévisions horaires (24h)</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {getHourlyForecast().map((item, index) => (
                  <div key={index} className="flex-shrink-0 bg-slate-700/30 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="text-sm text-slate-400">
                      {index === 0 ? 'Maintenant' : `${new Date(item.dt * 1000).getHours()}:00`}
                    </div>
                    <div className="my-3">
                      {getWeatherIcon(item.weather[0].main, item.weather[0].icon.includes('n'))}
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.round(item.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {Math.round(item.pop * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Détails météo étendus */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Vent</span>
                </div>
                <div className="text-2xl font-semibold">{convertWindSpeed(weatherData.wind?.speed || 0)} {getWindUnit()}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Direction: {getWindDirection(weatherData.wind?.deg || 0)}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Humidité</span>
                </div>
                <div className="text-2xl font-semibold">{weatherData.main.humidity}%</div>
                <div className="text-xs text-slate-400 mt-1">
                  Point de rosée: {Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5))}°
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Visibilité</span>
                </div>
                <div className="text-2xl font-semibold">{((weatherData.visibility || 10000) / 1000).toFixed(1)} km</div>
                <div className="text-xs text-slate-400 mt-1">
                  {weatherData.visibility > 8000 ? 'Excellent' : weatherData.visibility > 5000 ? 'Bon' : 'Limitée'}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Pression</span>
                </div>
                <div className="text-2xl font-semibold">{weatherData.main.pressure} hPa</div>
                <div className="text-xs text-slate-400 mt-1">
                  {weatherData.main.pressure > 1020 ? 'Élevée' : weatherData.main.pressure < 1000 ? 'Basse' : 'Normal'}
                </div>
              </div>

              {/* Index UV */}
              {uvData && (
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-slate-400">Index UV</span>
                  </div>
                  <div className="text-2xl font-semibold">{Math.round(uvData.value)}</div>
                  <div className={`text-xs mt-1 ${getUVLevel(uvData.value).color}`}>
                    {getUVLevel(uvData.value).label}
                  </div>
                </div>
              )}

              {/* Qualité de l'air */}
              {airQualityData && (
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Wind className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-400">Qualité Air</span>
                  </div>
                  <div className="text-2xl font-semibold">AQI {airQualityData.list[0].main.aqi}</div>
                  <div className={`text-xs mt-1 ${getAirQualityStatus(airQualityData.list[0].main.aqi).color}`}>
                    {getAirQualityStatus(airQualityData.list[0].main.aqi).label}
                  </div>
                </div>
              )}
            </div>

            {/* Graphique de température */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-4">Évolution de la température</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {getHourlyForecast().map((item, index) => {
                  const temps = getHourlyForecast().map(i => i.main.temp);
                  const maxTemp = Math.max(...temps);
                  const minTemp = Math.min(...temps);
                  const height = temps.length > 1 ? ((item.main.temp - minTemp) / (maxTemp - minTemp)) * 100 : 50;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500"
                           style={{ height: `${Math.max(height, 10)}%`, minHeight: '20px' }}>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {Math.round(item.main.temp)}{getUnitSymbol()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {index === 0 ? 'Now' : `${new Date(item.dt * 1000).getHours()}h`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panneau droit - Prévisions 7 jours */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-6">Prévisions 7 jours</h3>
            <div className="space-y-4">
              {getDailyForecast().map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-700/30 rounded-xl transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-slate-400 w-10">
                      {index === 0 ? 'Auj' : getDayName(day.dt_txt)}
                    </div>
                    <div>
                      {getWeatherIcon(day.weather[0].main, day.weather[0].icon.includes('n'))}
                    </div>
                    <div className="text-sm text-slate-400 capitalize">
                      {day.weather[0].description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {Math.round(day.main.temp)}{getUnitSymbol()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {Math.round(day.pop * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lever/Coucher du soleil */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="text-lg font-semibold mb-4">Soleil</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sunrise className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-slate-400">Lever</span>
                  </div>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sunset className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-slate-400">Coucher</span>
                  </div>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunset)}</span>
                </div>
              </div>
            </div>

            {/* Températures min/max */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-lg font-semibold mb-4">Températures</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-slate-400">Maximum</span>
                  </div>
                  <span className="font-semibold">{Math.round(weatherData.main.temp_max)}{getUnitSymbol()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Minimum</span>
                  </div>
                  <span className="font-semibold">{Math.round(weatherData.main.temp_min)}{getUnitSymbol()}</span>
                </div>
              </div>
            </div>

            {/* Détails pollution si disponible */}
            {airQualityData && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-lg font-semibold mb-4">Pollution</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CO</span>
                    <span>{airQualityData.list[0].components.co.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NO₂</span>
                    <span>{airQualityData.list[0].components.no2.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PM2.5</span>
                    <span>{airQualityData.list[0].components.pm2_5.toFixed(1)} μg/m³</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

>>>>>>> dca54a124c5b74f120492f22c04be8bc41c68d20
export default WeatherApp;