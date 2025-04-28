import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/createMountainReview.css";
import PhotoUploader from "../../components/photoUploader/PhotoUploader";

const CreateMountainReview = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 유지
  const [user, setUser] = useState([]); // 사용자 정보
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/mountain-reviews`;
  const [images, setImages] = useState([]);
  const photoUploaderRef = useRef();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/session`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const [mountains, setMountains] = useState([]); // 산 목록
  const [courses, setCourses] = useState([]); // 선택된 산의 코스 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMountain, setSelectedMountain] = useState(null); // 선택된 산
  const [selectedCourse, setSelectedCourse] = useState(null); // 선택된 코스
  const [searchMountain, setSearchMountain] = useState(""); // 산 검색
  const [searchCourse, setSearchCourse] = useState(""); // 코스 검색
  const [filteredMountains, setFilteredMountains] = useState([]); // 필터링된 산 목록
  const [filteredCourses, setFilteredCourses] = useState([]); // 필터링된 코스 목록

  // 산 목록 가져오기
  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mountains`);
        if (!response.ok) {
          throw new Error("네트워크 응답이 정상적이지 않습니다.");
        }
        const data = await response.json();
        setMountains(data);
        setFilteredMountains(data);
      } catch (error) {
        console.error("산 목록을 가져오는 데 오류가 발생했습니다.", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);

  // 산 검색 필터링
  useEffect(() => {
    setFilteredMountains(mountains.filter((m) => m.name));
  }, [searchMountain, mountains]);

  useEffect(() => {
    if (selectedMountain) {
      const fetchCourses = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/mountains/${selectedMountain.id}/courses`
          );
          if (!response.ok) {
            throw new Error("네트워크 응답이 정상적이지 않습니다.");
          }
          const data = await response.json();
          console.log("Fetched Courses:", data); // 받은 데이터 확인
          setCourses(data); // 코스 목록 설정
          setFilteredCourses(data); // 필터링된 코스 목록 설정
        } catch (error) {
          console.error("코스를 가져오는 데 오류가 발생했습니다.", error);
          setError(error.message);
        }
      };

      fetchCourses(); // 선택된 산에 맞는 코스 목록 가져오기
    }
  }, [selectedMountain]); // selectedMountain이 변경될 때마다 실행

  // 코스 검색 필터링
  useEffect(() => {
    setFilteredCourses(courses.filter((course) => course.courseName));
  }, [searchCourse, courses]);

  // 날짜를 "yyyy-MM-dd HH:mm:ss" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 초까지 포함된 형식
  };

  const [newPost, setNewPost] = useState({
    content: "",
    name: "",
    location: "",
    courseName: "",
    difficultyLevel: "",
    updateDate: new Date(),
    mountainsId: "",
    mountainCoursesId: "",
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인 후 사용 가능합니다");
      return;
    }

    const postData = {
      content: newPost.content,
      name: selectedMountain?.name,
      location: selectedMountain?.location,
      course_name: selectedCourse?.course_name,
      difficulty_level: selectedCourse?.difficulty_level,
      update_date: formatDate(newPost.updateDate),
      users_id: parseInt(user.id, 10),
      mountains_id: selectedMountain?.id,
      mountain_courses_id: selectedCourse?.id,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("새로 생성된 게시글 ID:", data.id);
        console.log("업로드할 이미지 수:", images.length);

        // 이미지 업로드
        if (images.length > 0) {
          const formData = new FormData();
          formData.append("reviewsId", data.id);

          const fileImages = images.filter((img) => img instanceof File);
          fileImages.forEach((img) => formData.append("photos", img));

          await fetch(`${BASE_URL}/api/mountain-reviews/photos/upload`, {
            method: "POST",
            body: formData,
          });
        }

        alert("게시글이 등록되었습니다");
        navigate("/mountain-reviews");
      } else {
        alert("게시글 등록 실패");
      }
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/mountain-reviews");
  };

  const textareaRef = useRef(null);

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "150px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newPost.content]);

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>
      <DefaultLayout>
        <div className="mReviewPage-create">
          <h2>새 게시물</h2>

          {isLoggedIn && (
            <form onSubmit={handlePostSubmit} className="m-post-form">
              <label>산 이름:</label>
              <input
                type="text"
                placeholder="산 이름 검색"
                value={searchMountain}
                onChange={(e) => setSearchMountain(e.target.value)}
                className="m-post-input"
              />
              <ul className="r-post-mountain-list">
                {filteredMountains.map((mountain) => (
                  <li
                    key={mountain.id}
                    className={`m-post-mountain-item ${
                      selectedMountain?.id === mountain.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedMountain(mountain);
                      setNewPost({
                        ...newPost,
                        mountainsId: mountain.id,
                        name: mountain.name,
                        location: mountain.location,
                        mountainCoursesId: "",
                        courseName: "",
                        difficultyLevel: "",
                      });
                      setSearchMountain(mountain.name);
                      setSearchCourse("");
                      setFilteredMountains([]);
                      setFilteredCourses([]);
                    }}
                  >
                    {mountain.name} ({mountain.location})
                  </li>
                ))}
              </ul>

              {selectedMountain && (
                <>
                  <label>등산 코스:</label>
                  <input
                    type="text"
                    placeholder="등산 코스 검색"
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                    className="m-post-input"
                  />
                  <ul className="m-post-course-list">
                    {filteredCourses.map((course) => (
                      <li
                        key={course.id}
                        className={`m-post-course-item ${
                          selectedCourse?.id === course.id ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedCourse(course);
                          setNewPost({
                            ...newPost,
                            mountainCoursesId: course.id,
                            courseName: course.course_name,
                            difficultyLevel: course.difficulty_level,
                          });
                          setSearchCourse(course.courseName);
                        }}
                      >
                        {course.courseName} ({course.difficultyLevel})
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <label>사진 등록:</label>
              <PhotoUploader
                ref={photoUploaderRef}
                onChange={setImages}
                className="m-photo-column-layout"
              />

              <label>게시글 내용:</label>
              <textarea
                className="m-post-content"
                value={newPost.content}
                ref={textareaRef}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="내용"
                required
              />

              <div className="m-post-button-container">
                <button
                  type="submit"
                  className="m-post-save"
                  data-text="게시글 등록"
                >
                  <span>게시글 등록</span>
                </button>
                <button
                  type="button"
                  className="m-post-cancel"
                  onClick={handleCancel}
                  data-text="취소"
                >
                  <span>취소</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default CreateMountainReview;
