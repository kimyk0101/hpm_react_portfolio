import { useState, useEffect } from "react";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import "../../../styles/components/communitySection.css";
import { useNavigate } from "react-router-dom";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CommunityPreview = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // 📌 상대 시간 포맷 함수 (복붙한 부분)
  const formatRelativeDate = (date) => {
    const now = new Date();
    const parsedDate = new Date(date.replace(" ", "T"));
    const minutesAgo = differenceInMinutes(now, parsedDate);
    const hoursAgo = differenceInHours(now, parsedDate);
    const daysAgo = differenceInDays(now, parsedDate);

    if (minutesAgo < 60) {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
        // `${BASE_URL}/api/communities`, 
        "http://localhost:8088/api/communities",
        {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("커뮤니티 미리보기 데이터 로딩 실패", error);
      }
    };

    fetchData();
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <section className="community-preview">
      {/* 카드 형태 인기글 */}
      <div className="commu-card-row">
        {data.slice(0, 3).map((post) => (
          <div
            key={post.id}
            className="preview-card"
            onClick={() => navigate(`/communities/${post.id}`)}
          >
            <h4 className="preview-title">{post.title.slice(0, 6)}...</h4>
            <p className="preview-content">{post.content.slice(0, 10)}...</p>

            <div className="preview-meta">
              <span className="preview-author">by {post.nickname}</span>
              <span className="preview-date">
                {formatRelativeDate(post.update_date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 리스트 형태 게시글 */}
      <ul className="commu-post-list">
        {data.slice(3, 7).map((post) => (
          <li
            key={post.id}
            className="commu-post-item"
            onClick={() => navigate(`/communities/${post.id}`)}
          >
            <div className="commu-post-inline">
              <span className="commu-post-title">{post.title}</span>
              <span className="commu-post-meta">
                by {post.nickname} · {formatRelativeDate(post.update_date)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommunityPreview;
