import React, { useEffect, useRef, useState } from "react";
// import "./MainPage.css";

const MainHeaderImage = () => {
  const images = ["/mainImage_01.jpg", "/mainImage_02.jpg"];
  const extendedImages = [...images, images[0]]; // 복제본 포함

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const slideRef = useRef();

  // 자동 슬라이드 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // transition 설정
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = isTransitioning
        ? "transform 0.8s ease-in-out"
        : "none";
    }
  }, [isTransitioning]);

  // transition 끝났을 때 처리
  const handleTransitionEnd = () => {
    if (currentIndex === images.length) {
      // 복제 이미지 도달 → 진짜 첫 번째로 점프
      setIsTransitioning(false); // 트랜지션 제거
      setCurrentIndex(0);
    }
  };

  return (
    <div className="main-header-wrapper">
      <div
        className="slides-container"
        ref={slideRef}
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
        }}
      >
        {extendedImages.map((image, index) => (
          <div className="slide" key={index}>
            <div
              className="main-header-image"
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainHeaderImage;
