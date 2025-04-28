/*
* 기능명 : Club
* 파일명 : allClubs.jsx, allClubs.css, clubComments.jsx, clubComments.css, chatSendbird.jsx
* 작성자 : 서민정
* 설명 : 

        allClubs : 3개의 산에 대한 모임 화면
    - 클릭시, 해당 산의 공지사항 조회 및 조회수 상승 기능
    - 마우스 hover시 눈에 잘 띄도록 UI 구성

        clubComments : 공지사항 화면 및 채팅방 입장 전단계의 화면
    - 공지사항 등록/수정/삭제 기능 제공
    - 본인이 작성한 게시글만 수정/삭제 가능하도록 기능 설정

        chatSendbird.jsx : 샌드버드 채팅에 연결되는 화면
    - SPRINGBOOT에서 작성한 샌드버드 API에 연결되는 기능
    - 로그인한 유저의 닉네임으로 USER 아이디가 생성되고, 해당 아이디로 실시간 채팅 가능        

* 작성일 : 2025-03-25 ~ 04-14
*/


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/allClubs.css";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";

const AllClubs = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/clubs`;
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchClubs = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("클럽 목록을 불러오는 중 오류 발생:", error);
      setError("클럽 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/session`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchClubs();
    checkLoginStatus();
  }, []);

  const handleCardClick = async (clubId) => {
    if (!isLoggedIn) {
      if (
        window.confirm(
          "로그인한 사용자만 모임에 참여할 수 있습니다. 로그인 하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
    } else {
      try {
        // 조회수 증가 API 호출 (PUT 메서드 사용)
        const response = await fetch(`${API_URL}/${clubId}/increment-views`, {
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 클럽 목록 다시 불러오기
        fetchClubs();

        // clubs/:id로 이동
        navigate(`/clubs/${clubId}`);
      } catch (error) {
        console.error("조회수 증가 중 오류 발생:", error);
        setError("조회수 증가 중 오류가 발생했습니다.");
      }
    }
  };

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
        <ContentContainer>
          <div className="clubs-page">
            <br />
            <div className="page-header">
              <h2>모임 목록</h2>
            </div>
            <br />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {clubs.length > 0 ? (
              <div className="club-cards-container">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="club-card"
                    onClick={() => handleCardClick(club.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{club.name}</h3>
                    <img
                      src={`${import.meta.env.BASE_URL}clubs-images/${
                        club.id
                      }.jpg`}
                      alt={club.name}
                    />
                    <p className="club-title">{club.title}</p>
                    <p>{club.content}</p>
                    <br />
                    <p className="club-views">조회수 : {club.views}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>클럽 목록을 불러오는 중이거나, 클럽이 없습니다.</p>
            )}
          </div>
        </ContentContainer>
      </DefaultLayout>
    </>
  );
};

export default AllClubs;
