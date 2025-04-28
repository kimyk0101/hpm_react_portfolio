import React, { useEffect, useRef } from "react";
import "../../styles/pages/commentInput.css";
import { MdArrowUpward } from "react-icons/md";

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
    <form onSubmit={handleSubmit} className="review-create-comment-input">
      <textarea
        type="text"
        ref={textareaRef}
        placeholder="댓글을 입력하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="review-comment-input-field"
      />
      <button type="submit" className="review-create-comment-input-button">
        <MdArrowUpward />
      </button>
    </form>
  );
};

export default CommentInput;
