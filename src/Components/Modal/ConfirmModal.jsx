import React from "react";
import "../../styles/components/modal.css";

const ConfirmModal = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onCancel}>취소</button>
          <button onClick={onConfirm} className="danger">
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
