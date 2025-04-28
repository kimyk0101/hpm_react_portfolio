import React, { useState, useEffect } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import SearchInput from "./SearchInput";
import RecentSearches from "./RecentSearches";
import PopularSearches from "./PopularSearches";
import CommunityResults from "./Results/CommunityResults";
import MountainResults from "./Results/MountainResults";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import "../../styles/pages/searchPage.css";

const SearchPage = () => {
  // 검색창에 입력되는 값
  const [query, setQuery] = useState("");
  // 실제로 검색을 실행할 키워드
  const [submittedQuery, setSubmittedQuery] = useState("");
  // 검색 여부 판단 (검색 전에는 최근/인기 검색어 표시, 검색 후에는 결과 표시)
  const [hasSearched, setHasSearched] = useState(false);
  // 현재 선택된 탭 (산 정보, 커뮤니티, 후기)
  const [activeTab, setActiveTab] = useState("mountain");
  // 탭별 검색 결과 저장
  const [results, setResults] = useState({
    mountain: [],
    community: [],
  });
  // 최근 검색어 목록
  const [recentSearches, setRecentSearches] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  //페이지가 처음 로드될 때 localStorage에서 최근 검색어 불러오기
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  // 검색어를 최근 검색어 목록에 추가하는 함수
  const updateRecentSearches = (newQuery) => {
    const updated = [
      newQuery,
      ...recentSearches.filter((q) => q !== newQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };
  // 검색 실행하는 함수
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      const [mountainRes, communityRes] = await Promise.all([
        fetch(`${BASE_URL}/api/mountains/search?keyword=${searchQuery}`),
        fetch(`${BASE_URL}/api/communities/search?q=${searchQuery}`),
      ]);

      if (!mountainRes.ok || !communityRes.ok)
        throw new Error("서버 응답 오류");

      const [mountainData, communityData] = await Promise.all([
        mountainRes.json(),
        communityRes.json(),
      ]);

      // 검색 결과 상태 업데이트
      setResults({
        mountain: mountainData, // 추후 API 연결 예정
        community: communityData,
      });

      // 검색 관련 상태 업데이트
      setHasSearched(true); // 검색 결과 렌더링
      setSubmittedQuery(searchQuery); // 검색 결과 메시지에 표시
      setQuery(searchQuery); // input 창에도 입력값 유지
      updateRecentSearches(searchQuery); // 최근 검색어 추가
      setActiveTab("mountain"); // 검색하면 산 정보 탭 기본 선택
    } catch (error) {
      console.error("검색 중 오류 발생", error);
    }
  };

  // 최근 검색어에서 특정 항목 삭제
  const handleDelete = (index) => {
    const updated = [...recentSearches];
    updated.splice(index, 1);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // 탭에 따라 결과 렌더링하는 함수
  const renderResultList = () => {
    const data = results[activeTab];
    if (!data || data.length === 0) {
      return (
        <p className="no-result">
          “{submittedQuery}”과 관련된 검색 결과가 없습니다.
        </p>
      );
    }

    if (activeTab === "community") {
      return <CommunityResults data={data} submittedQuery={submittedQuery} />;
    }
    if (activeTab === "mountain") {
      return <MountainResults data={data} submittedQuery={submittedQuery} />;
    }
    // if (activeTab === "review") {
    //   return <ReviewResults data={data} submittedQuery={submittedQuery} />;
    // }

    return null;
  };

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


      <DefaultLayout
        headerProps={{
          showBack: true,
          title: "검색",
        }}
      >
        <div className="search-page">
          <div className="search-breakout">
            <SearchInput
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          </div>

          {!hasSearched ? (
            <div className="search-info">
              <RecentSearches
                recentSearches={recentSearches}
                onClickKeyword={handleSearch}
                onDeleteKeyword={handleDelete}
              />
              <PopularSearches onClickKeyword={handleSearch} />
            </div>
          ) : (
            <div className="search-results-layout">
              {/* 사이드바 */}
              <aside className="search-sidebar">
                <button
                  onClick={() => setActiveTab("mountain")}
                  className={activeTab === "mountain" ? "active" : ""}
                >
                  산 정보
                </button>
                <button
                  onClick={() => setActiveTab("community")}
                  className={activeTab === "community" ? "active" : ""}
                >
                  커뮤니티
                </button>
              </aside>

              {/* 결과 영역 */}
              <div className="search-results-main">
                <div className="tab-content">{renderResultList()}</div>
              </div>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default SearchPage;
