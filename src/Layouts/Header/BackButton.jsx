import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md"; // 아이콘 추가

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/")} className="h-back-button">
      <MdArrowBack size={42} />
    </button>
  );
};

export default BackButton;
