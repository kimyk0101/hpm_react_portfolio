import { useState } from "react";
import CommunityPosts from "./CommunityPosts";
import CommunityComments from "./CommunityComments";

const CommunityTab = () => {
  const [subTab, setSubTab] = useState("posts");

  return (
    <div className="community-tab">
      <div className="sub-tab-buttons">
        <button
          className={subTab === "posts" ? "active" : ""}
          onClick={() => setSubTab("posts")}
        >
          내가 쓴 글
        </button>
        <button
          className={subTab === "comments" ? "active" : ""}
          onClick={() => setSubTab("comments")}
        >
          내가 쓴 댓글
        </button>
      </div>

      <div className="sub-tab-content">
        {subTab === "posts" ? <CommunityPosts /> : <CommunityComments />}
      </div>
    </div>
  );
};

export default CommunityTab;
