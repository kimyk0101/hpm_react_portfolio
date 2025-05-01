import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "./Pages/MainPage";
import LoginPage from "./Pages/LoginPage";
import JoinPage from "./Pages/JoinPage";
import Mypage from "./pages/Mypage/Mypage";
import EditProfile from "./pages/Mypage/EditProfile/EditProfile";
import SearchPage from "./pages/Search/SearchPage";
import CommunityList from "./Pages/Community/Community";
import CreateCommunityPost from "./Pages/Community/CreateCommunityPost";
import CommunityDetail from "./Pages/Community/CommunityDetail";
import MountainReviewList from "./Pages/MountainReview/MountainReview";
import CreateMountainReview from "./Pages/MountainReview/CreateMountainReview";
import MountainReviewCard from "./Pages/MountainReview/MountainReviewCard";
import RestaurantReviewList from "./pages/restaurantReview/restaurantReview";
import CreateRestaurantReview from "./pages/restaurantReview/createRestaurantReview";
import RestaurantReviewCard from "./pages/restaurantReview/RestaurantReviewCard";
import AllClubs from "./Pages/Club/AllClubs";
import ClubComments from "./Pages/Club/ClubComments";
import ChatSendbird from "./Pages/Club/ChatSendbird";
import MountainRecommend from "./Pages/Mountain/MountainRecommend"; // 추가
import MountainResult from "./Pages/Mountain/MountainResult"; // 추가

import MountainMap from "./Pages/Mountain/List_map";
import MountainList from "./Pages/Mountain/MountainList";
import MountainDetail from "./Pages/Mountain/MountainDetail";
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
