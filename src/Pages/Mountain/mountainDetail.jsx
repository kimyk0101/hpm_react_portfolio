// MountainDetail.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/mountainDetail.css";
import { motion } from "framer-motion";

const weatherDescKo = {
  // 생략
};

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useWeather = (lat, lon) => {
  const [weather, setWeather] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [sunTimes, setSunTimes] = useState(null);

  const fetchSunTimesForTomorrow = async (lat, lon) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    try {
      const response = await axios.get("https://api.sunrise-sunset.org/json", {
        params: { lat, lng: lon, date: formattedDate, formatted: 0 },
      });
      return {
        sunrise: new Date(response.data.results.sunrise),
        sunset: new Date(response.data.results.sunset),
      };
    } catch (error) {
      console.error("Sunrise-Sunset API 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!lat || !lon) return;
    const fetchWeather = async () => {
      try {
        const currentRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              units: "metric",
              lang: "kr",
            },
          }
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              units: "metric",
              lang: "kr",
            },
          }
        );

        const processedCurrent = {
          temp: Math.round(currentRes.data.main.temp),
          description:
            weatherDescKo[currentRes.data.weather[0].id] ||
            currentRes.data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${currentRes.data.weather[0].icon}@2x.png`,
        };

        const processedForecast = forecastRes.data.list
          .filter((_, index) => index % 8 === 0)
          .map((item) => ({
            date: new Date(item.dt * 1000),
            temp: Math.round(item.main.temp),
            description:
              weatherDescKo[item.weather[0].id] || item.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
          }));

        const sunTimesForTomorrow = await fetchSunTimesForTomorrow(lat, lon);

        setSunTimes(sunTimesForTomorrow);
        setWeather(processedCurrent);
        setWeatherForecast(processedForecast);
      } catch (error) {
        console.error("날씨 데이터 오류:", error);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, weatherForecast, sunTimes };
};

function MountainDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mountain, setMountain] = useState(null);
  const [courses, setCourses] = useState([]);
  const mapRef = useRef(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const { weather, weatherForecast, sunTimes } = useWeather(
    mountain?.latitude,
    mountain?.longitude
  );

  useEffect(() => {
    axios
      // .get(`${BASE_URL}/api/mountains/${id}`)
      .get(`http://localhost:8088/api/mountains/${id}`)
      .then((res) => setMountain(res.data))
      .catch((err) => console.error("산 정보 오류:", err));

    axios
      // .get(`${BASE_URL}/api/mountains/${id}/courses`)
      .get(`http://localhost:8088/api/mountains/${id}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("코스 정보 오류:", err));
  }, [id]);

  useEffect(() => {
    if (mountain) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAPS_API_KEY
      }&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;

            const map = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              level: 5,
            });

            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              image: new window.kakao.maps.MarkerImage(
                "https://i.ibb.co/QZk1h2W/30x30.png",
                new window.kakao.maps.Size(30, 30),
                { offset: new window.kakao.maps.Point(15, 25) }
              ),
              map,
            });

            new window.kakao.maps.CustomOverlay({
              content: `<div class="custom-label">${mountain.name}</div>`,
              position: marker.getPosition(),
              yAnchor: -0.2,
              map,
            });
          });
        }
      };

      return () => document.head.removeChild(script);
    }
  }, [mountain]);

  if (!mountain) return <div className="loading">로딩 중...</div>;

  return (
    <div className="mountain-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>
      <h1>{mountain.name}</h1>
      <div className="meta-info">
        <span>
          <img src="/icons/icon_mountain.png" alt="산 아이콘" />
          {mountain.height}
        </span>
        <span>
          <img src="/icons/icon_adress.png" alt="위치 아이콘" />
          {mountain.location}
        </span>
        <p>{mountain.selection_reason}</p>
      </div>

      <div ref={mapRef} className="map-detail-container"></div>

      <motion.button
        className="search-button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          window.open(
            `https://map.naver.com/v5/search/${mountain.name} 맛집`,
            "_blank"
          )
        }
      >
        주변 맛집 검색하기
      </motion.button>

      <motion.div
        className="info-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span>
          <div class="transport-text">
            <strong>대중교통 안내</strong>

            <br />
            {mountain.transportation_info}
          </div>
          <img
            src="/icons/icon_trans.png"
            alt="버스 아이콘"
            class="transport-icon bus-drive"
          />
        </span>
      </motion.div>

      {(weather || sunTimes) && (
        <div className="weather-sun-container">
          {weather && (
            <motion.div
              className="weather-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>현재 날씨</h2>
              <p>온도: {weather.temp}°C</p>
              <p>설명: {weather.description}</p>
              <img src={weather.icon} alt="날씨 아이콘" />
            </motion.div>
          )}

          {sunTimes && (
            <motion.div
              className="sun-times-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>일출 및 일몰</h2>
              <p className="meta-info">기준 날짜: {formattedDate}</p>
              <p>🌄 일출: {sunTimes.sunrise.toLocaleTimeString()}</p>
              <p>🌅 일몰: {sunTimes.sunset.toLocaleTimeString()}</p>
            </motion.div>
          )}
        </div>
      )}

      {weatherForecast.length > 0 && (
        <motion.div
          className="forecast-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>📅 날씨 예보</h3>
          <div className="forecast-grid">
            {weatherForecast.map((day, index) => (
              <motion.div
                key={index}
                className="forecast-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p>
                  {day.date.toLocaleDateString("ko-KR", {
                    weekday: "short",
                  })}
                </p>
                <img src={day.icon} alt="날씨 아이콘" />
                <p>{day.temp}°C</p>
                <p>{day.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="courses-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="search-section">
          <h2>등산 코스 목록</h2>
        </div>
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course.mountainsId}
              className="course-card"
              onClick={() =>
                window.open(
                  `https://map.naver.com/v5/search/${course.courseName}`,
                  "_blank"
                )
              }
            >
              <h3>{course.courseName}</h3>
              <p>길이: {course.courseLength}</p>
              <p>소요 시간: {course.courseTime}</p>
              <p>난이도: {course.difficultyLevel}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default MountainDetail;
