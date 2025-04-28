import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "./pages/mainPage";
import LoginPage from "./pages/loginPage";
import JoinPage from "./pages/joinPage";
import Mypage from "./pages/Mypage/Mypage";
import EditProfile from "./pages/Mypage/EditProfile/EditProfile";
import SearchPage from "./pages/Search/SearchPage";
import CommunityList from "./pages/community/community";
import CreateCommunityPost from "./pages/community/createCommunityPost";
import CommunityDetail from "./pages/community/communityDetail";
import MountainReviewList from "./pages/mountainReview/mountainReview";
import CreateMountainReview from "./pages/mountainReview/createMountainReview";
import MountainReviewCard from "./pages/mountainReview/mountainReviewCard";
import RestaurantReviewList from "./pages/restaurantReview/restaurantReview";
import CreateRestaurantReview from "./pages/restaurantReview/createRestaurantReview";
import RestaurantReviewCard from "./pages/restaurantReview/RestaurantReviewCard";
import AllClubs from "./pages/club/allClubs";
import ClubComments from "./pages/club/clubComments";
import ChatSendbird from "./pages/club/chatSendbird";
import MountainRecommend from "./pages/mountain/mountainRecommend"; // 추가
import MountainResult from "./pages/mountain/mountainResult"; // 추가

import MountainMap from "./pages/mountain/list_map";
import MountainList from "./pages/mountain/mountainList";
import MountainDetail from "./pages/mountain/mountainDetail";
import "./styles/base/reset.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        {/* 마이페이지 */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/edit" element={<EditProfile />} />
        <Route path="/search" element={<SearchPage />} />
        {/* 자유 게시판 */}
        <Route path="/communities" element={<CommunityList />} />{" "}
        <Route path="/communities/new" element={<CreateCommunityPost />} />{" "}
        <Route path="/communities/:id" element={<CommunityDetail />} />{" "}
        {/* 등산 후기 */}
        <Route path="/mountain-reviews" element={<MountainReviewList />} />{" "}
        <Route
          path="/mountain-reviews/new"
          element={<CreateMountainReview />}
        />{" "}
        <Route path="/mountain-reviews" element={<MountainReviewCard />} />{" "}
        {/* 맛집 후기 */}
        <Route
          path="/restaurant-reviews"
          element={<RestaurantReviewList />}
        />{" "}
        <Route
          path="/restaurant-reviews/new"
          element={<CreateRestaurantReview />}
        />{" "}
        <Route path="/restaurant-reviews" element={<RestaurantReviewCard />} />{" "}
        {/* 모임 */}
        <Route path="/clubs" element={<AllClubs />} /> {/* 산 모임들 목록 */}
        <Route path="/clubs/:id" element={<ClubComments />} />{" "}
        {/* 각각의 산 모임 페이지 */}
        <Route path="/chatSendbird/:id" element={<ChatSendbird />} />{" "}
        {/* 샌드버드 채팅방 이동 페이지 */}
        <Route
          path="/mountain-recommend"
          element={<MountainRecommend />}
        />{" "}
        {/* 산 추천 페이지로 이동 */}
        <Route path="/mountain-result" element={<MountainResult />} />{" "}
        {/* 산 추천 결과 페이지로 이동 */}
        {/* 산 지도  */}
        <Route path="/mountain/list_map" element={<MountainMap />} />
        {/* 산 목록 */}
        <Route path="/mountain/list" element={<MountainList />} />
        {/* 산 단건 목록 */}
        <Route path="/mountain/:id" element={<MountainDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
