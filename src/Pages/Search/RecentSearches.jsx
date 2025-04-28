import React from "react";

const RecentSearches = ({
  recentSearches,
  onClickKeyword,
  onDeleteKeyword,
}) => {
  return (
    <section className="recent-searches">
      <h3 className="section-title">최근 검색어</h3>
      {recentSearches.length > 0 ? (
        <div className="keyword-list">
          {recentSearches.map((word, index) => (
            <div key={index} className="keyword-chip">
              <span
                className="search-keyword"
                onClick={() => onClickKeyword(word)}
              >
                {word}
              </span>
              <button
                onClick={() => onDeleteKeyword(index)}
                className="delete-button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">최근 검색어가 없습니다.</p>
      )}
    </section>
  );
};

export default RecentSearches;
