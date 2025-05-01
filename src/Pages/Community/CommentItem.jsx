import React, { useState, useEffect, useRef } from "react";
import ReplyInput from "./ReplyInput";
import ReplyItem from "./ReplyItem";
import "../../styles/pages/communityCommentItem.css";

const CommentItem = ({
  comment,
  user,
  onCommentUpdate,
  communityId,
  postAuthorId,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const textareaRef = useRef(null); // ref로 textarea를 다룬다.

  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "18px"; // 최소 높이 설정
      textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞게 높이 조정
    }
  }, [editContent]); // editContent가 변경될 때마다 실행

  const formatRelativeDate = (date) => {
    const now = new Date();
    const parsedDate = new Date(date.replace(" ", "T"));
    const diffMs = now - parsedDate;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    return `${Math.floor(days / 30)}개월 전`;
  };

  // 답글 입력 창 토글
  const handleToggleReplyInput = () => {
    setShowReplyInput((prev) => !prev);
  };

  const handleReplySubmit = () => {
    setShowReplyInput(false); // 답장 전송 후 입력창 닫기
    onCommentUpdate(); // 댓글 업데이트 함수 호출
  };

  // 수정 시작
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await fetch(
        // `${BASE_URL}/api/communities/comments/${comment.id}`,
        `http://localhost:8088/api/communities/comments/${comment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editContent,
          }),
        }
      );

      alert("수정되었습니다.");
      setIsEditing(false);
      onCommentUpdate();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  // 댓글 삭제
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await fetch(
        // `${BASE_URL}/api/communities/comments/${comment.id}`,
        `http://localhost:8088/api/communities/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usersId: user.id }), // 본인 확인
        }
      );

      alert("삭제되었습니다.");
      onCommentUpdate();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <div className="community-comment">
      {/* 닉네임 + 작성자 표시 */}
      <div className="community-comment-header">
        <span className="community-comment-nickname">{comment.nickname}</span>
        {postAuthorId === comment.users_id && (
          <span className="community-comment-author-badge">작성자</span>
        )}
      </div>

      {/* 댓글 내용 */}
      {isEditing ? (
        <div className="community-comment-edit-wrapper">
          <textarea
            className="community-comment-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="community-comment-edit-buttons">
            <button
              className="community-comment-edit-button"
              onClick={handleSaveEdit}
            >
              수정 완료
            </button>
            <button
              className="community-comment-edit-button"
              onClick={handleCancelEdit}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="community-comment-content">{comment.content}</p>
      )}

      {/* 작성일 + 답글쓰기 버튼 */}
      <div className="community-comment-meta">
        <span className="community-comment-updateDate">
          {formatRelativeDate(comment.update_date)}
        </span>
        <button
          className="community-comment-reply-button"
          onClick={handleToggleReplyInput}
        >
          답글 쓰기
        </button>
      </div>

      {/* 수정/삭제 버튼 (작성자만) */}
      {user?.id === comment.users_id && !isEditing && (
        <div className="community-comments-buttons">
          <button
            className="community-comments-edit-delete-button"
            onClick={handleEdit}
          >
            수정
          </button>
          <button
            className="community-comments-edit-delete-button"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      )}

      {/* 답글 입력창 */}
      {showReplyInput && (
        <ReplyInput
          parentId={comment.id}
          communityId={communityId}
          user={user}
          onReplySubmit={onCommentUpdate}
          handleReplySubmit={handleReplySubmit}
        />
      )}

      <div className="community-replies">
        {comment.replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            user={user}
            communityId={communityId}
            onReplyUpdate={onCommentUpdate}
            postAuthorId={postAuthorId}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentItem;
