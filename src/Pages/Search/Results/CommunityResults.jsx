import React from "react";
import { Link } from "react-router-dom";
import { highlightKeyword } from "../../../utils/highlightKeyword";

const CommunityResults = ({ data, submittedQuery }) => {
  if (!data || data.length === 0) {
    return (
      <p className="no-result">
        “{submittedQuery}”과 관련된 검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <ul className="community-list">
      {data.map((item) => (
        <li key={item.id} className="community-item">
          <Link to={`/communities/${item.id}`} className="community-link">
            <div className="community-content-wrapper">
              {/* 왼쪽 영역 */}
              <div className="community-text">
                <h4 className="community-title">
                  {highlightKeyword(item.title, submittedQuery)}
                </h4>
                <p className="community-content">
                  {highlightKeyword(item.content, submittedQuery)}
                </p>
                <p className="community-author">작성자: {item.nickname}</p>
                <p className="community-meta">
                  {item.update_date?.slice(0, 10)} | 조회수 {item.views} | 댓글{" "}
                  {item.comment_count ?? 0}
                </p>
              </div>

              {/* 오른쪽 이미지 썸네일 */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="썸네일"
                  className="community-thumbnail"
                />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CommunityResults;
