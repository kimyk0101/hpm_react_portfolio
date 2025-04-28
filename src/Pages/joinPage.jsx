/*
 * 파일명: JoinPage.jsx
 * 작성자: 김경민
 * 작성일: 2025-03-25
 *
 * 설명:
 * - 사용자 회원가입 페이지
 * - 닉네임, 아이디, 비밀번호, 비밀번호 확인을 입력받는 기본 폼 제공
 * - 입력 완료 후 서버에 회원가입 요청 전송
 * - 회원가입 성공 시 로그인 페이지로 이동
 *
 * 수정자: 김연경
 * 수정내용:
 * - 아이디 및 닉네임 중복 체크 기능 추가 (API 연동 포함)
 * - 비밀번호 유효성 검사 및 조건에 따른 에러 메시지 출력
 * - 툴팁을 이용한 입력 가이드 제공
 * - 비밀번호 보기 toggle 기능 구현 (아이콘 클릭 시 가시성 변경)
 * - CapsLock 입력 시 사용자에게 알림 표시
 * - 전반적인 UX 개선 및 입력 유효성 검사 디테일 보완
 * 수정일: 2025-03-25 ~ 03-27
 *
 * 관련 파일 구조:
 * ├─ Login.jsx                   // 로그인 페이지
 * └─ AuthContext.jsx             // 로그인 상태, 유저 정보등을 공유하는 전역 상태 관리 컴포넌트
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-dropdown-select"; // ReactSelect 임포트
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ContentContainer from "../layouts/ContentContainer";
import Header from "../layouts/Header/Header";
import DefaultLayout from "../layouts/DefaultLayout";
import "../styles/pages/joinPage.css";

const JoinPage = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_USER_URL = `${BASE_URL}/api/users`;

  const [allUserData, setAllUserData] = useState([]);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
  const [isUserNicknameAvailable, setIsUserNicknameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [passwordColor, setPasswordColor] = useState("black"); // 기본 색상은 black

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    phoneNumber: "",
    email: "",
    address: "",
    addressDetail: "", // 상세 주소
    updateDate: new Date().toISOString(), // 현재 날짜로 초기화
  });

  useEffect(() => {
    // 회원 정보 불러오기
    fetch(API_USER_URL)
      .then((response) => response.json())
      .then((data) => {
        setAllUserData(data);
      })
      .catch((error) => console.error("회원 정보 불러오기 오류", error));
  }, []);

  //  닉네임 중복 확인
  const checkUserNicknameAvailability = async (nickname) => {
    const requestUrl = `${BASE_URL}/api/users/check-user-nickname?nickname=${nickname}`;
    console.log("닉네임 중복 확인 요청 URL:", requestUrl);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.statusText} (상태 코드: ${response.status})`
        );
      }

      const isTaken = await response.json();
      setIsUserNicknameAvailable(isTaken);
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      setIsUserNicknameAvailable(false); // 오류 발생 시 "사용 불가"
    }
  };

  //  아이디 중복 확인
  const checkUserIdAvailability = async () => {
    const requestUrl = `${BASE_URL}/api/users/check-user-id?userId=${formData.userId}`;
    console.log("아이디 중복 확인 요청 URL:", requestUrl);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.statusText} (상태 코드: ${response.status})`
        );
      }

      const isTaken = await response.json();
      setIsUserIdAvailable(isTaken);

      if (isTaken) {
        alert("사용 가능한 아이디입니다.");
      } else {
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      alert(`아이디 중복 확인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      password,
    }));

    // 비밀번호 강도 체크
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordRegex.test(password)) {
      // 비밀번호가 영문, 숫자, 특수문자를 포함한 경우 강도 평가
      if (password.length >= 16) {
        setPasswordStrength("보안성 : 높음");
        setPasswordColor("blue");
      } else if (password.length >= 12) {
        setPasswordStrength("보안성 : 보통");
        setPasswordColor("green");
      } else if (password.length >= 8) {
        setPasswordStrength("보안성 : 낮음");
        setPasswordColor("red");
      }
    } else {
      setPasswordStrength(
        "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
      );
      setPasswordColor("black"); // 기본 색상
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;

    // 비밀번호 확인 필드에서 입력되는 값 그대로 처리하도록 개선
    setFormData((prevState) => ({
      ...prevState,
      confirmPassword,
    }));
  };

  useEffect(() => {
    // 비밀번호와 비밀번호 확인 란이 모두 입력된 경우에만 일치 여부 확인
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(null); // 비어 있을 경우 일치 여부를 표시하지 않음
    }
  }, [formData.password, formData.confirmPassword]);

  //  비밀번호 표시 기능
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  // Caps Lock 감지 함수
  const handleKeyDownPassword = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  // 입력 칸에서 포커스 벗어나면 Caps Lock 상태 초기화
  const handleBlurPassword = () => {
    setCapsLockOn(false);
  };

  //  생년월일 입력칸 날짜 지정
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // 유효성 검사
  const validateFormData = () => {
    const errors = [];

    // 필수 값 검사
    const nameError = validateField(
      "name",
      formData.name,
      null,
      "이름을 입력하세요."
    );
    if (nameError) errors.push(nameError);

    // 닉네임 유효성 검사
    const nicknameError = validateField(
      "nickname",
      formData.nickname,
      /^[a-zA-Z0-9]{2,10}$/,
      "닉네임은 2~10자 영문, 숫자 조합으로 입력하세요."
    );
    if (nicknameError) errors.push(nicknameError);

    // 아이디 유효성 검사
    const userIdError = validateField(
      "userId",
      formData.userId,
      /^[a-zA-Z0-9]{6,20}$/,
      "아이디는 6~20자 영문, 숫자 조합으로 입력하세요."
    );
    if (userIdError) errors.push(userIdError);

    // 비밀번호 유효성 검사
    const passwordError = validateField(
      "password",
      formData.password,
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "비밀번호는 8~20자 영문, 숫자, 특수문자 조합으로 입력하세요."
    );
    if (passwordError) errors.push(passwordError);

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      errors.push("비밀번호 확인을 입력하세요.");
    } else if (formData.password !== formData.confirmPassword) {
      errors.push("비밀번호가 일치하지 않습니다.");
    }

    // 전화번호 유효성 검사
    const phoneNumberError = validateField(
      "phoneNumber",
      formData.phoneNumber,
      /^\d{10,11}$/,
      "전화번호는 10~11자리 숫자만 입력해야 합니다."
    );
    if (phoneNumberError) errors.push(phoneNumberError);

    // 이메일 유효성 검사
    const emailError = validateField(
      "email",
      formData.email,
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "올바른 이메일 형식을 입력하세요."
    );
    if (emailError) errors.push(emailError);

    // 생년월일 검사 (포함)
    const { birthYear, birthMonth, birthDay } = formData;
    if (!birthYear || !birthMonth || !birthDay) {
      errors.push("생년월일을 모두 선택해주세요.");
    } else {
      // 연, 월, 일이 올바른지 검사
      const isValidDate = !isNaN(
        new Date(
          `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
            birthDay
          ).padStart(2, "0")}` // YYYY-MM-DD 형식으로 변환
        ).getTime()
      );

      if (!isValidDate) {
        errors.push("올바른 생년월일을 입력해주세요.");
      }
    }

    // 주소 유효성 검사
    if (formData.address && formData.address.length < 5) {
      errors.push("주소는 최소 5자 이상 입력해야 합니다.");
    }

    // 오류가 있을 경우 알림 표시
    if (errors.length > 0) {
      alert(errors.join("\n")); // 모든 오류 메시지를 한 번에 출력
      return false;
    }

    return true; // 모든 유효성 검사를 통과하면 true 반환
  };

  // validateField 함수 정의 (수정된 버전)
  const validateField = (fieldName, value, regex, errorMessage) => {
    // 값이 비어 있는지 체크 (하지만 지운 경우에는 알림을 띄우지 않도록)
    if (value === "") {
      return null; // 빈 값일 때는 유효성 검사 실패 처리를 하지 않음
    }

    // 값이 비어 있지 않으면 정규식 검증
    if (regex && !regex.test(value)) {
      return errorMessage;
    }

    return null; // 유효성 검사를 통과하면 null 반환
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateFormData()) return;

    // 중복 확인
    if (isUserIdAvailable === false) {
      alert("아이디 중복 확인이 필요합니다.");
      return;
    }
    if (isUserNicknameAvailable === false) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    // 생년월일 체크
    const { birthYear, birthMonth, birthDay } = formData;

    // 생년월일을 YYYY-MM-DD 형식으로 변환
    const birth =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
            birthDay
          ).padStart(2, "0")}`
        : null;

    // 주소 결합 (기본 주소 + 상세 주소)
    const fullAddress = `${formData.address} ${formData.addressDetail}`;

    // 전송할 데이터 필터링
    const {
      userId,
      phoneNumber,
      updateDate,
      ...formDataToSend
    } = formData;

    const formDataToSendWithBirthAndAddress = {
      ...formDataToSend,
      birth,
      user_id: userId,
      phone_number: phoneNumber,
      update_date: updateDate,
      address: fullAddress,
    };

    try {
      const response = await fetch(API_USER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSendWithBirthAndAddress),
      });

      if (response.ok) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        setTimeout(() => navigate("/login"), 500);
      } else {
        const errorMessage = await response.text();
        alert(`회원가입 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 회원가입시 : 주소 입력칸 누르면 -> 주소api 불러오기기
  const handleAddressClick = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.roadAddress; // 도로명 주소
        if (data.jibunAddress) {
          fullAddress += ` (${data.jibunAddress})`; // 지번 주소 추가
        }

        setFormData((prevState) => ({
          ...prevState,
          address: fullAddress, // 기본 주소에 설정
        }));
      },
    }).open();
  };

  // 상세 주소 변경 시 처리
  const handleAddressDetailChange = (e) => {
    setFormData({
      ...formData,
      addressDetail: e.target.value, // 상세 주소 입력 처리
    });
  };

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
      
      <DefaultLayout>
        <div className="login-body">
          <div className="join-container">
            <div className="join-left">
              <div className="join-left-overlay">
                <p className="signup-login-text">로그인 하시겠습니까?</p>
                <button
                  className="signup-login-button"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </button>
              </div>
            </div>
            <div className="join-right">
              <h2 className="join-title">회원가입</h2>

              <form className="join-form" onSubmit={handleSignup}>
                <label>
                  이름 <span className="join-form-required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <label>
                  닉네임 <span className="join-form-required">*</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  className="form-input"
                  placeholder="2~10자 문자, 숫자 조합으로 입력하세요"
                  value={formData.nickname}
                  onChange={(e) => {
                    setFormData({ ...formData, nickname: e.target.value });
                    checkUserNicknameAvailability(e.target.value); // 입력할 때마다 중복 체크
                  }}
                  required
                />
                {isUserNicknameAvailable !== null && (
                  <span
                    style={{ color: isUserNicknameAvailable ? "green" : "red" }}
                  >
                    {isUserNicknameAvailable ? "✅ 사용 가능" : "❌ 사용 불가"}
                  </span>
                )}
                <label>
                  아이디 <span className="join-form-required">*</span>
                </label>
                <div className="id-check-wrapper">
                  <input
                    type="text"
                    name="userId"
                    className="form-input"
                    placeholder="6~20자 영문, 숫자 조합으로 입력하세요"
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={checkUserIdAvailability}
                    className="id-check-button"
                  >
                    중복 확인
                  </button>
                </div>
                {isUserIdAvailable !== null && (
                  <span style={{ color: isUserIdAvailable ? "green" : "red" }}>
                    {isUserIdAvailable ? "✅ 사용 가능" : "❌ 사용 불가"}
                  </span>
                )}
                <label>
                  비밀번호 <span className="join-form-required">*</span>
                </label>
                <div className="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="form-input"
                    placeholder="8~20자 영문, 숫자, 특수문자 조합으로 입력하세요"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDownPassword}
                    onBlur={handleBlurPassword}
                    autoComplete="off"
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </span>
                  {capsLockOn && (
                    <div className="tooltip-caps-lock-on tooltip-visible">
                      ⚠️ Caps Lock이 켜져 있습니다.
                    </div>
                  )}
                </div>
                {passwordStrength && (
                  <span style={{ color: passwordColor }}>
                    {passwordStrength}
                  </span>
                )}
                <label>
                  비밀번호 확인 <span className="join-form-required">*</span>
                </label>
                <div className="password-container">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className="form-input"
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete="off"
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {passwordMatch !== null && (
                  <span style={{ color: passwordMatch ? "green" : "red" }}>
                    {passwordMatch ? "✅ 비밀번호 일치" : "❌ 비밀번호 불일치"}
                  </span>
                )}
                <label>생년월일</label>
                <div className="birth-select">
                  <ReactSelect
                    options={years.map((year) => ({
                      label: year,
                      value: year,
                    }))}
                    value={{
                      label: formData.birthYear,
                      value: formData.birthYear,
                    }}
                    onChange={(selected) =>
                      handleDateChange("birthYear", selected[0]?.value)
                    }
                    style={{ width: "80px", height: "40px", fontSize: "16px" }}
                    placeholder="년"
                  />
                  <ReactSelect
                    options={months.map((month) => ({
                      label: month,
                      value: month,
                    }))}
                    value={{
                      label: formData.birthMonth,
                      value: formData.birthMonth,
                    }}
                    onChange={(selected) =>
                      handleDateChange("birthMonth", selected[0]?.value)
                    }
                    style={{ width: "55px", height: "40px", fontSize: "16px" }}
                    placeholder="월"
                  />
                  <ReactSelect
                    options={days.map((day) => ({ label: day, value: day }))}
                    value={{
                      label: formData.birthDay,
                      value: formData.birthDay,
                    }}
                    onChange={(selected) =>
                      handleDateChange("birthDay", selected[0]?.value)
                    }
                    style={{ width: "55px", height: "40px", fontSize: "16px" }}
                    placeholder="일"
                  />
                </div>
                <label>전화번호</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="-를 제외한 숫자만 입력하세요"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
                <label>이메일</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <label>주소</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="주소를 입력하세요"
                  value={formData.address}
                  onClick={handleAddressClick} // 클릭 시 주소 검색 실행
                  readOnly // 직접 입력 방지
                />
                <label>상세 주소</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="상세 주소를 입력하세요"
                  value={formData.addressDetail}
                  onChange={handleAddressDetailChange} // 상세 주소 입력 시 처리
                />
                <button
                  type="submit"
                  className="join-submit-button"
                  data-text="가입하기"
                >
                  <span>가입하기</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default JoinPage;
