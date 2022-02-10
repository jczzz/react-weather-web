import React, { useState, useEffect } from "react";

import styled from 'styled-components';
import ChooseCity from './components/ChooseCity';
import device from './util/Device';
import Result from './components/Result';
import NotFound from './components/NotFound';

const AppTitle = styled.h1`
  display: block;
  height: 64px;
  margin: 0;
  padding: 20px 0;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 400;
  color: #ffffff;
  transition: 0.3s 1.4s;


  ${({ showLabel }) =>
  showLabel &&
    `
    opacity: 1;
    height: auto;
    position: relative;
    padding: 20px 0;
    font-size: 30px;
    top: 20%;
    text-align: center;
    transition: .5s;
    @media ${device.tablet} {
      font-size: 40px;
    }
    @media ${device.laptop} {
      font-size: 50px;
    }
    @media ${device.laptopL} {
      font-size: 60px;
    }
    @media ${device.desktop} {
      font-size: 70px;
    }
    
  `}

  ${({ showResult }) =>
    showResult &&
    `
    opacity: 0;
    visibility: hidden;
    top: 10%;
  `}
`;

const WeatherWrapper = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  width: 100%;
  position: relative;
`;

function App() {
  const [city, setCity] = useState('Vancouver,ca');
  const [error, setError] = useState(false)
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([])

  const changeCity =(e) => {
    setCity(e.target.value)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.REACT_APP_API_KEY}&units=metric`);
        const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${process.env.REACT_APP_API_KEY}&units=metric`);
        const data_w = await weather.json()
        const data_f = await forecast.json()
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'Nocvember',
          'December',
        ];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDate = new Date();

        const date = `${days[currentDate.getDay()]} , ${months[currentDate.getMonth()]} ${currentDate.getDate()} , ${currentDate.getFullYear()}`;
        const sunset = new Date(data_w.sys.sunset * 1000).toLocaleTimeString().slice(0, 5);
        const sunrise = new Date(data_w.sys.sunrise * 1000).toLocaleTimeString().slice(0, 5);

        const weatherInfo = {
          city: data_w.name,
          country: data_w.sys.country,
          date,
          description: data_w.weather[0].description,
          main: data_w.weather[0].main,
          temp: data_w.main.temp,
          highestTemp: data_w.main.temp_max,
          lowestTemp: data_w.main.temp_min,
          sunrise,
          sunset,
          clouds: data_w.clouds.all,
          humidity: data_w.main.humidity,
          feels_like: data_w.main.feels_like
        };
        setWeatherData(weatherInfo);
        setForecastData(data_f.list);
      } catch (error) {
         console.log(error);
         setError(error)
      }
    };
    fetchData();
  }, [city]);

  return (
    <>
      <WeatherWrapper>
        <AppTitle showLabel showResult={(weatherData || error) && true}>
          Weather app
        </AppTitle>
        <ChooseCity
          showResult={(weatherData || error) && true}
          change={changeCity}
        />
        {(weatherData&&forecastData)&& <Result weather={weatherData} forecast={forecastData} />}
        {error && <NotFound error={error} />}
      </WeatherWrapper>
    </>
  );
}

export default App;
