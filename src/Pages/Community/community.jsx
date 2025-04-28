/*
 * 파일명: CommunityList.jsx
 * 작성자: 김연경
 * 작성일: 2025-04-01 ~ 04-05
 *
 * 설명:
 * - 커뮤니티(자유게시판) 리스트 페이지
 * - 게시글 리스트는 테이블 형태로 렌더링되며, 제목, 작성자, 날짜, 조회수, 댓글 수 정보 표시
 * - 후기 게시판과 달리 산 관련 정보 없이 자유롭게 글 작성 가능
 * - CRUD 기능 및 게시글 상세 페이지 존재
 * - 로그인 상태 확인 후, '작성하기' 버튼 클릭 시 글쓰기 페이지로 이동
 * - 조회수는 상세 페이지 이동 시 자동 증가되도록 구현
 * - 댓글/답글 기능이 포함되어 있으며, 해당 게시글 작성자의 경우 '작성자' 표시가 추가됨
 * - 페이지네이션 기능 구현
 *
 * 수정자: 김경민
 * 수정내용: 이미지 업로드 기능 추가 (게시글 작성 및 수정 시 이미지 첨부 가능하도록 구현)
 * 수정일: 2025-04-05
 * 
 * 관련 파일 구조:
 * └─ Community
 *    ├─ Community.jsx                    // 자유게시판 리스트 페이지 
 *    ├─ CreateCommunityPost.jsx          // 게시글 작성 페이지
 *    ├─ CommunityDetail.jsx              // 게시글 상세 페이지
 *    ├─ CommentSection.jsx               // 댓글/답글 영역 통합
 *    ├─ CommentInput.jsx                 // 댓글 입력창
 *    ├─ CommentItem.jsx                  // 댓글 아이템
 *    ├─ ReplyInput.jsx                   // 답글 입력창
 *    └─ ReplyItem.jsx                    // 답글 아이템
 */

import React, { useState, useEffect } from "react";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns"; //  상대적 시간 계산 라이브러리
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/community.css";

const CommunityList = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/communities`; // API URL

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]); // login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const postsPerPage = 15; // 한 페이지에 표시할 게시글 수

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

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const postData = Object.values(data).map((community) => ({
        id: community.id,
        nickname: community.nickname,
        title: community.title,
        content: community.content,
        updateDate: community.update_date,
        views: community.views,
        commentCount: community.comment_count,
      }));

      setPosts(postData); // 상태 업데이트
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  // 날짜를 상대적 시간으로 변환하는 함수
  const formatRelativeDate = (date) => {
    const now = new Date();
    const parsedDate = new Date(date.replace(" ", "T"));
    const minutesAgo = differenceInMinutes(now, parsedDate);
    const hoursAgo = differenceInHours(now, parsedDate);
    const daysAgo = differenceInDays(now, parsedDate);

    if (minutesAgo < 60) {
      return `${minutesAgo}분 전`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo}시간 전`;
    } else if (daysAgo < 7) {
      return `${daysAgo}일 전`;
    } else if (daysAgo < 30) {
      return `${Math.floor(daysAgo / 7)}주 전`;
    } else {
      return `${Math.floor(daysAgo / 30)}개월 전`;
    }
  };

  const navigate = useNavigate();

  const goToDetail = async (postId) => {
    try {
      // 조회수 증가 요청 보내기
      const response = await fetch(
        `${BASE_URL}/api/communities/${postId}/increment-views`,
        {
          method: "PUT", // PUT 요청으로 조회수 증가
        }
      );

      if (response.ok) {
        // 조회수가 증가한 후, 상세 페이지로 이동
        navigate(`/communities/${postId}`);
      } else {
        console.error("조회수 증가 실패");
      }
    } catch (error) {
      console.error("조회수 증가 중 오류 발생:", error);
    }
  };

  // 게시글 작성 페이지로 이동
  const goToPostCreate = () => {
    navigate("/communities/new");
    window.scrollTo(0, 0); // 스크롤 위치를 맨 위로 설정
  };

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // 유효한 페이지 번호만 허용
    setCurrentPage(pageNumber); // 페이지 번호 변경
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 현재 페이지에 해당하는 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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

      <DefaultLayout>
        <div className="communityPage">
          <h2>자유게시판</h2>

          {currentPosts.length === 0 ? (
            // 게시글이 없을 때 보여줄 이미지
            <div className="no-posts-container">
              <img
                src="/images/noPosts.png"
                alt="게시물이 없습니다"
                className="no-posts-image"
              />
            </div>
          ) : (
            <>
              {/* 게시글 목록 표시 */}
              <table className="community-table">
                <thead>
                  <tr>
                    <th className="community-col-number">번호</th>
                    <th className="community-col-title">제목</th>
                    <th className="community-col-nickname">작성자</th>
                    <th className="community-col-date">날짜</th>
                    <th className="community-col-views">조회 수</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      onClick={() => goToDetail(post.id)}
                      className="community-post-row"
                    >
                      <td className="community-post-center">
                        {posts.length -
                          index -
                          (currentPage - 1) * postsPerPage}
                      </td>
                      <td className="community-post-title">
                        {post.title}{" "}
                        <span style={{ color: "green" }}>
                          [{post.commentCount}]
                        </span>
                      </td>
                      <td className="community-post-center">{post.nickname}</td>
                      <td className="community-post-center">
                        {formatRelativeDate(post.updateDate)}
                      </td>
                      <td className="community-post-center">{post.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              <div className="community-pagination">
                <button
                  className="community-pagination-btn"
                  onClick={() => handlePageChange(1)}
                >
                  처음
                </button>
                <button
                  className="community-pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  이전
                </button>

                {(() => {
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, startPage + 4);
                  if (endPage - startPage < 4) {
                    startPage = Math.max(1, endPage - 4);
                  }

                  return [...Array(endPage - startPage + 1)].map((_, i) => {
                    const pageNum = startPage + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`community-pagination-btn ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}

                <button
                  className="community-pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  다음
                </button>
                <button
                  className="community-pagination-btn"
                  onClick={() => handlePageChange(totalPages)}
                >
                  마지막
                </button>
              </div>
            </>
          )}
          {/* 게시글 등록 버튼 */}
          <div className="community-button-container">
            <button
              onClick={goToPostCreate}
              className="create-community-post-button"
              data-text="작성하기"
            >
              <span>작성하기</span>
            </button>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default CommunityList;
