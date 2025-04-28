import { useState } from "react";
import MountainPosts from "./MountainPosts";
import MountainComments from "./MountainComments";

const MountainTab = () => {
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
        {subTab === "posts" ? <MountainPosts /> : <MountainComments />}
      </div>
    </div>
  );
};

export default MountainTab;
