/*
 * 파일명: TrailCard.jsx, TrailDetails.jsx, TrailDetails.jsx,
 *        TrailImages.jsx, TrailCard.css
 * 작성자: 김경민
 * 작성일: 2025-03-24 ~ 03-28
 *
 * 설명:
 * - 유지보수를 위한 컴포넌트 분해 조립식 설계
 * - 대표 이미지(TrailImages)와 코스 정보(TrailDetails)를 카드 형식으로 보여줌
 * - 'props'로 mountainId와 mountainName을 전달받아 산과 코스 정보를 렌더링
 *
 * TrailImage.jsx
 * - 산 이미지 렌더링
 * TrailDetails.jsx
 * - 코스 이름, 거리, 소요 시간, 난이도 표시
 */

import { useEffect, useState } from "react";
import TrailImage from "./TrailImage";
import TrailDetails from "./TrailDetails";
import "../../../styles/components/trailCard.css";

const TrailCard = ({ mountainId, mountainName }) => {
  const [imageUrl, setImageUrl] = useState(null); // 대표 이미지 URL 생성
  const [cardInfo, setCardInfo] = useState({
    // 코스 정보 상태 (이름, 거리, 시간, 난이도)
    name: "",
    distance: "",
    time: "",
    level: "",
  });

  // API Base URL(.env 환경변수 참조)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // 대표 이미지 불러오기
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/mountains/${mountainId}/image`
        );
        if (!response.ok) throw new Error("이미지 응답 오류");
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (err) {
        console.error("대표 이미지 불러오기 실패:", err);
      }
    };

    // 코스 정보 불러오기
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/mountains/${mountainId}/courses`
        );
        if (!response.ok) throw new Error("코스 응답 오류");
        const data = await response.json();

        if (data.length > 0) {
          const { courseName, courseLength, courseTime, difficultyLevel } =
            data[0];
          setCardInfo({
            name: courseName,
            distance: courseLength,
            time: courseTime,
            level: difficultyLevel,
          });
        }
      } catch (err) {
        console.error("코스 정보 불러오기 실패:", err);
      }
    };

    //  산 ID가 유효할 때만 API 호출
    if (mountainId) {
      fetchImage();
      fetchCourse();
    }
  }, [mountainId]); // mountainId가 바뀔 떄마다 새로 요청
  return (
    <>
      <div className="slider-card">
        <TrailImage image={imageUrl} mountainName={mountainName} />
        <TrailDetails mountainName={mountainName} cardInfo={cardInfo} />
      </div>
    </>
  );
};

export default TrailCard;
