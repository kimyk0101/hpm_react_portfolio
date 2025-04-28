import React, { useState } from "react";

const ReplyItem = ({ reply, user, onReplyUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 답글 수정 저장
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await fetch(`${BASE_URL}/api/restaurant-reviews/comments/${reply.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      alert("수정되었습니다.");
      setIsEditing(false);
      onReplyUpdate();
    } catch (error) {
      console.error("답글 수정 실패:", error);
    }
  };

  // 답글 삭제
  const handleDelete = async () => {
    if (!window.confirm("답글을 삭제하시겠습니까?")) return;

    try {
      await fetch(`${BASE_URL}/api/restaurant-reviews/comments/${reply.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usersId: user.id }), // 본인 확인용
      });

      alert("삭제되었습니다.");
      onReplyUpdate();
    } catch (error) {
      console.error("답글 삭제 실패:", error);
    }
  };

  return (
    <div className="review-reply-item">
      <div className="review-reply-header">
        <strong>{reply.nickname}</strong>
        <span className="review-reply-date">
          {new Date(reply.update_date).toLocaleString()}
        </span>
      </div>

      {isEditing ? (
        <div className="review-reply-edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button onClick={handleSaveEdit}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        <div className="review-reply-content">{reply.content}</div>
      )}

      {user?.id === reply.users_id && !isEditing && (
        <div className="review-reply-actions">
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
