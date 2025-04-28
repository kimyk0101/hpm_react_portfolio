/*
* 기능명 : MountainRecommend
* 파일명 : mountainRecommend.jsx, mountainRecommend.css, mountainResult.jsx, mountainResult.css
* 작성자 : 서민정
* 설명 : 

        mountainRecommend : 조건에 맞는 산 추천을 위해 조건 선택하는 화면
    - 전체 산 목록들 중에서 선택한 지역/난이도/소요시간의 범위에 있는 산들이 나올 수 있는 기능 제공
    - 지역/난이도/소요시간 선택 시 눈에 잘 띄도록 테두리 설정

        mountainResult : 조건에 맞는 산들의 전체 정보를 보여주는 화면
    - 카드형식으로 넘어가면서 추천하는 산의 정보를 볼 수 있도록 기능 설정
    - 다음 카드로 넘어가는 것이 잘 보일 수 있도록 UI 구성

* 작성일 : 2025-03-25 ~ 04-14
*/


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/mountainRecommend.css";
import DefaultLayout from "../../layouts/DefaultLayout";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";

const MountainRecommend = () => {
  const [recommend, setRecommend] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/mountain-recommends`;
  const navigate = useNavigate();

  const fetchMountainRecommends = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecommend(data);
    } catch (err) {
      console.error("산 추천 목록을 불러오는 중 오류 발생:", err);
      setError("산 추천 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchMountainRecommends();
  }, []);

  const filterMountains = () => {
    return recommend.filter((mountain) => {
      const locationMatch =
        !locationFilter || mountain.location.includes(locationFilter);
      const difficultyMatch =
        !difficultyFilter || mountain.difficultyLevel === difficultyFilter;
      const timeMatch =
        !timeFilter ||
        (mountain.courseTime &&
          ((timeFilter === "1시간 이하" &&
            parseCourseTime(mountain.courseTime) <= 1) ||
            (timeFilter === "1시간 ~ 1시간 30분" &&
              parseCourseTime(mountain.courseTime) > 1 &&
              parseCourseTime(mountain.courseTime) <= 1.5) ||
            (timeFilter === "1시간 30분 ~ 2시간" &&
              parseCourseTime(mountain.courseTime) > 1.5 &&
              parseCourseTime(mountain.courseTime) <= 2) ||
            (timeFilter === "2시간 ~ 2시간 30분" &&
              parseCourseTime(mountain.courseTime) > 2 &&
              parseCourseTime(mountain.courseTime) <= 2.5) ||
            (timeFilter === "2시간 30분 ~ 3시간" &&
              parseCourseTime(mountain.courseTime) > 2.5 &&
              parseCourseTime(mountain.courseTime) <= 3) ||
            (timeFilter === "3시간 ~ 3시간 30분" &&
              parseCourseTime(mountain.courseTime) > 3 &&
              parseCourseTime(mountain.courseTime) <= 3.5) ||
            (timeFilter === "3시간 30분 ~ 4시간" &&
              parseCourseTime(mountain.courseTime) > 3.5 &&
              parseCourseTime(mountain.courseTime) <= 4) ||
            (timeFilter === "4시간 ~ 4시간 30분" &&
              parseCourseTime(mountain.courseTime) > 4 &&
              parseCourseTime(mountain.courseTime) <= 4.5) ||
            (timeFilter === "4시간 30분 ~ 5시간" &&
              parseCourseTime(mountain.courseTime) > 4.5 &&
              parseCourseTime(mountain.courseTime) <= 5) ||
            (timeFilter === "5시간 ~ 5시간 30분" &&
              parseCourseTime(mountain.courseTime) > 5 &&
              parseCourseTime(mountain.courseTime) <= 5.5) ||
            (timeFilter === "5시간 30분 ~ 6시간" &&
              parseCourseTime(mountain.courseTime) > 5.5 &&
              parseCourseTime(mountain.courseTime) <= 6) ||
            (timeFilter === "6시간 이상" &&
              parseCourseTime(mountain.courseTime) > 6)));
      return locationMatch && difficultyMatch && timeMatch;
    });
  };

  const parseCourseTime = (courseTime) => {
    if (!courseTime) return 0;
    const parts = courseTime.split(" ");
    let totalHours = 0;
    parts.forEach((part) => {
      if (part.includes("시간")) {
        totalHours += parseFloat(part);
      } else if (part.includes("분")) {
        totalHours += parseFloat(part) / 60;
      }
    });
    return totalHours;
  };

  const handleSelectChange = (e, filterType) => {
    const value = e.target.value;
    if (filterType === "location") setLocationFilter(value);
    if (filterType === "difficulty") setDifficultyFilter(value);
    if (filterType === "time") setTimeFilter(value);
    const section = e.target.closest(".filter-section");
    section?.classList.add("selected");
  };

  const handleFilterButtonClick = () => {
    const filteredData = filterMountains();
    navigate("/mountain-result", { state: { filteredData } });
    window.scrollTo(0, 0); // 스크롤을 맨 위로 이동
  };

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={false}
            showLogo={true}
            showIcons={{ search: true }}
            menuItems={[
              { label: "커뮤니티", onClick: () => navigate("/communities") },
              {
                label: "등산 후기",
                onClick: () => navigate("/hiking-reviews"),
              },
              {
                label: "맛집 후기",
                onClick: () => navigate("/restaurant-reviews"),
              },
              { label: "모임", onClick: () => navigate("/clubs") },
            ]}
          />
        </ContentContainer>
      </header>

      <DefaultLayout>
        <div className="mountain-recommend-container">
          <h1>산을 추천해드릴께요 !</h1>
          <br />
          {error && <p className="error-message">{error}</p>}

          <div className="filter-and-image-container">
            <div className="filter-options">
              <div className="filter-sections">
                <div className="filter-section">
                  <h2>지역</h2>
                  <select
                    value={locationFilter}
                    onChange={(e) => handleSelectChange(e, "location")}
                  >
                    <option value="">전체</option>
                    {[
                      "서울특별시",
                      "인천",
                      "대전",
                      "대구",
                      "부산",
                      "광주",
                      "울산",
                      "제주",
                      "경기도",
                      "강원도",
                      "충청북도",
                      "충청남도",
                      "전라북도",
                      "전라남도",
                      "경상북도",
                      "경상남도",
                    ].map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-section">
                  <h2>난이도</h2>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => handleSelectChange(e, "difficulty")}
                  >
                    <option value="">전체</option>
                    <option value="쉬움">쉬움</option>
                    <option value="보통">보통</option>
                    <option value="어려움">어려움</option>
                  </select>
                </div>

                <div className="filter-section">
                  <h2>소요시간</h2>
                  <select
                    value={timeFilter}
                    onChange={(e) => handleSelectChange(e, "time")}
                  >
                    <option value="">전체</option>
                    {[
                      "1시간 이하",
                      "1시간 ~ 1시간 30분",
                      "1시간 30분 ~ 2시간",
                      "2시간 ~ 2시간 30분",
                      "2시간 30분 ~ 3시간",
                      "3시간 ~ 3시간 30분",
                      "3시간 30분 ~ 4시간",
                      "4시간 ~ 4시간 30분",
                      "4시간 30분 ~ 5시간",
                      "5시간 ~ 5시간 30분",
                      "5시간 30분 ~ 6시간",
                      "6시간 이상",
                    ].map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="image-button-wrapper">
              <img
                src="/result-image/result_image.jpg"
                alt="추천 이미지"
                className="background-image"
              />
              <button
                className="filter-result-button"
                onClick={handleFilterButtonClick}
              >
                결과 보러가기
              </button>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MountainRecommend;
