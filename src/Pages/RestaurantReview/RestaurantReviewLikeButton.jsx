import React, { useEffect, useState } from "react";

const RestaurantReviewLikeButton = ({ reviewId, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 좋아요 여부 및 개수 불러오기
  useEffect(() => {
    // 좋아요 개수는 로그인 여부와 상관없이 항상 불러오기
    const fetchLikeCount = async () => {
      try {
        const res = await fetch(
          // `${BASE_URL}/api/restaurant-reviews/likes/count?restaurantsId=${reviewId}`
          `http://localhost:8088/api/restaurant-reviews/likes/count?restaurantsId=${reviewId}`
        );
        const data = await res.json();
        setLikeCount(data);
      } catch (err) {
        console.error("좋아요 수 오류", err);
      }
    };

    fetchLikeCount();

    // 로그인한 경우에만 isLiked 요청
    if (currentUserId) {
      const fetchIsLiked = async () => {
        try {
          const res = await fetch(
            // `${BASE_URL}/api/restaurant-reviews/likes/is-liked?usersId=${currentUserId}&restaurantsId=${reviewId}`
            `http://localhost:8088/api/restaurant-reviews/likes/is-liked?usersId=${currentUserId}&restaurantsId=${reviewId}`
          );
          const data = await res.json();
          setIsLiked(data);
        } catch (err) {
          console.error("좋아요 상태 오류", err);
        }
      };

      fetchIsLiked();
    }
  }, [reviewId, currentUserId]);

  // 좋아요 토글
  const handleToggleLike = async (e) => {
    e.stopPropagation();

    if (!currentUserId) {
      alert("로그인 후 사용 가능합니다");
      return;
    }

    try {
      const res = await fetch(
        // `${BASE_URL}/api/restaurant-reviews/likes/toggle`,
        "http://localhost:8088/api/restaurant-reviews/likes/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            users_id: currentUserId,
            restaurants_id: reviewId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("좋아요 토글 실패");
      }

      // 낙관적 UI 업데이트
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("좋아요 토글 오류", err);
      alert("좋아요 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <span onClick={handleToggleLike} style={{ cursor: "pointer" }}>
      {isLiked ? "💚" : "🤍"} {likeCount}
    </span>
  );
};

export default RestaurantReviewLikeButton;
