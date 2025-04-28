import { useState } from "react";
import ConfirmModal from "../../components/modal/ConfirmModal";
import PasswordModal from "../../components/modal/PasswordModal";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MypageDelete = () => {
  const { user, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleWithdraw = () => setShowConfirm(true);
  const handleConfirmDelete = () => {
    setShowConfirm(false);
    setShowPasswordModal(true);
  };
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handlePasswordSubmit = async (password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, password }),
      });

      if (!res.ok) throw new Error("비밀번호가 일치하지 않습니다.");

      const deleteRes = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!deleteRes.ok) throw new Error("회원 탈퇴 실패");

      setUser(null);
      setIsLoggedIn(false);
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (err) {
      alert(err.message || "회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <li onClick={handleWithdraw}>회원 탈퇴</li>

      {showConfirm && (
        <ConfirmModal
          message={
            <>
              정말로 탈퇴하시겠습니까?
              <br />
              탈퇴 시 모든 정보는 복구되지 않습니다.
            </>
          }
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};

export default MypageDelete;
