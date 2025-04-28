/*
 * 파일명: DefaultSlider.jsx, defaultSlider.css
 * 작성자: 김경민
 * 작성일: 2025-03-24 ~ 03-28
 *
 * 설명:
 * - 자식 요소(children)을 가로로 슬라이드할 수 있는 레이아웃
 * - 좌/우 버튼으로 일정 개수의 카드를 스크롤 이동
 * - 카드 간 간격(Gap)을 고려한 슬라이드 너비 계산
 *
 */

import React, { useRef } from "react";
import "../../styles/components/defaultSlider.css";

//  children: 카드 요소들
//  visibleCount: 한번에 보일 카드 수
const DefaultSlider = ({ children, visibleCount = 4, className }) => {
  const sliderRef = useRef(null); //  silderRef: 슬라이더 너비 측정용
  const scrollIndex = useRef(0); // 현재 슬라이드의 인덱스를 저장하는 ref
  const GAP_PX = 16; //  카드 사이 간격(px 단위)
  const totalGapPx = GAP_PX * (visibleCount - 1); // 한번에 보일 카드 사이 총 간격
  //  scroll: 좌/우 스크롤
  //  dir: 방향(left, right)
  const scroll = (dir) => {
    if (!sliderRef.current) return;

    const containerWidth = sliderRef.current.offsetWidth; //  전체 슬라이더 너비
    const cardWidth = (containerWidth - totalGapPx) / visibleCount; //  카드 하나의 너비 계산
    const fullCardWithGap = cardWidth + GAP_PX; // 카드 하나의 너비 + 오른쪽 간격

    // 최대 스크롤 가능한 인덱스 = 전체 카드 수 - 보여줄 수 있는 수
    const maxIndex = Math.max(0, React.Children.count(children) - visibleCount);

    //  현재 인덱스 갱신
    scrollIndex.current =
      dir === "left"
        ? Math.max(scrollIndex.current - visibleCount, 0) // 왼쪽 끝이면 0으로 고정
        : Math.min(scrollIndex.current + visibleCount, maxIndex); // 오른쪽 끝 넘지 않게 제한

    //  스크롤 이동 거리 계산
    const scrollTo = fullCardWithGap * scrollIndex.current;

    // 슬라이더 영역을 왼쪽으로 ScrollTo 만큼 밀어서 다음 카드 보여주기
    sliderRef.current.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  // 카드 하나의 width 퍼센트 = 전체 너비에서 간격을 뺀 후 visibleCount로 나눈 비율
  const cardWidthPercent = `calc((100% - ${totalGapPx}px) / ${visibleCount})`;

  return (
    <div className={`slider-wrapper ${className || ""}`}>
      <button className="slider-btn left" onClick={() => scroll("left")}>
        {"<"}
      </button>

      <div className="slider-track" ref={sliderRef}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="slider-item"
            style={{
              flex: `0 0 ${cardWidthPercent}`,
              maxWidth: cardWidthPercent,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      <button className="slider-btn right" onClick={() => scroll("right")}>
        {">"}
      </button>
    </div>
  );
};

export default DefaultSlider;
