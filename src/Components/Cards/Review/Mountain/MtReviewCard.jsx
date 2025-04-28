import MtReviewHeader from "./MtReviewHeader";
import MtReviewContent from "./MtReviewContent";
import MtReviewFooter from "./MtReviewFooter";
import "../../../../styles/components/mtReviewCard.css";

const MtReviewCard = ({
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
      <MtReviewHeader mountainName={mountainName} author={author} date={date} />
      <MtReviewContent title={title} content={content} />
      <MtReviewFooter courseName={courseName} level={level} />
    </div>
  );
};

export default MtReviewCard;
