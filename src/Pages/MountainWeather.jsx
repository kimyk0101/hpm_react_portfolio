// 한라산, 지리산 ... : 날씨정보 불러오기 -> import 부분
import useWeather from "./UseWeather"; // useWeather Hook import

// 한라산, 지리산 ... : 날씨정보 불러오기 -> return 윗부분
const { weather, cityName, weatherForecast, setLatitude, setLongitude } =
  useWeather();
const mountains = [
  { name: "한라산", lat: 33.361413, lon: 126.529395 },
  { name: "지리산", lat: 35.336943, lon: 127.730641 },
  { name: "설악산", lat: 38.118333, lon: 128.483333 },
  { name: "태백산", lat: 37.083333, lon: 128.916667 },
  { name: "소백산", lat: 36.966667, lon: 128.45 },
  { name: "속리산", lat: 36.533333, lon: 127.783333 },
  { name: "관악산", lat: 37.433333, lon: 126.966667 },
  { name: "북한산", lat: 37.666667, lon: 126.983333 },
  { name: "인왕산", lat: 37.583333, lon: 126.966667 },
  { name: "도봉산", lat: 37.7, lon: 127.016667 },
  { name: "남산", lat: 37.55, lon: 126.983333 },
  { name: "가리산", lat: 37.283333, lon: 127.233333 },
  { name: "운악산", lat: 37.966667, lon: 127.233333 },
  { name: "수락산", lat: 37.7, lon: 127.133333 },
  { name: "청계산", lat: 37.633333, lon: 127.066667 },
  { name: "불암산", lat: 37.633333, lon: 127.066667 },
  { name: "대금산", lat: 36.233333, lon: 127.233333 },
  { name: "계룡산", lat: 36.366667, lon: 127.183333 },
  { name: "금강산", lat: 38.65, lon: 128.083333 },
  { name: "오대산", lat: 37.783333, lon: 128.55 },
  { name: "팔공산", lat: 35.983333, lon: 128.5 },
  { name: "가야산", lat: 35.783333, lon: 128.116667 },
];

// 한라산, 지리산 ... : 날씨정보 불러오기  -> return 부분

{
  /* 위도/경도 변경 버튼 */
}
<div className="location-buttons">
  {mountains.map((mountain, index) => (
    <button
      key={index}
      onClick={() => {
        setLatitude(mountain.lat);
        setLongitude(mountain.lon);
      }}
    >
      {mountain.name}
    </button>
  ))}
</div>;

{
  /* 현재 날씨 */
}
{
  weather && (
    <div className="weather-info">
      <h2>{cityName} 현재 날씨</h2>
      <img src={weather.icon} alt="현재 날씨 아이콘" />
      <p>{weather.description}</p>
      <p>온도: {weather.temp}°C</p>
    </div>
  );
}

{
  /* 미래 날씨 (5일 예보) */
}
{
  weatherForecast.length > 0 && (
    <div className="weather-forecast">
      <h3>5일간의 날씨 예보</h3>
      <div className="forecast-container">
        {weatherForecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <p>{day.date}</p>
            <img src={day.icon} alt="미래 날씨 아이콘" />
            <p>{day.description}</p>
            <p>{day.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}
