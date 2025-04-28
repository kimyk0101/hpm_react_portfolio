/*
 * 파일명: AuthContext.jsx
 * 작성자: 김경민
 * 작성일: 2025-03-24 ~ 03-28
 *
 * 설명:
 * - 로그인 상태, 유저 정보 등을 필요한 컴포넌트마다 불러와서
 * - 공유할 수 있게 만든 전역 상태 관리 파일
 *
 */

import { createContext, useContext, useState, useEffect } from "react";

//  로그인 상태와 유저 정보를 저장할 Context 객체 생성
const AuthContext = createContext();

//  앱 전체를 감싸서 로그인 관련 상태를 공급하는 AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [isLoading, setIsLoading] = useState(true); // 세션 확인 중인지 여부
  const [user, setUser] = useState(null); // 유저 정보 객체
  const BASE_URL = import.meta.env.VITE_API_BASE_URL; // API 요청 주소

  //  페이지 로드될 때 세션 상태 확인
  //  세션이 있으면 로그인 상태, 없으면 로그아웃 상태로 설정
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/session`, {
          credentials: "include", //  세션 쿠기 포함해서 요청
        });

        console.log("세션 상태 응답, res");

        if (res.ok) {
          const data = await res.json();
          console.log("세션 유저 데이터", data);

          if (data) {
            setIsLoggedIn(true);
            setUser(data); // 유저 정보 저장
          }
        } else {
          console.log("세션 응답이 ok가 아님");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("세션 확인 실패", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus(); //  세션 확인 함수 실행
  }, []);

  return (
    //  로그인 상태와 유저 정보 등을 전역에 공유
    //  필요한 컴포넌트에서 해당 값들 사용
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 로그인 상태를 어떤 컴포넌트에서든 쉽게 가져오기 위한 훅
export const useAuth = () => useContext(AuthContext);
