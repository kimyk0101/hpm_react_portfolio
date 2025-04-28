import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import CommunityPreview from "./CommunityPreview";
import "../../../styles/components/communitySection.css";

const CommunitySection = () => {
  const navigate = useNavigate();

  const handleGoCommunity = () => {
    window.scrollTo(0, 0); // 스크롤 위치를 맨 위로 설정
    navigate("/communities"); // 페이지 이동
  };

  return (
    <section className="community-section-container">
      <div className="community-left">
        <img
          src="/images/CommunityImage.png"
          alt="커뮤니티 아이콘"
          className="community-image"
        />
      </div>

      <div className="community-right">
        <h3>등산만큼, 수다도 필요하니까</h3>
        <p>
          오늘 산 얘기해도 좋고, 그냥 오늘 얘기해도 좋아요.
          <br />
          같이 떠들 사람, 여기 다 모였어요.
        </p>

        <button
          className="go-community-btn"
          onClick={handleGoCommunity} // 수정된 핸들러 함수 사용
        >
          <FiArrowRight />
        </button>
      </div>
    </section>
  );
};

export default CommunitySection;
