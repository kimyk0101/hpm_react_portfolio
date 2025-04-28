import React, { useRef, useEffect, useState } from "react";
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../styles/pages/map.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function MountainMap() {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [markerInfo, setMarkerInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mountains, setMountains] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAPS_API_KEY;

  useEffect(() => {
    fetch(`${BASE_URL}/api/mountains`)
      .then((response) => response.json())
      .then((data) => {
        setMountains(data);
        setIsLoaded(true);
      });

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=clusterer&autoload=false`; // 클러스터러 라이브러리 추가
    document.head.appendChild(script);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(
            37.041192752028714,
            127.47055598966082
          ),
          level: 13,
          minLevel: 5,
          maxLevel: 13, // 최대 줌 레벨 (확대 제한)
        };
        const map = new window.kakao.maps.Map(mapRef.current, options);

        const resizeObserver = new ResizeObserver(() => {
          map.relayout();
        });

        // 지도 컨테이너 관찰 시작
        if (mapRef.current) {
          resizeObserver.observe(mapRef.current);
        }

        // 지도 크기 재조정 (중요!)
        setTimeout(() => {
          map.relayout();
        }, 300);

        // 마커 클러스터러 생성
        const clusterer = new window.kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 10,
          calculator: [10, 30, 50], // 클러스터 분할 기준
          styles: [
            {
              width: "60px", // 클러스터 크기 증가
              height: "60px",
              background: "rgba(0, 128, 255, 0.8)", // 파란색 배경
              borderRadius: "30px", // 원형 모양
              color: "#ffffff", // 텍스트 색상
              textAlign: "center",
              lineHeight: "60px", // 텍스트 중앙 정렬
              fontSize: "16px", // 텍스트 크기 증가
              fontWeight: "bold", // 텍스트 굵게
              content: (count) => `${count}개`, // 표시 텍스트 (마커 개수)
            },
            {
              width: "80px",
              height: "80px",
              background: "rgba(255, 165, 0, 0.8)", // 주황색 배경
              borderRadius: "40px",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "80px",
              fontSize: "18px",
              fontWeight: "bold",
              content: (count) => `${count}개`,
            },
          ],
        });

        const markerImages = {
          default: "https://i.ibb.co/HThp8Wjh/icon-mountain.png",
        };

        const imageSize = new window.kakao.maps.Size(33, 33),
          imageOption = { offset: new window.kakao.maps.Point(18, 25) };

        const hoverImage = new window.kakao.maps.MarkerImage(
          "https://i.ibb.co/Fkz2GhR1/icons8-48.png", // hover 이미지 URL
          imageSize,
          imageOption
        );

        const markers = []; // 마커 배열
        const labels = []; // 라벨 배열

        if (isLoaded) {
          mountains.forEach((mountain, index) => {
            const markerImage = new window.kakao.maps.MarkerImage(
              markerImages.default,
              imageSize,
              imageOption
            );
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              image: markerImage,
            });

            markers.push(marker); // 마커 배열에 추가

            // 라벨 생성 (초기에는 숨김)
            const label = new window.kakao.maps.CustomOverlay({
              content: `<div class="custom-label">${mountain.name}</div>`,
              position: marker.getPosition(),
              yAnchor: -0.3,
              map: null, // 처음에 지도에 추가하지 않음
            });
            labels[index] = label;

            // 마커 클릭 이벤트 등록
            window.kakao.maps.event.addListener(marker, "click", function () {
              setMarkerInfo({
                title: mountain.name,
                latlng: new window.kakao.maps.LatLng(
                  mountain.latitude,
                  mountain.longitude
                ),
                content: mountain.description,
                height: mountain.height,
                location: mountain.location,
                selectionReason: mountain.selection_reason,
                image: "https://i.ibb.co/QZk1h2W/30x30.png",
              });
              setIsOpen(true);
              setSelectedMarker(marker); // 선택된 마커 저장
              marker.setImage(hoverImage); // 선택된 마커의 이미지를 호버 이미지로 변경
            });
          });

          // 초기 라벨 상태 설정 (추가)
          markers.forEach((marker, index) => {
            labels[index].setMap(map); // 모든 라벨을 초기 상태로 지도에 표시
          });

          // 클러스터링 이벤트 리스너 추가 (라벨 표시/숨김 처리)
          window.kakao.maps.event.addListener(
            clusterer,
            "clusterchanged", // 클러스터 상태 변경 시 트리거되는 이벤트로 수정
            function (clusters) {
              const clusteredMarkers = new Set();
              if (Array.isArray(clusters)) {
                clusters.forEach((cluster) =>
                  cluster.getMarkers().forEach((m) => clusteredMarkers.add(m))
                );
              }
              markers.forEach((marker, index) => {
                if (clusteredMarkers.has(marker)) {
                  labels[index].setMap(null); // 클러스터에 포함된 마커는 라벨 숨김
                } else {
                  labels[index].setMap(map); // 단독 마커는 라벨 표시
                }
              });
            }
          );

          clusterer.addMarkers(markers); // 클러스터러에 마커 추가

          // 초기 상태 강제 업데이트 (추가)
          // 없으면 축소/확대시 이상함
          const initialClusters = clusterer.getClusters() || []; // undefined 방지
          window.kakao.maps.event.trigger(
            clusterer,
            "clusterchanged",
            initialClusters
          );
        }
      });
    };

    script.addEventListener("load", onLoadKakaoAPI);

    return () => {
      script.removeEventListener("load", onLoadKakaoAPI);
    };
  }, [isLoaded]);

  return (
    <div className="map-container">
      <div className="map" style={{ position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
      {isOpen && markerInfo && (
        <div className={`info-box-bottom ${isOpen ? "open" : "closed"}`}>
          <div className="mountain-info">
            <h2 className="mountain-title">{markerInfo.title}</h2>
            <p className="mountain-location">위치: {markerInfo.location}</p>
            <p className="mountain-height">고도: {markerInfo.height}m</p>
            <p className="mountain-selection-reason">
              선정 이유: {markerInfo.selectionReason}
            </p>
          </div>
          <div className="button-group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="detail-button"
              onClick={async () => {
                const mountainName = markerInfo.title;
                try {
                  const response = await fetch(
                    `${BASE_URL}/api/mountains/name/${mountainName}`
                  );
                  const mountainId = await response.text();
                  if (mountainId) {
                    window.location.href = `/mountain/${mountainId}`;
                  } else {
                    console.error("산 ID가 없습니다.");
                  }
                } catch (error) {
                  console.error("산 ID 조회 실패:", error);
                }
              }}
            >
              상세보기
            </motion.button>
            {/* <button className="review-map-button">등산 후기</button> */}
            {/* 등산후기 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="review-button"
              onClick={() =>
                navigate("/mountain-reviews", {
                  state: { mountainName: markerInfo.title }, // 산 이름 전달
                })
              }
            >
              등산후기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              닫기
            </motion.button>
          </div>
        </div>
      )}
      <StickyButton
        className="no-style"
        showHome={true}
        showBack={true}
        showMap={false}
        showList={true}
        showScrollTop={false}
        showWrite={false}
        homePath="/"
        backPath="/previous"
        listPath="/mountain/list"
      />
    </div>
  );
}

export default MountainMap;
