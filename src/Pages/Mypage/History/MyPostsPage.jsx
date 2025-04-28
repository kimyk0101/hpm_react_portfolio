import { useSearchParams } from "react-router-dom";
import CommunityTab from "./Community/CommunityTab";
import MountainTab from "./Mountain/MountainTab";
import RestaurentTab from "./Restaurant/RestaurantTab";
import DefaultLayout from "../../../Layouts/DefaultLayout";
import Header from "../../../Layouts/Header/Header";
import ContentContainer from "../../../Layouts/ContentContainer";
import "../../../styles/pages/myPostsPage.css";

const MyPostsPage = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const renderTabContent = () => {
    switch (tab) {
      case "community":
        return <CommunityTab />;
      case "mountain":
        return <MountainTab />;
      case "restaurant":
        return <RestaurentTab />;
      default:
        return <p>잘못된 탭입니다.</p>;
    }
  };

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={true}
            showIcons={{ search: true }}
          />
        </ContentContainer>
      </header>
      <DefaultLayout
        headerProps={{
          showBack: true,
          title: "My",
          showIcons: { search: true },
        }}
      >
        <div className="mypage-posts-page">
          <h3>내 활동 내역</h3>
          <div className="tab-wrapper">{renderTabContent()}</div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MyPostsPage;
