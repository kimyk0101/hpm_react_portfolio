import React, { useEffect, useRef } from "react";
import "../../styles/pages/communityCommentInput.css";

const CommentInput = ({ content, setContent, onSubmit }) => {
  const textareaRef = useRef(null);

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "18px";
      textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞게 높이 조정
    }
  }, [content]); // content가 변경될 때마다 실행

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="community-comment-input">
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="댓글을 입력하세요..."
    />
    <button
      type="submit"
      className="community-comment-input-button"
    >
      댓글 작성
    </button>
  </form>
  );
};

export default CommentInput;
