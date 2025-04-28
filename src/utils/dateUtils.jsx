import {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
  } from "date-fns";
  
  // 날짜를 상대적 시간으로 변환하는 함수
  export function formatRelativeDate(dateString) {
    const now = new Date();
    const parsedDate = new Date(dateString.replace(" ", "T"));
  
    const minutesAgo = differenceInMinutes(now, parsedDate);
    const hoursAgo = differenceInHours(now, parsedDate);
    const daysAgo = differenceInDays(now, parsedDate);
  
    if (minutesAgo < 1) {
      return "방금 전";
    } else if (minutesAgo < 60) {
      return `${minutesAgo}분 전`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo}시간 전`;
    } else if (daysAgo < 7) {
      return `${daysAgo}일 전`;
    } else if (daysAgo < 30) {
      return `${Math.floor(daysAgo / 7)}주 전`;
    } else {
      return `${Math.floor(daysAgo / 30)}개월 전`;
    }
  }
  