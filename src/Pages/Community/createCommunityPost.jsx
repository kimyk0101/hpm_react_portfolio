import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import PhotoUploader from "../../components/photoUploader/PhotoUploader";
import "../../styles/pages/createCommunityPost.css";

const CreateCommunityPost = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/communities`; // API URL
  const navigate = useNavigate();
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [images, setImages] = useState([]);
  const photoUploaderRef = useRef();

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/session`, {
        method: "GET",
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data); // 로그인된 사용자 정보 저장
        console.log(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, []);

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
    title: "",
    content: "",
    updateDate: new Date(), // 현재 날짜와 시간
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      id: newPost.id || null,
      title: newPost.title,
      content: newPost.content,
      update_date: formatDate(newPost.updateDate),
      users_id: parseInt(user.id, 10), // String → Number 변환
    };

    console.log("📌 서버로 전송할 데이터:", JSON.stringify(postData, null, 2)); // JSON 데이터 확인

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🪵 서버 응답 원문:", data);
        console.log("새로 생성된 게시글 ID:", data.id);
        console.log("업로드할 이미지 수:", images.length);

        if (images.length > 0) {
          const formData = new FormData();
          formData.append("communitiesId", data.id);

          const fileImages = images.filter((img) => img instanceof File);
          fileImages.forEach((img) => formData.append("photos", img));

          await fetch(`${BASE_URL}/api/communities/photos/upload`, {
            method: "POST",
            body: formData,
          });
        }

        alert("게시글이 등록되었습니다");
        navigate("/communities");
      } else {
        const errorText = await response.text();
        console.error("❌ 서버 응답 오류:", errorText);
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/communities"); // 취소 시 리스트 페이지로 이동
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const textareaRef = useRef(null);

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newPost.content]);

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
                            { label: "등산 후기", onClick: () => navigate("/hiking-reviews") },
                            { label: "맛집 후기", onClick: () => navigate("/restaurant-reviews") },
                            { label: "모임", onClick: () => navigate("/clubs") },
                        ]}
                    />
                </ContentContainer>
            </header><br/>

      <DefaultLayout>
        <div className="communityPage-create">
          <h2>새 게시글 작성</h2>
          {!isLoggedIn ? (
            <div className="c-login-container">
              <p className="c-login-redirect-message">
                로그인한 사용자만 게시물을 작성할 수 있습니다. 로그인 해주세요.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="c-login-redirect-button"
                data-text="로그인 하러 가기"
              >
                <span>로그인 하러 가기</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handlePostSubmit} className="c-post-form">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                placeholder="제목을 입력하세요"
                required
                className="c-post-title"
              />
              <textarea
                value={newPost.content}
                ref={textareaRef}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="내용을 입력하세요"
                required
                className="c-post-content"
              />

              <PhotoUploader
                ref={photoUploaderRef}
                onChange={setImages}
                className="c-post-photo-column-layout"
              />

              <div className="c-post-button-container">
                <button
                  type="submit"
                  className="c-post-save"
                  disabled={!isLoggedIn}
                  data-text="게시글 등록"
                >
                  <span>게시글 등록</span>
                </button>
                <button
                  type="button"
                  className="c-post-cancel"
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
    </>
  );
};

export default CreateCommunityPost;
