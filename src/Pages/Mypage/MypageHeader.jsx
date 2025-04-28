import { useAuth } from "../../contexts/AuthContext";
import ProfileImage from "./ProfileImage";

const MypageHeader = ({ setActiveTab }) => {
  const { user } = useAuth();

  return (
    <header className="mypage-header">
      <ProfileImage src={user?.profileurl} />
      <h2>{user?.nickname}</h2>
      <div className="header-actions">
        <button onClick={() => setActiveTab("edit")}>정보 수정</button>
        {/* <button onClick={() => navigate("/mypage/groups")}>모임 목록</button> */}
      </div>
    </header>
  );
};

export default MypageHeader;
