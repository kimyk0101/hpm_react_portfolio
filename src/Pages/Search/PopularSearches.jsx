import React from "react";

const PopularSearches = ({ onClickKeyword }) => {
  const popularSearches = ["북한산", "지리산", "한라산", "설악산", "태백산"];

  return (
    <section className="popular-searches">
      <h3 className="section-title">인기 검색어</h3>
      <div className="keyword-list">
        {popularSearches.map((word, index) => (
          <div key={index} className="keyword-chip">
            <span
              className="search-keyword"
              onClick={() => onClickKeyword(word)}
            >
              {word}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularSearches;
