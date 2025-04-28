const ResReviewContent = ({ title, content }) => (
  <div className="mt-review-content">
    <h3 className="review-title">{title}</h3>
    <p className="review-body">
      {content.length > 80 ? content.slice(0, 80) + "..." : content}
    </p>
  </div>
);

export default ResReviewContent;
