import { useNavigate } from "react-router-dom";

const ReviewColumn = ({ title, description, link, image }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    window.scrollTo(0, 0); // 스크롤 위치를 맨 위로 설정
    navigate(link); // 페이지 이동
  };

  return (
    <div className="review-column">
      {image && <img src={image} alt="icon" className="review-icon" />}
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="review-button" onClick={handleButtonClick}>
        바로 가기
      </button>
    </div>
  );
};

export default ReviewColumn;
