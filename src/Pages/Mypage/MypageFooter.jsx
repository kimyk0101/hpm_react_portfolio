import { useNavigate } from "react-router-dom";
import MypageDelete from "./MypageDelete";

const MypageFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="mypage-footer">
      <div>
        <h3>문의/안내</h3>
        <ul>
          <li onClick={() => navigate("/notice")}>공지사항</li>
          <li onClick={() => navigate("/inquiry")}>문의하기</li>
        </ul>
      </div>

      <div>
        <h3>서비스 관리</h3>
        <ul>
          <li onClick={() => navigate("/terms/privacy")}>개인정보 이용약관</li>
          <li onClick={() => navigate("/terms/location")}>
            위치기반서비스 이용약관
          </li>
          <MypageDelete />
        </ul>
      </div>
    </footer>
  );
};

export default MypageFooter;
