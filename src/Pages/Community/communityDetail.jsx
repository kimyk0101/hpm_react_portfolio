import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import ContentContainer from "../../layouts/ContentContainer.jsx";
import Header from "../../layouts/Header/Header.jsx";
import DefaultLayout from "../../layouts/DefaultLayout.jsx";
import PhotoUploader from "../../components/photoUploader/PhotoUploader.jsx";
import "../../styles/pages/communityDetail.css";
import CommentSection from "./CommentSection.jsx";

function CommunityDetail() {
  const { id } = useParams();
  const communityId = parseInt(id, 10); // String -> Long 타입으로 변환

  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const API_COMMUNITY_URL = `${BASE_URL}/api/communities/${communityId}`;
  // const API_PHOTO_URL = `${BASE_URL}/api/communities/photos/by-community/${communityId}`;
  // const API_PHOTO_DELETE = (photoId) =>
  //   `${BASE_URL}/api/communities/photos/by-photo/${photoId}`;
  const API_COMMUNITY_URL = `http://localhost:8088/api/communities/${communityId}`;
  const API_PHOTO_URL = `http://localhost:8088/api/communities/photos/by-community/${communityId}`;
  const API_PHOTO_DELETE = (photoId) =>
    `http://localhost:8088/api/communities/photos/by-photo/${photoId}`;

  const [post, setPost] = useState(null);
  const [photos, setPhotos] = useState([]); // 이미지 상태
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [editPost, setEditPost] = useState(null); // 수정할 게시글 상태 추가
  const uploaderRef = useRef(); // PhotoUploader ref

  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      // const response = await fetch(`${BASE_URL}/api/users/session`, {
      const response = await fetch("http://localhost:8088/api/users/session", {
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

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(API_COMMUNITY_URL); // API 요청
      const data = await response.json(); // 응답 데이터 처리

      // 서버 응답에서 usersId 필드 확인 후 클라이언트에서 처리
      console.log(data); // 데이터 확인

      const postData = {
        id: data.id,
        nickname: data.nickname,
        title: data.title,
        content: data.content,
        updateDate: new Date(data.update_date),
        usersId: data.users_id,
        views: data.views,
      };
      console.log(postData);

      setPost(postData); // 상태 업데이트
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };

  //  이미지 불러오기 API
  const fetchPhotos = async () => {
    try {
      const response = await fetch(API_PHOTO_URL);

      if (response.status === 404) {
        console.warn("해당 커뮤니티에 사진이 없습니다.");
        setPhotos([]); // 빈 배열로 설정해서 이후 오류 방지
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("사진 불러오기 실패:", error);
    }
  };

  //  각 이미지 개별 삭제 API
  const handleDeletePhoto = async (photoId) => {
    try {
      await fetch(API_PHOTO_DELETE(photoId), { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (e) {
      console.error("이미지 삭제 실패:", e);
    }
  };

  // ✅ 게시글 상세 정보 가져오기
  useEffect(() => {
    fetchPostDetail();
    fetchPhotos(); //  이미지 정보 추가
  }, [communityId]); // 게시글 ID가 바뀔 때만 실행

  // 게시글 수정
  const handleEditPost = async (e) => {
    e.preventDefault();

    const updatedPost = {
      id: editPost.id,
      title: editPost.title,
      content: editPost.content,
    };

    try {
      const res = await fetch(API_COMMUNITY_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (res.ok) {
        // ✅ 새 이미지가 있다면 업로드
        const newImages = uploaderRef.current?.getFiles?.();
        if (newImages?.length > 0) {
          const formData = new FormData();
          formData.append("communitiesId", communityId);
          newImages.forEach((img) => formData.append("photos", img));

          // await fetch(`${BASE_URL}/api/communities/photos/upload`, {
          await fetch("http://localhost:8088/api/communities/photos/upload", {
            method: "POST",
            body: formData,
          });
        }
        // 수정 후 게시글 목록 갱신
        fetchPostDetail();
        setEditPost(null); // 수정 완료 후 수정 폼 초기화
        fetchPhotos();
        // 수정 완료 알림
        alert("수정되었습니다");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
    }
  };

  const handleDeletePost = async () => {
    // 삭제 확인 대화 상자
    const isConfirmed = window.confirm("게시글을 삭제할까요?");

    // 사용자가 삭제를 확인하면 삭제 진행
    if (isConfirmed) {
      try {
        const response = await fetch(API_COMMUNITY_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usersId: user.id }), // 로그인한 사용자의 usersId를 전달
        });

        // response.ok로 삭제 성공 여부 확인
        if (response.ok) {
          alert("삭제되었습니다");
          // 삭제 후 목록 갱신 (리스트 페이지로 이동)
          navigate("/communities");
        } else {
          // 실패 시 에러 출력
          console.error("게시글 삭제 실패", await response.json());
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    } else {
      // 사용자가 취소를 클릭한 경우
      console.log("삭제가 취소되었습니다.");
    }
  };

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>
      <DefaultLayout>
        <div className="communityPage-detail">
          <h2>
            게시글 상세보기{" "}
            {editPost && <span className="c-edit-label"> &lt;수정중&gt;</span>}
          </h2>

          {post ? (
            editPost ? (
              // ✨ 게시글 수정 폼
              <div className="c-detail-edit-form">
                <div className="c-detail-input-container">
                  <h3>
                    <input
                      type="text"
                      value={editPost.title}
                      onChange={(e) =>
                        setEditPost({ ...editPost, title: e.target.value })
                      }
                      placeholder="제목"
                      required
                      className="c-detail-edit-title"
                    />
                  </h3>
                  <div className="c-detail-tooltip">
                    수정할 수 있는 부분입니다
                  </div>
                </div>
                <p className="c-detail-nickname">{post.nickname}</p>

                <div className="c-detail-meta">
                  <p className="c-detail-date">
                    {post.updateDate.toLocaleString()}
                  </p>
                  <p className="c-detail-views">조회 {post.views}</p>
                </div>

                <div className="c-detail-input-container">
                  <textarea
                    value={editPost.content}
                    onChange={(e) =>
                      setEditPost({ ...editPost, content: e.target.value })
                    }
                    placeholder="내용을 입력하세요..."
                    required
                    className="c-detail-edit-content"
                  />
                  <div className="c-detail-tooltip">
                    수정할 수 있는 부분입니다
                  </div>
                </div>

                <PhotoUploader
                  ref={uploaderRef}
                  initialPhotos={photos}
                  onDeleteServerPhoto={handleDeletePhoto}
                  onChange={() => {}}
                  className="c-detail-photo-column-layout"
                />

                <div className="c-detail-buttons">
                  <button
                    type="submit"
                    onClick={handleEditPost}
                    className="c-detail-save"
                    data-text="수정 완료"
                  >
                    <span>수정 완료</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPost(null)}
                    className="c-detail-cancel"
                    data-text="취소"
                  >
                    <span>취소</span>
                  </button>
                </div>
              </div>
            ) : (
              // 게시글 상세 보기
              <div className="c-detail-post">
                <h3>{post.title}</h3>
                <p className="c-detail-nickname">{post.nickname}</p>
                <div className="c-detail-meta">
                  <p className="c-detail-date">
                    {new Date(post.updateDate).toLocaleString("ko-KR", {
                      hour12: false,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  <p className="c-detail-views">조회 {post.views}</p>
                </div>

                {/* 이미지 렌더링 */}
                {photos.length > 0 && (
                  <div
                    className={`c-detail-photos ${
                      photos.length === 1 ? "single" : ""
                    }`}
                  >
                    {photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.file_path}
                        alt="게시물 이미지"
                        className="c-detail-photo"
                      />
                    ))}
                  </div>
                )}
                <p className="c-detail-content">{post.content}</p>
              </div>
            )
          ) : (
            <p>게시글을 불러오는 중...</p>
          )}

          {isLoggedIn && user.id === post?.usersId && !editPost && (
            <div className="c-detail-buttons">
              <button
                className="c-detail-edit-delete-button"
                onClick={() => setEditPost(post)}
                data-text="수정"
              >
                <span>수정</span>
              </button>
              <button
                className="c-detail-edit-delete-button"
                onClick={handleDeletePost}
                data-text="삭제"
              >
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>
        <div className="c-detail-comments">
          <CommentSection
            postAuthorId={post?.usersId}
            communityId={communityId}
            user={user}
            onCommentChange={() => {}}
          />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default CommunityDetail;
