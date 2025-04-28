import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext.jsx";
import CommentSection from "./CommentSection.jsx";
import "../../styles/pages/restaurantReviewCard.css";
import RestaurantReviewLikeButton from "./RestaurantReviewLikeButton.jsx";
import PhotoUploader from "../../components/photoUploader/PhotoUploader.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RestaurantReviewCard = ({ post, currentUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({
    name: post.name,
    rate: post.rate,
    location: post.location,
    content: post.content,
    mountainsId: post.mountainsId,
  });
  const { user, isLoggedIn } = useAuth();
  const isAuthor = user?.id === post.usersId;

  const [mountains, setMountains] = useState([]); // 산 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMountain, setSelectedMountain] = useState(null); // 선택된 산
  const [searchMountain, setSearchMountain] = useState(""); // 산 검색
  const [filteredMountains, setFilteredMountains] = useState([]); // 필터링된 산 목록

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 산 목록 가져오기
  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mountains`);
        if (!response.ok) {
          throw new Error("네트워크 응답이 정상적이지 않습니다.");
        }
        const data = await response.json();
        setMountains(data);
        setFilteredMountains(data);
      } catch (error) {
        console.error("산 목록을 가져오는 데 오류가 발생했습니다.", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);

  // 산 검색 필터링
  useEffect(() => {
    setFilteredMountains(mountains.filter((m) => m.name));
  }, [searchMountain, mountains]);

  const [photos, setPhotos] = useState([]);

  const photoUploaderRef = useRef();

  const fetchPhotos = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/restaurant-reviews/photos/by-restaurant/${post.id}`
      );

      // ✅ 예외 없이 JSON 응답이면 계속 진행
      if (res.ok) {
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();

          // ✅ 배열이면 그대로 set
          if (Array.isArray(data)) {
            setPhotos(data);
          } else {
            console.warn("예상치 못한 데이터 형식:", data);
            setPhotos([]); // fallback 처리
          }
        } else {
          const text = await res.text();
          console.warn("예상치 못한 응답 형식:", text);
          setPhotos([]); // fallback
        }
      } else {
        // ✅ 실패 응답이어도 사진만 없는 거니까 무시하고 빈 배열 처리
        const errorText = await res.text();
        console.warn("사진 없음 또는 조회 실패 (무시 가능):", errorText);
        setPhotos([]); // 사진이 없는 경우에도 정상 처리
      }
    } catch (error) {
      console.error("fetchPhotos 중 에러:", error);
      setPhotos([]); // 네트워크 오류 등도 안전하게 처리
    }
  };

  useEffect(() => {
    if (post?.id) {
      fetchPhotos();
    }
  }, [post?.id]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleEditChange = (e) => {
    setEditPost({ ...editPost, content: e.target.value });
  };

  //  게시물 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      name: editPost.name,
      rate: editPost.rate,
      location: editPost.location,
      mountains_id: selectedMountain?.id ?? editPost.mountainsId,
      content: editPost.content,
    };

    const files = photoUploaderRef.current.getFiles(); // 새로 추가된 파일들
    const existingServerPhotoNames = photoUploaderRef.current.getServerPhotos(); // 기존에 남긴 서버 사진들

    try {
      // 1. 게시글 내용 수정 (사진 제외)
      await fetch(`${BASE_URL}/api/restaurant-reviews/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      //  2. 이미지 업로드 및 서버 사진 정보 같이 전송
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("photos", file));
        existingServerPhotoNames.forEach((name) =>
          formData.append("existingPhotoNames", name)
        );
        formData.append("reviewsId", post.id);

        await fetch(`${BASE_URL}/api/restaurant-reviews/photos/upload`, {
          method: "POST",
          body: formData,
        });
      }

      alert("수정되었습니다");
      setIsEditing(false);
      fetchPhotos(); // 수정 후 사진 다시 로딩

      window.location.reload();
    } catch (error) {
      console.error("게시물 수정 실패:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await fetch(
        `${BASE_URL}/api/restaurant-reviews/photos/by-photo/${photoId}`,
        {
          method: "DELETE",
        }
      );
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error("사진 삭제 실패:", err);
    }
  };

  //  게시물 삭제
  const handleDelete = async () => {
    const isConfirmed = window.confirm("게시글을 삭제할까요?");

    if (isConfirmed) {
      try {
        await fetch(`${BASE_URL}/api/restaurant-reviews/${post.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usersId: user.id }),
        });

        alert("게시물이 삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error);
      }
    } else {
      // 사용자가 취소를 클릭한 경우
      console.log("삭제가 취소되었습니다.");
    }
  };

  //  상대적 시간 계산
  const formatRelativeDate = (date) => {
    const now = new Date();
    const parsedDate = new Date(date.replace(" ", "T"));
    const diffMs = now - parsedDate;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    return `${Math.floor(days / 30)}개월 전`;
  };

  const [isExpanded, setIsExpanded] = useState(false);

  //  더보기
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  //  사진 페이지네이션
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // 별점 클릭 시 호출되는 함수
  const handleClick = (rating) => {
    setEditPost({ ...editPost, rate: rating });
  };

  // 자동 높이 조정
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "150px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editPost.content]);

  return (
    <div className="rReview-card-wrapper">
      <div className="rReview-post-card">
        {isAuthor && (
          <div className="rReview-card-options">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((prev) => !prev);
              }}
              className="rReview-card-options-button"
            >
              <FiMoreVertical />
            </button>

            {showOptions && (
              <div className="rReview-card-dropdown">
                <button onClick={handleEditClick}>수정</button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <form className="rReview-edit-form" onSubmit={handleEditSubmit}>
            <label>맛집 이름:</label>
            <input
              type="text"
              placeholder="맛집 이름을 입력하세요"
              value={editPost.name}
              onChange={(e) =>
                setEditPost({ ...editPost, name: e.target.value })
              }
              className="rReview-input"
            />

            <label>산 이름:</label>
            <input
              type="text"
              placeholder="산 이름 검색"
              value={searchMountain}
              onChange={(e) => {
                const keyword = e.target.value;
                setSearchMountain(keyword);
                setFilteredMountains(
                  mountains.filter((m) =>
                    m.name.toLowerCase().includes(keyword.toLowerCase())
                  )
                );
              }}
              className="rReview-input"
            />
            <ul className="rReview-mountain-list">
              {filteredMountains.map((m) => (
                <li
                  key={m.id}
                  className={`rReview-mountain-item ${
                    selectedMountain?.id === m.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedMountain(m);
                    setSearchMountain(m.name);
                    setFilteredMountains([]);
                  }}
                >
                  {m.name} ({m.location})
                </li>
              ))}
            </ul>

            <label>맛집 위치:</label>
            <input
              type="text"
              placeholder="맛집 위치를 입력하세요"
              name="location"
              value={editPost.location}
              onChange={(e) =>
                setEditPost({ ...editPost, location: e.target.value })
              }
              className="rReview-input"
            />

            <label>별점:</label>
            <div className="rReview-rate-input">
              {[1, 2, 3, 4, 5].map((index) => (
                <img
                  key={index}
                  src={
                    index <= editPost.rate
                      ? "/icons/mt-Filled.png"
                      : "/icons/mt-Empty.png"
                  }
                  alt={`mountain-${index}`}
                  onClick={() => handleClick(index)}
                  className="rReview-rate-img"
                />
              ))}
            </div>

            <label>사진 등록:</label>
            <PhotoUploader
              ref={photoUploaderRef}
              initialPhotos={photos}
              onChange={() => {}}
              onDeleteServerPhoto={handleDeletePhoto}
              className="rReview-photo-column-layout"
            />

            <label>게시글 내용:</label>
            <textarea
              value={editPost.content}
              ref={textareaRef}
              onChange={handleEditChange}
              rows={5}
              required
              className="rReview-textarea"
            />

            <div className="rReview-buttons">
              <button type="submit" className="rReview-submit-button">
                저장
              </button>
              <button
                type="button"
                className="rReview-cancel-button"
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="rReview-post-header">
              <span className="rReview-post-nickname">{post.nickname}</span>
              <span className="rReview-post-meta">
                {post.mountainName} · {post.location} ·{" "}
                {formatRelativeDate(post.updateDate)}
              </span>
              <div className="rReview-rate-display">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img
                    key={index}
                    src={
                      index <= post.rate
                        ? "/icons/mt-Filled.png"
                        : "/icons/mt-Empty.png"
                    }
                    alt={`mountain-${index}`}
                    className="rReview-rate-display-img"
                  />
                ))}
              </div>
            </div>
            <div className="rReview-photo-wrapper">
              <div className="rReview-photo-slider">
                {photos.length > 0 ? (
                  <div className="rReview-photo-slide">
                    <img
                      src={photos[currentIndex].file_path}
                      alt="후기 이미지"
                      className="rReview-photo-img"
                    />
                  </div>
                ) : (
                  <div className="rReview-photo-slide rReview-photo-empty">
                    <img
                      className="rReview-photo-placeholder"
                      src="/images/noPhoto.png"
                      alt="사진 없음"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <button
                      className="rReview-photo-nav left"
                      onClick={handlePrev}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="rReview-photo-nav right"
                      onClick={handleNext}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              <div className="rReview-photo-pagination">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`rReview-dot ${
                      index === currentIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      visibility: photos.length > 1 ? "visible" : "hidden",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={isExpanded ? "" : "rReview-content-preview"}>
              {post.content}
            </div>

            {post.content.length > 75 ? (
              <button onClick={toggleExpanded} className="rReview-see-more-btn">
                {isExpanded ? "접기" : "더보기"}
              </button>
            ) : (
              <div className="rReview-see-more-btn-placeholder" />
            )}

            <div className="rReview-post-reactions">
              <RestaurantReviewLikeButton
                reviewId={post.id}
                currentUserId={currentUser?.id}
              />

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments((prev) => !prev);
                }}
              >
                <span>
                  💬{" "}
                  {commentCount !== null && commentCount !== undefined
                    ? commentCount
                    : 0}
                </span>
              </span>
            </div>
            {showComments && (
              <CommentSection
                rReviewId={post.id}
                user={user}
                onCommentChange={(newCount) => setCommentCount(newCount)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviewCard;
