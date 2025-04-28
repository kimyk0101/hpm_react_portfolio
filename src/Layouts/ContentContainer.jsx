//  전체 페이지 너비를 조절하는 레이아웃 컴포넌트

import React from "react";

const ContentContainer = ({ children }) => {
  return <div className="content-container">{children}</div>;
};

export default ContentContainer;
