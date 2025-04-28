import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MountainResults = ({ data, submittedQuery }) => {
  const [images, setImages] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const mountain of data) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/mountains/${mountain.id}/image`
          );
          if (response.ok) {
            const imgData = await response.json();
            newImages[mountain.id] = imgData.imageUrl;
          }
        } catch (error) {
          console.error("이미지 불러오기 실패:", error);
        }
      }
      setImages(newImages);
    };

    if (data && data.length > 0) fetchImages();
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <p className="no-result">
        “{submittedQuery}”과 관련된 검색 결과가 없습니다.
      </p>
    );
  }
  return (
    <ul className="s-smountain-list">
      {data.map((item) => (
        <li key={item.id} className="s-mountain-item">
          <div className="s-mountain-item-content">
            <div className="mountain-thumbnail-wrapper">
              <img
                src={images[item.id]}
                alt={item.name}
                className="mountain-thumbnail"
              />
            </div>
            <div className="s-mountain-info">
              <h4 className="s-mountain-title">{item.name}</h4>
              <p className="mountain-meta">
                {item.height || "-"} | {item.location || "-"}
              </p>
              <p className="mountain-desc">
                {item.selection_reason || "설명이 없습니다."}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MountainResults;
