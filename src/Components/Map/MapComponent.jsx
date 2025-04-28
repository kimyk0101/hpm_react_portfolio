import React, { useEffect, useRef } from "react";

const MapComponent = ({ lat, lng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API
    }&autoload=false`;
    document.head.appendChild(script);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const position = new window.kakao.maps.LatLng(lat, lng);
        const options = {
          center: position,
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
        });
        marker.setMap(map);
      });
    };

    script.addEventListener("load", onLoadKakaoAPI);

    return () => {
      script.removeEventListener("load", onLoadKakaoAPI);
    };
  }, [lat, lng]);

  return <div style={{ width: "100%", height: "400px" }} ref={mapRef}></div>;
};

export default MapComponent;
