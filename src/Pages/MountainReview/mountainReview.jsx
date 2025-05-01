/*
 * 파일명: MountainReviewList.jsx
 * 작성자: 김연경
 * 작성일: 2025-04-07 ~ 04-10
 *
 * 설명:
 * - 등산 후기 게시글 리스트 페이지
 * - 게시글 리스트는 카드 형태로 렌더링되며, 각각의 카드에는 이미지, 좋아요, 댓글, 답글 기능 포함
 * - 산 이름 검색을 통한 게시글 필터링 기능 제공
 * - 사용자 로그인 상태 확인 후, 작성 버튼 클릭 시 글쓰기 페이지로 이동
 * - 게시글의 CRUD 기능 및 댓글 변경 시 리스트 갱신
 *
 * 수정자: 김승룡
 * 수정내용: 산 상세 목록에서 맛집 후기 버튼 클릭 시, 해당 산 이름이 자동으로 검색창에 반영되어 필터링되도록 기능 추가
 * 수정일: 2025-04-11
 *
 *  * 관련 파일 구조:
 * └─ MountainReview
 *    ├─ MountainReview.jsx                // 등산 후기 메인 페이지 (리스트)
 *    ├─ CreateMountainReview.jsx          // 게시글 작성 페이지
 *    ├─ MountainReviewCard.jsx            // 게시글 카드 컴포넌트
 *    ├─ MountainReviewLikeButton.jsx      // 좋아요 버튼 컴포넌트
 *    ├─ CommentSection.jsx                  // 댓글/답글 영역 통합
 *    ├─ CommentInput.jsx                    // 댓글 입력창
 *    ├─ CommentItem.jsx                     // 댓글 아이템
 *    ├─ ReplyInput.jsx                      // 답글 입력창
 *    └─ ReplyItem.jsx                       // 답글 아이템
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import MountainReviewCard from "./MountainReviewCard";
import "../../styles/pages/mountainReview.css";
import StickyButton from "../../components/map/StickyButton";

const MountainReviewList = () => {
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const API_URL = `${BASE_URL}/api/mountain-reviews`;
  const API_URL = "http://localhost:8088/api/mountain-reviews";

  const location = useLocation(); // 라우터 location 정보 가져오기
  const [searchQuery, setSearchQuery] = useState(
    location.state?.mountainName || "" // 초기값에 산 이름 자동 설정
  );

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(
        // `${BASE_URL}/api/users/session`, 
        "http://localhost:8088/api/users/session",
        {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
        console.log("로그인 유저 정보:", data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("📥 게시글 데이터:", data);

      const postData = data.map((mReview) => ({
        id: mReview.id,
        name: mReview.name,
        nickname: mReview.nickname,
        location: mReview.location,
        courseName: mReview.course_name,
        difficultyLevel: mReview.difficulty_level,
        content: mReview.content,
        updateDate: mReview.update_date,
        usersId: mReview.users_id,
        mountainsId: mReview.mountains_id,
        mountainCoursesId: mReview.mountain_courses_id,
        likes: mReview.likes,
        commentCount: mReview.comment_count,
      }));

      setPosts(postData);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCommentChange = () => {
    fetchPosts(); // 댓글 변경 시 전체 게시글 다시 불러오기
  };

  // 작성하기 버튼 클릭 시
  const goToPostCreate = () => {
    if (!isLoggedIn) {
      alert("로그인 후 사용 가능합니다");
      return;
    }
    navigate("/mountain-reviews/new");
  };

  // 검색어로 필터링된 게시글
  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <br />

      <DefaultLayout>
        <div className="mReview-feed-page">
          {/* 검색창 */}
          <div className="mReview-search-form">
            <div className="mReview-search-wrapper">
              <input
                type="text"
                placeholder="산 이름으로 게시물 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mReview-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mReview-search-clear-button"
                >
                  ✕
                </button>
              )}
              <button type="button" className="mReview-search-icon-button">
                <FiSearch />
              </button>
            </div>
          </div>

          {/* 게시글 리스트 */}
          <div className="mReview-post-list">
            {filteredPosts.length === 0 ? (
              <div className="no-posts-container">
                <img
                  src="/images/noPosts.png"
                  alt="게시물이 없습니다"
                  className="no-posts-image"
                />
              </div>
            ) : (
              filteredPosts.map((post) => (
                <MountainReviewCard
                  key={post.id}
                  post={post}
                  currentUser={user}
                  onCommentChange={handleCommentChange}
                />
              ))
            )}
          </div>
        </div>
      </DefaultLayout>
      <StickyButton
        className="no-style"
        showHome={true}
        showBack={true}
        showWrite={true}
        showMap={false}
        showList={false}
        showScrollTop={true}
        homePath="/"
        backPath="/previous"
        onWriteClick={goToPostCreate}
      />
    </>
  );
};

export default MountainReviewList;
