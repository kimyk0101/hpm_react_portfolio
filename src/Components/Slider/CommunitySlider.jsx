// import React, { useRef } from "react";
// import "../../css/DefaultSlider.css";

// //  children: 카드 요소들
// //  visibleCount: 한번에 보일 카드 수
// const DefaultSlider = ({ children, visibleCount = 3 }) => {
//   //  silderRef: 슬라이더 너비 측정용
//   const sliderRef = useRef(null);
//   const scrollIndex = useRef(0);
//   const GAP_PX = 16;
//   const totalGapPx = GAP_PX * (visibleCount - 1);
//   //  scroll: 좌/우 스크롤
//   //  dir: 방향(left, right)
//   const scroll = (dir) => {
//     if (!sliderRef.current) return;

//     //  전체 슬라이더 너비
//     const containerWidth = sliderRef.current.offsetWidth;
//     //  카드 하나의 너비
//     const cardWidth = (containerWidth - totalGapPx) / visibleCount;
//     const fullCardWithGap = cardWidth + GAP_PX;

//     const maxIndex = Math.max(0, React.Children.count(children) - visibleCount);

//     scrollIndex.current =
//       dir === "left"
//         ? Math.max(scrollIndex.current - visibleCount, 0)
//         : Math.min(scrollIndex.current + visibleCount, maxIndex);

//     const scrollTo = fullCardWithGap * scrollIndex.current;

//     sliderRef.current.scrollTo({
//       left: scrollTo,
//       behavior: "smooth",
//     });
//   };

//   //  카드 하나가 전체의 몇 % 차지할지 계산
//   const cardWidthPercent = `calc((100% - ${totalGapPx}px) / ${visibleCount})`;

//   return (
//     <div className="slider-wrapper">
//       <button className="slider-btn left" onClick={() => scroll("left")}>
//         {"<"}
//       </button>

//       <div className="slider-track" ref={sliderRef}>
//         {React.Children.map(children, (child, index) => (
//           <div
//             key={index}
//             className="slider-item"
//             style={{
//               flex: `0 0 ${cardWidthPercent}`,
//               maxWidth: cardWidthPercent,
//             }}
//           >
//             {child}
//           </div>
//         ))}
//       </div>

//       <button className="slider-btn right" onClick={() => scroll("right")}>
//         {">"}
//       </button>
//     </div>
//   );
// };

// export default DefaultSlider;
