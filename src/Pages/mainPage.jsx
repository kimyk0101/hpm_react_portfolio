import { useEffect, useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import Header from "../layouts/Header/Header";
import ContentContainer from "../layouts/ContentContainer";
import DefaultSlider from "../components/slider/DefaultSlider";
import TrailCard from "../components/Cards/trail/TrailCard";
import CommunitySection from "../components/Cards/community/CommunitySection";
import ReviewSection from "../components/section/ReviewSection";
import MainHeaderImage from "./main/MainHeaderImage";
import ViewAllButton from "../layouts/Common/ViewAllButton";
import { Link } from "react-router-dom";
import "../styles/layouts/defaultLayout.css";
import "../styles/pages/mainPage.css";
import "../styles/components/stickyButton.css";
import "../styles/pages/mtRecommend.css";

const MainHome = () => {
  const [mountains, setMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mountains`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("✅ 산 목록 데이터:", data);
          setMountains(data);
        } else {
          const html = await response.text();
          console.error("❌ JSON이 아님! HTML 응답:", html);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("산 데이터 불러오기 실패:", error);
        setIsLoading(false);
      }
    };

    fetchMountains();
  }, []);

  return (
    <>
      <header className="header-container home-section">
        <ContentContainer>
          <Header
            title="하이펜타"
            showLogo={true}
            showIcons={{ search: true }}
          />
        </ContentContainer>
      </header>
      <MainHeaderImage />
      <DefaultLayout
        headerProps={{
          title: "하이펜타",
          showLogo: true,
          showIcons: { search: true },
        }}
      >
        <div className="trail-slider-container home-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "30px" }}>추천 산행 코스</h2>
            <Link
              to="/mountain-recommend"
              onClick={() => {
                // onClick 이벤트 핸들러 추가
                window.scrollTo(0, 0); // 스크롤을 맨 위로 이동
              }}
            >
              <button className="recommend-button">
                산을 추천해 드릴께요 !
              </button>
            </Link>
          </div>

          <DefaultSlider visibleCount={4} className="trail-slider">
            {!isLoading &&
              mountains
                .slice(0, 10)
                .map((mountain) => (
                  <TrailCard
                    key={mountain.id}
                    mountainId={mountain.id}
                    mountainName={mountain.name}
                  />
                ))}
          </DefaultSlider>
          <ViewAllButton to="/mountain/list" />
        </div>

        <div className="commu-section-full-bg home-section">
          <div className="commu-inner">
            <CommunitySection />
          </div>
        </div>
        {/* <div className="mountain-slider-container home-section">
          <h2>🥾 인기 등산 후기</h2>{" "}
          <DefaultSlider visibleCount={3}>
            {mtReviewData.map((mountain) => (
              <MtReviewCard
                key={mountain.id}
                mountainName={mountain.mountainName}
                title={mountain.title}
                content={mountain.content}
                courseName={mountain.courseName}
                level={mountain.level}
                author={mountain.author}
                date={mountain.date}
              />
            ))}
          </DefaultSlider>
        </div> */}
        <div className="review-section-container">
          <ReviewSection />
        </div>
        <div className="sticky-button">
          <Link to="/mountain/list_map" aria-label="산 목록 지도 보기">
            <img
              src="https://i.ibb.co/NdMHTgt2/icons8-100.png"
              alt="산 아이콘"
              title="산 지도 보기"
            />
          </Link>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MainHome;
