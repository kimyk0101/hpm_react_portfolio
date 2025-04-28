import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const weatherDescKo = {
  200: "가벼운 비를 동반한 천둥구름",
  201: "비를 동반한 천둥구름",
  202: "강한 비를 동반한 천둥구름",
  210: "약한 천둥구름",
  211: "천둥구름",
  212: "강한 천둥구름",
  221: "불규칙적인 천둥구름",
  230: "약한 비를 동반한 천둥구름",
  231: "진눈깨비를 동반한 천둥구름",
  232: "강한 진눈깨비를 동반한 천둥구름",
  300: "가벼운 안개비",
  301: "안개비",
  302: "강한 안개비",
  310: "가벼운 적은비",
  311: "적은비",
  312: "강한 적은비",
  313: "소나기성 적은비",
  314: "강한 소나기성 적은비",
  321: "소나기성 안개비",
  500: "약한 비",
  501: "중간 비",
  502: "강한 비",
  503: "매우 강한 비",
  504: "극심한 비",
  511: "진눈깨비",
  520: "약한 소나기성 비",
  521: "소나기성 비",
  522: "강한 소나기성 비",
  531: "불규칙적인 소나기성 비",
  600: "약한 눈",
  601: "눈",
  602: "강한 눈",
  611: "진눈깨비",
  612: "소나기성 진눈깨비",
  613: "소나기성 눈",
  615: "약한 비와 눈",
  616: "비와 눈",
  620: "약한 소나기성 눈",
  621: "소나기성 눈",
  622: "강한 소나기성 눈",
  701: "박무",
  711: "연기",
  721: "안개",
  731: "모래, 먼지",
  741: "안개",
  751: "모래",
  761: "먼지",
  762: "화산재",
  771: "돌풍",
  781: "토네이도",
  800: "맑음",
  801: "약간 흐린 구름",
  802: "흐린 구름",
  803: "매우 흐린 구름",
  804: "흐림",
};

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [cityName, setCityName] = useState("");
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [latitude, setLatitude] = useState(37.5665); // 기본값: 서울
  const [longitude, setLongitude] = useState(126.978); // 기본값: 서울

  useEffect(() => {
    getWeather(latitude, longitude);
    getWeatherForecast(latitude, longitude);
  }, [latitude, longitude]); // 위도, 경도가 변경될 때마다 실행

  // 현재 날씨
  const getWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const weatherId = res.data.weather[0].id;
      const weatherKo =
        weatherDescKo[weatherId] || res.data.weather[0].description;
      const weatherIcon = res.data.weather[0].icon;
      const weatherIconAdrs = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      const temp = Math.round(res.data.main.temp);
      const name = res.data.name;

      setWeather({
        description: weatherKo,
        temp: temp,
        icon: weatherIconAdrs,
      });
      setCityName(name);
    } catch (err) {
      console.error(err);
    }
  };

  // 미래 날씨 가져오기 (5일 예보)
  const getWeatherForecast = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      // 3시간 간격으로 5일간 총 40개의 데이터가 들어옴
      const dailyForecast = res.data.list.filter(
        (item, index) => index % 8 === 0
      ); // 하루 중 대표적인 시간만 추출

      // 필요한 데이터만 저장
      const forecastData = dailyForecast.map((day) => ({
        date: day.dt_txt.split(" ")[0], // 날짜만 추출 (YYYY-MM-DD)
        temp: Math.round(day.main.temp),
        description:
          weatherDescKo[day.weather[0].id] || day.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
      }));

      setWeatherForecast(forecastData);
    } catch (err) {
      console.error("미래 날씨 데이터 불러오기 오류:", err);
    }
  };

  return { weather, cityName, weatherForecast, setLatitude, setLongitude };
};

export default useWeather;
