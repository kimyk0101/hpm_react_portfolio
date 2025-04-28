import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/pages/mountainResult.css";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import { TiChevronLeftOutline, TiChevronRightOutline } from "react-icons/ti";

const MAX_VISIBILITY = 3;

const MountainCard = ({ mountain, active, isCenter, centerColor }) => (
  <div
    className={`card ${isCenter ? "center" : ""}`}
    style={{
      border: isCenter ? "6px solid #8EE50A" : "none",
      backgroundColor: isCenter ? centerColor : "transparent",
    }}
  >
    <h2>{mountain.name}</h2>
    <div className="mountain-details">
      <div className="left-section">
        <p>
          <strong>[위치]</strong>
          <br /> {mountain.location}
        </p>
        <br />
        <p>
          <strong>[코스이름]</strong>
          <br /> {mountain.courseName}
        </p>
        <br />
        <p>
          <strong>[소요시간]</strong>
          <br /> {mountain.courseTime}
        </p>
        <br />
        <p>
          <strong>[난이도]</strong>
          <br /> {mountain.difficultyLevel}
        </p>
      </div>
      <div className="right-section">
        <p>
          <strong>[산의 특징]</strong>
          <br /> {mountain.selectionReason}
        </p>
        <br />
        <p>
          <strong>[교통수단]</strong>
          <br /> {mountain.transportationInfo}
        </p>
      </div>
    </div>
  </div>
);

const MountainResult = () => {
  const location = useLocation();
  const filteredRecommend = location.state?.filteredData || [];
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [centerCardColorIndex, setCenterCardColorIndex] = useState(0);
  const count = filteredRecommend.length;
  const navigate = useNavigate();

  const centerCardColors = ["#7D584B", "#44544A"];

  const getCardColor = (index) => {
    const diff = Math.abs(activeCardIndex - index);
    if (diff === 1) return "green";
    if (diff === 2) return "#A8C9A8";
    return "hsl(280deg, 40%, calc(100% - var(--abs-offset) * 50%))";
  };

  const handleCardChange = (newIndex) => {
    setActiveCardIndex(newIndex);
    setCenterCardColorIndex(
      (prevIndex) => (prevIndex + 1) % centerCardColors.length
    );
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
        <div className="mountain-result-container">
          <h3>당신에게 추천드리는 산은 ...</h3>
          {filteredRecommend.length > 0 ? (
            <div className="carousel">
              {activeCardIndex > 0 && (
                <button
                  className="nav left"
                  onClick={() => handleCardChange(activeCardIndex - 1)}
                >
                  <TiChevronLeftOutline />
                </button>
              )}
              {filteredRecommend.map((mountain, i) => (
                <div
                  className="card-container"
                  key={mountain.name}
                  style={{
                    "--active": i === activeCardIndex ? 1 : 0,
                    "--offset": (activeCardIndex - i) / 3,
                    "--direction": Math.sign(activeCardIndex - i),
                    "--abs-offset": Math.abs(activeCardIndex - i) / 3,
                    "pointer-events": activeCardIndex === i ? "auto" : "none",
                    opacity:
                      Math.abs(activeCardIndex - i) >= MAX_VISIBILITY
                        ? "0"
                        : "1",
                    display:
                      Math.abs(activeCardIndex - i) > MAX_VISIBILITY
                        ? "none"
                        : "block",
                    "background-color": getCardColor(i),
                  }}
                >
                  <MountainCard
                    mountain={mountain}
                    active={activeCardIndex === i}
                    isCenter={i === activeCardIndex}
                    centerColor={centerCardColors[centerCardColorIndex]}
                  />
                </div>
              ))}
              {activeCardIndex < count - 1 && (
                <button
                  className="nav right"
                  onClick={() => handleCardChange(activeCardIndex + 1)}
                >
                  <TiChevronRightOutline />
                </button>
              )}
            </div>
          ) : (
            <p className="no-data-message">없습니다. 다시 선택해주세요 !</p>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default MountainResult;
