const ResReviewHeader = ({ mountainName, author, date }) => (
  <div className="mt-review-header">
    <div className="header-top">
      <span className="mountain-icon">🏔</span>
      <span className="mountain-name">{mountainName}</span>
    </div>
    <div className="header-bottom">
      <span className="author">{author}</span>
      <span className="date">{date}</span>
    </div>
  </div>
);

export default ResReviewHeader;
