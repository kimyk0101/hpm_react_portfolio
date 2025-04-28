import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import "../../../../styles/pages/myPostsPage.css"; // CSS가 여기 들어있다고 가정

const MountainPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/mountain-reviews/my/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("글 목록을 불러오지 못했습니다.");

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.id) fetchPosts();
  }, [user]);

  return (
    <div>
      {/* <h4>내가 쓴 등산 후기</h4> */}
      <ul className="review-list">
        {posts.map((post) => (
          <li
            key={post.id}
            className="review-item"
            onClick={() => navigate(`/mountain-reviews/`)}
          >
            <div className="review-content">
              <p className="review-text">{post.content}</p>
              <span className="review-date">
                {post.update_date?.slice(0, 10)}
              </span>
            </div>

            {post.imageUrl && (
              <div className="review-thumbnail">
                <img src={post.imageUrl} alt="후기 이미지" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MountainPosts;
