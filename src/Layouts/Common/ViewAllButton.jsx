import { useNavigate } from "react-router-dom";
import "../../styles/layouts/viewAllButton.css";

const ViewAllButton = ({ to = "/" }) => {
  const navigate = useNavigate();

  return (
    <div className="view-all-button-wrapper">
      <button className="view-all-button" onClick={() => navigate(to)}>
        자세히 보기
      </button>
    </div>
  );
};

export default ViewAllButton;
