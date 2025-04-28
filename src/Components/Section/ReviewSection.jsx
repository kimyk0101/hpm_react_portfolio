import ReviewColumn from "./ReviewColumn";
import { GiMountainCave } from "react-icons/gi";
import "../../styles/components/reviewSection.css";

const ReviewSection = () => {
  return (
    <section className="review-split-section">
      <h2 className="review-section-title">
        생생한 후기와 다양한 소식을 만나보세요!
      </h2>

      <div className="review-columns">
        <ReviewColumn
          title="등산 후기"
          description="생생한 등산 경험을 공유해 보세요!"
          link="/mountain-reviews"
          image="/images/icon_animation_mount.gif"
        />
        <ReviewColumn
          title="맛집 후기"
          description="등산하고 찾아가는 나만의 맛집을 알려주세요."
          link="/restaurant-reviews"
          image="/images/icon_animation_eating.gif"
        />
      </div>
    </section>
  );
};

export default ReviewSection;
