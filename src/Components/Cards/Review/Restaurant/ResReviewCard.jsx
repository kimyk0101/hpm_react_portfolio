import ResReviewHeader from "./ResReviewHeader";
import ResReviewContent from "./ResReviewContent";
import ResReviewFooter from "./ResReviewFooter";
import "../../../../styles/components/mtReviewCard.css";

const ResReviewCard = ({
  mountainName,
  title,
  content,
  courseName,
  level,
  author,
  date,
}) => {
  return (
    <div className="mt-review-card">
      <ResReviewHeader
        mountainName={mountainName}
        author={author}
        date={date}
      />
      <ResReviewContent title={title} content={content} />
      <ResReviewFooter courseName={courseName} level={level} />
    </div>
  );
};

export default ResReviewCard;
