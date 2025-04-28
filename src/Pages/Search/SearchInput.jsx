import { FiSearch } from "react-icons/fi";
import React from "react";

const SearchInput = ({ query, setQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="어느 산으로 떠나볼까요~?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="s-search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-input-clear-button"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-input-search-button">
          <FiSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
