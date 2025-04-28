import React, { useState, useEffect, useRef } from "react";
import "../../styles/pages/communityReplyInput.css";

const ReplyInput = ({
  parentId,
  communityId,
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

    // replyContent는 객체 형태이므로, communityId에 해당하는 값만 추출하여 사용
    const content = replyContent[communityId];

    // content가 비어있거나 trim이 안되면 처리하지 않음
    if (!content || !content.trim()) return;

    const reply = {
      content,
      users_id: user.id,
      communities_id: communityId,
      parent_id: parentId,
      update_date: formatDate(new Date()),
    };

    try {
      const res = await fetch(
        `${BASE_URL}/api/communities/${communityId}/comments`,
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
    <form
      onSubmit={(e) => handleReply(e, communityId)}
      className="community-reply-input"
    >
      <textarea
        ref={textareaRef}
        value={replyContent[communityId] || ""}
        onChange={(e) =>
          setReplyContent({
            ...replyContent,
            [communityId]: e.target.value,
          })
        }
        placeholder="답글을 입력하세요."
      />
      <button type="submit" className="community-reply-input-button">
        답글 작성
      </button>
    </form>
  );
};

export default ReplyInput;
