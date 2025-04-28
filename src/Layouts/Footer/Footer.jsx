import React from "react";
import "../../styles/layouts/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>고객센터</h4>
          <p>
            웹 사용 중 겪은 문제, 서비스 이용 문의 등 무엇이든 도와드릴게요.
          </p>
          <p>빠르고 친절한 답변을 약속드립니다.</p>
          <button
            className="contact-btn naver"
            onClick={() => alert("아직 준비중이에요!")}
          >
            앱으로 이동하기
          </button>
          <p>운영시간: 월-금 10:00 - 18:00 (점심 12:00 - 13:00)</p>
          <p>(주말 및 공휴일 휴무)</p>
        </div>

        <div className="footer-section">
          <h4>공지사항</h4>
          <ul>
            <li>- 안전한 모임을 위한 수칙을 꼭 확인해주세요!</li>
            <li>- 후기 작성 가이드가 업데이트 되었어요.</li>
            <li>- [NEW] 산 정보 페이지가 새롭게 리뉴얼 되었습니다.</li>
            <li>- 버그 제보와 피드백은 언제나 환영이에요 :)</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>ABOUT 하이등산</h4>
          <p>
            (주)하이펜타M은 ‘안녕(Hi)’과 ‘높은(High)’, 5명의 팀원(Penta), 그리고
            마운틴(Mountain)을 의미합니다.
          </p>
          <p>
            우리는 "등산이 더 즐거워지는 방법"을 고민하는 등산 큐레이션 서비스를
            만들고 있어요.
          </p>
          <p>
            하이등산은 후기 게시판, 자유 커뮤니티, 모임 기능, 실시간 채팅, 산
            정보 페이지를 통해 등산을 즐기는 모든 이들을 하나로 연결합니다.
          </p>
          <p>
            커뮤니티와 후기 중심으로 등산 경험을 공유하며, 새로운 산 친구를
            만나고 정보를 나누는 공간이에요.
          </p>
          <p>
            더 많은 사람들이 가볍게 등산을 시작하고, 함께 오르며 소통할 수
            있도록 앞으로도 기능을 계속 확장해 나갈 예정입니다.
          </p>
        </div>

        <div className="footer-section">
          <h4>ABOUT 하이펜타M</h4>
          <p>(주)하이펜타M</p>
          <p>대표이사: 김승룡</p>
          <p>주소: 서울특별시 서초구 서초대로 77길 13 2층</p>
          <p>사업자 등록번호: 33-3333-3333</p>
          <p>고객문의: support@hipentaM.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2025 하이펜타M. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">파트너쉽</a>
          <a href="#">FAQ</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
