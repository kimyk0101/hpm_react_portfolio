import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/pages/myPage.css";

const ProfileBox = () => {
  const { user } = useAuth();

  return (
    <div className="profile-box">
      <div className="profile-img-container">
        <img
          src={user?.profileurl || "/default-profile.jpg"}
          alt="프로필"
          className="profile-img profile-img-loaded"
        />
      </div>
      <h2 className="profile-nickname">{user?.nickname}</h2>
      <p className="profile-email">{user?.email}</p>
      <button
        className="edit-btn"
        onClick={() => (window.location.href = "/mypage/edit")}
      >
        정보 수정
      </button>
    </div>
  );
};

export default ProfileBox;
