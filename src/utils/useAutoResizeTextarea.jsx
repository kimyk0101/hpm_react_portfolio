import { useEffect, useRef } from "react";

const useAutoResizeTextarea = (value) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 초기화
      textarea.style.height = `${textarea.scrollHeight}px`; // 높이 설정
    }
  }, [value]);

  return textareaRef;
};

export default useAutoResizeTextarea;
