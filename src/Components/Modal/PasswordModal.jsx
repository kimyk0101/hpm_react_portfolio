import React, { useState } from "react";
import "../../styles/components/modal.css";

const PasswordModal = ({ onSubmit, onCancel }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    onSubmit(password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>비밀번호를 입력하세요</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          <div className="modal-buttons">
            <button type="button" onClick={onCancel}>
              취소
            </button>
            <button type="submit">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
