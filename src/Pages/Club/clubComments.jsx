import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/pages/clubComments.css";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "react-modal";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";

const ClubComments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAuth();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const modalRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  // 필터링 관련 상태 추가
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("content"); // 기본 검색 타입은 '내용'

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/club-comments/clubs/${id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.message}`
          );
        }
        const data = await response.json();
        setComments(
          data.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
        );
      } catch (error) {
        console.error("공지사항 목록을 불러오는 중 오류 발생:", error);
        setError(
          `공지사항 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`
        );
      }
    };

    fetchComments();
    Modal.setAppElement("#root");
  }, [id]);

  const openModal = () => {
    setIsModalOpen(true);
    if (modalRef.current) {
      modalRef.current.focus();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  const handleChatEnter = () => {
    openChatModal();
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/club-comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newCommentContent,
          clubsId: id,
          usersId: user.id,
          updateDate: new Date(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const updatedCommentsResponse = await fetch(
        `${BASE_URL}/api/club-comments/clubs/${id}`
      );
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(
        updatedCommentsData.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        )
      );

      closeModal();
      setNewCommentContent("");
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error);
      setError(`공지사항 등록 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const openEditModal = (comment) => {
    if (user.id !== comment.usersId) {
      alert("작성자만 수정 가능합니다.");
      return;
    }

    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/club-comments/${editingCommentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedCommentContent,
            updateDate: new Date(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const updatedCommentsResponse = await fetch(
        `${BASE_URL}/api/club-comments/clubs/${id}`
      );
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(
        updatedCommentsData.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        )
      );

      closeEditModal();
      setEditingCommentId(null);
      setEditedCommentContent("");
    } catch (error) {
      console.error("공지사항 수정 중 오류 발생:", error);
      setError(`공지사항 수정 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const openDeleteModal = (commentId, usersId) => {
    if (user.id !== usersId) {
      alert("작성자만 삭제 가능합니다.");
      return;
    }

    setDeleteCommentId(commentId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteCommentId(null);
  };

  const confirmDeleteComment = async () => {
    if (deleteCommentId) {
      await handleDeleteComment(deleteCommentId);
      closeDeleteModal();
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/club-comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const updatedCommentsResponse = await fetch(
        `${BASE_URL}/api/club-comments/clubs/${id}`
      );
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(
        updatedCommentsData.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        )
      );
    } catch (error) {
      console.error("공지사항 삭제 중 오류 발생:", error);
      setError(`공지사항 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 필터링된 댓글 목록 반환하는 함수
  const filteredComments = comments.filter((comment) => {
    if (searchType === "content") {
      return comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === "nickname") {
      return comment.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // 페이지네이션 관련 함수 수정
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={false}
            showLogo={true}
            showIcons={{ search: true }}
            menuItems={[
              { label: "커뮤니티", onClick: () => navigate("/communities") },
              {
                label: "등산 후기",
                onClick: () => navigate("/hiking-reviews"),
              },
              {
                label: "맛집 후기",
                onClick: () => navigate("/restaurant-reviews"),
              },
              { label: "모임", onClick: () => navigate("/clubs") },
            ]}
          />
        </ContentContainer>
      </header>
      <br />
      <DefaultLayout>
        <div className="club-comments-container">
          <div className="club-comments-page">
            <div className="button-container">
              <button onClick={handleChatEnter} className="chat-button">
                채팅방 입장
              </button>
              <button onClick={openModal} className="add-comment-button">
                공지사항 등록
              </button>
            </div>

            <div className="page-header">
              <h2>공지사항</h2>
            </div>
            <br />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {comments.length > 0 ? (
              <>
                {/* 검색 필터 위치 변경 */}
                <div className="search-filter-container">
                  <div className="search-filter">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="content">내용</option>
                      <option value="nickname">작성자</option>
                    </select>
                    <input
                      type="text"
                      placeholder="검색어를 입력하세요"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h4>
                      등산 단톡방 입장 원하시는 분은 '해당 산 관리자' or
                      '총괄매니저' 님 에게 단톡방 초대 원한다는 메세지 하나만
                      남겨주세요 !
                    </h4>
                  </div>
                </div>
                <table className="comments-table">
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>내용</th>
                      <th>작성자</th>
                      <th>작성일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentComments.map((comment, index) => {
                      const date = new Date(comment.updateDate);
                      const formattedDate = date.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });
                      const formattedTime = date.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={comment.id}>
                          <td>
                            {comments.length - (indexOfFirstComment + index)}
                          </td>
                          <td>{comment.content}</td>
                          <td>{comment.nickname}</td>
                          <td>{`${formattedDate} ${formattedTime}`}</td>
                          <td>
                            <button onClick={() => openEditModal(comment)}>
                              수정
                            </button>
                            <button
                              onClick={() =>
                                openDeleteModal(comment.id, comment.usersId)
                              }
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* 페이지네이션 */}
                <div className="pagination">
                  {Array(Math.ceil(filteredComments.length / commentsPerPage))
                    .fill()
                    .map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <p>공지사항이 없습니다.</p>
            )}

            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="공지사항 등록 모달"
                ref={modalRef}
                className={{
                  base: "modal-content",
                  overlay: "modal-overlay",
                }}
              >
                <div className="modal-content">
                  <h2>공지사항 등록</h2>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="공지사항 내용을 입력하세요."
                  />
                  <div className="modal-buttons">
                    <button onClick={handleCommentSubmit}>등록</button>
                    <button onClick={closeModal}>취소</button>
                  </div>
                </div>
              </Modal>
            )}

            {isEditModalOpen && (
              <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="공지사항 수정 모달"
                ref={modalRef}
                className={{
                  base: "modal-content",
                  overlay: "modal-overlay",
                }}
              >
                <div className="modal-content">
                  <h2>공지사항 수정</h2>
                  <textarea
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    placeholder="공지사항 내용을 수정하세요."
                  />
                  <div className="modal-buttons">
                    <button onClick={handleUpdateComment}>저장</button>
                    <button onClick={closeEditModal}>취소</button>
                  </div>
                </div>
              </Modal>
            )}

            {isDeleteModalOpen && (
              <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="공지사항 삭제 확인 모달"
                ref={modalRef}
                className={{
                  base: "modal-content",
                  overlay: "modal-overlay",
                }}
              >
                <div className="modal-content">
                  <h2>공지사항 삭제 확인</h2>
                  <p>정말 삭제하시겠습니까?</p>
                  <div className="modal-buttons">
                    <button onClick={confirmDeleteComment}>예</button>
                    <button onClick={closeDeleteModal}>아니오</button>
                  </div>
                </div>
              </Modal>
            )}

            {isChatModalOpen && (
              <Modal
                isOpen={isChatModalOpen}
                onRequestClose={closeChatModal}
                contentLabel="채팅방 입장 모달"
                className={{
                  base: "modal-content",
                  overlay: "modal-overlay",
                }}
              >
                <div className="modal-content">
                  <h2>채팅방 입장</h2>
                  <p>채팅방에 입장하시겠습니까?</p>
                  <div className="modal-buttons">
                    <button onClick={() => navigate(`/chatSendbird/${id}`)}>
                      입장
                    </button>
                    <button onClick={closeChatModal}>취소</button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default ClubComments;
