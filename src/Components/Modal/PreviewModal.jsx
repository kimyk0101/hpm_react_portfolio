const PreviewModal = ({ imageUrl, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4>프로필 사진 미리보기</h4>
        <img src={imageUrl} alt="미리보기" className="preview-img" />
        <div className="modal-actions">
          <button onClick={onConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
