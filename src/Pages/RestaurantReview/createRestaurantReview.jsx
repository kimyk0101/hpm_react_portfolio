import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/createRestaurantReview.css";
import PhotoUploader from "../../components/photoUploader/PhotoUploader";

const CreateRestaurantReview = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 유지
  const [user, setUser] = useState([]); // 사용자 정보
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/restaurant-reviews`;
  const [images, setImages] = useState([]);
  const photoUploaderRef = useRef();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/session`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const [mountains, setMountains] = useState([]); // 산 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMountain, setSelectedMountain] = useState(null); // 선택된 산
  const [searchMountain, setSearchMountain] = useState(""); // 산 검색
  const [filteredMountains, setFilteredMountains] = useState([]); // 필터링된 산 목록

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

  // 날짜를 "yyyy-MM-dd HH:mm:ss" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 초까지 포함된 형식
  };

  const [newPost, setNewPost] = useState({
    name: "",
    location: "",
    mountainName: "",
    rate: 0,
    content: "",
    updateDate: new Date(),
    mountainsId: "",
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인 후 사용 가능합니다");
      return;
    }

    const postData = {
      name: newPost.name,
      location: newPost.location,
      mountainName: selectedMountain?.name,
      rate: newPost.rate,
      content: newPost.content,
      update_date: formatDate(newPost.updateDate),
      users_id: parseInt(user.id, 10),
      mountains_id: selectedMountain?.id,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("새로 생성된 게시글 ID:", data.id);

        // 이미지 업로드
        if (images.length > 0) {
          const formData = new FormData();
          formData.append("restaurantsId", data.id);

          const fileImages = images.filter((img) => img instanceof File);
          fileImages.forEach((img) => formData.append("photos", img));

          await fetch(`${BASE_URL}/api/restaurant-reviews/photos/upload`, {
            method: "POST",
            body: formData,
          });
        }

        alert("게시글이 등록되었습니다");
        navigate("/restaurant-reviews");
      } else {
        alert("게시글 등록 실패");
      }
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/restaurant-reviews");
  };

  const textareaRef = useRef(null);

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "150px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newPost.content]);

  // 별점 클릭 시 호출되는 함수
  const handleClick = (rating) => {
    setNewPost({ ...newPost, rate: rating });
  };

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>
      <DefaultLayout>
        <div className="rReviewPage-create">
          <h2>새 게시물</h2>

          {isLoggedIn && (
            <form onSubmit={handlePostSubmit} className="r-post-form">
              <label>맛집 이름:</label>
              <input
                type="text"
                placeholder="맛집 이름을 입력하세요"
                value={newPost.name}
                onChange={(e) =>
                  setNewPost({ ...newPost, name: e.target.value })
                }
                className="r-post-input"
              />

              <label>산 이름:</label>
              <input
                type="text"
                placeholder="산 이름을 입력하세요"
                value={searchMountain}
                onChange={(e) => setSearchMountain(e.target.value)}
                className="r-post-input"
              />
              <ul className="r-post-mountain-list">
                {filteredMountains.map((mountain) => (
                  <li
                    key={mountain.id}
                    className={`r-post-mountain-item ${
                      selectedMountain?.id === mountain.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedMountain(mountain);
                      setNewPost({
                        ...newPost,
                        mountainsId: mountain.id,
                        mountainName: mountain.name,
                      });
                      setSearchMountain(mountain.name);
                      setFilteredMountains([]);
                    }}
                  >
                    {mountain.name} ({mountain.location})
                  </li>
                ))}
              </ul>

              <label>맛집 위치:</label>
              <input
                type="text"
                placeholder="맛집 위치를 입력하세요"
                name="location"
                value={newPost.location}
                onChange={(e) =>
                  setNewPost({ ...newPost, location: e.target.value })
                }
                className="r-post-input"
              />

              <label>별점:</label>
              <div className="r-post-rate-input">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img
                    key={index}
                    src={
                      index <= newPost.rate
                        ? "/icons/mt-Filled.png"
                        : "/icons/mt-Empty.png"
                    }
                    alt={`mountain-${index}`}
                    onClick={() => handleClick(index)}
                    className="r-post-rate-img"
                  />
                ))}
              </div>

              <label>사진 등록:</label>
              <PhotoUploader
                ref={photoUploaderRef}
                onChange={setImages}
                className="r-photo-column-layout"
              />

              <label>게시글 내용:</label>
              <textarea
                className="r-post-content"
                value={newPost.content}
                ref={textareaRef}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="내용"
                required
              />

              <div className="r-post-button-container">
                <button
                  type="submit"
                  className="r-post-save"
                  data-text="게시글 등록"
                >
                  <span>게시글 등록</span>
                </button>
                <button
                  type="button"
                  className="r-post-cancel"
                  onClick={handleCancel}
                  data-text="취소"
                >
                  <span>취소</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default CreateRestaurantReview;
