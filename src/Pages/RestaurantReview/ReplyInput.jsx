import React, { useState, useEffect, useRef } from "react";
import { MdArrowUpward } from "react-icons/md";
import "../../styles/pages/replyInput.css";

const ReplyInput = ({
  parentId,
  rReviewId,
  user,
  onReplySubmit,
  handleReplySubmit,
}) => {
  const [replyContent, setReplyContent] = useState("");

  const textareaRef = useRef(null); // 자동 높이 조정용 참조

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 날짜를 "yyyy-MM-dd HH:mm:ss" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 초까지 포함된 형식
  };

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "18px"; // 기본 높이 설정
      textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞게 높이 조정
    }
  }, [replyContent]); // replyContent가 변경될 때마다 실행

  const handleReply = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (!replyContent.trim()) return;

    const reply = {
      content: replyContent,
      users_id: user.id,
      restaurants_id: rReviewId,
      parent_id: parentId,
      update_date: formatDate(new Date()),
    };

    try {
      const res = await fetch(
        `${BASE_URL}/api/restaurant-reviews/${rReviewId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reply),
        }
      );
      if (!res.ok) throw new Error("답글 등록 실패");

      setReplyContent(""); // 답글 내용 초기화
      onReplySubmit(); // 부모 컴포넌트에서 fetchComments 호출
      handleReplySubmit();
    } catch (err) {
      console.error("답글 등록 중 오류:", err);
    }
  };

  return (
    <form onSubmit={handleReply} className="review-create-reply-input">
      <textarea
        ref={textareaRef}
        placeholder="답글을 입력하세요."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="review-reply-input-field"
      />
      <button type="submit" className="review-create-reply-input-button">
        <MdArrowUpward />
      </button>
    </form>
  );
};

export default ReplyInput;
