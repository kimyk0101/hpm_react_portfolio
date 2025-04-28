import { useNavigate } from "react-router-dom";

const MypageContent = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <section className="mypage-content">
      <h3>내 활동</h3>
      <ul>
        <li
          className={activeTab === "community" ? "active" : ""}
          onClick={() => setActiveTab("community")}
        >
          커뮤니티
        </li>
        <li
          className={activeTab === "mountain" ? "active" : ""}
          onClick={() => setActiveTab("mountain")}
        >
          등산 후기
        </li>
        <li
          className={activeTab === "restaurant" ? "active" : ""}
          onClick={() => setActiveTab("restaurant")}
        >
          맛집 리뷰
        </li>
        <li onClick={() => navigate("/clubs")}>모임</li>
      </ul>
    </section>
  );
};

export default MypageContent;