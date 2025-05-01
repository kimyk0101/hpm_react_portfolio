import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import DefaultLayout from "../../../layouts/DefaultLayout";
import ReactSelect from "react-dropdown-select";
import "../../../styles/pages/editProfile.css";
import { Divide } from "lucide-react";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  ); // 최신 년도부터
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    phoneNumber: "",
    email: "",
    address: "",
    addressDetail: "",
  });

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    console.log("user 데이터:", user); // ✅ 추가
    if (user) {
      const birth = user.birth?.split("-") || ["", "", ""];
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        userId: user.user_id || "",
        password: "",
        birthYear: birth[0],
        birthMonth: birth[1],
        birthDay: birth[2],
        phoneNumber: user.phone_number?.replace(/[^0-9]/g, "") || "",
        email: user.email || "",
        address: user.address || "",
        addressDetail: user.addressDetail || "",
      });
    }
  }, [user]);

  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
  const [isUserNicknameAvailable, setIsUserNicknameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);

  //  닉네임 중복 확인
  const checkUserNicknameAvailability = async () => {
    // const requestUrl = `${BASE_URL}/api/users/check-user-nickname?nickname=${nickname}`;
    const requestUrl = `http://localhost:8088/api/users/check-user-nickname?nickname=${formData.nickname}`;
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

      if (isTaken) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert(`닉네임 중복 확인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  //  아이디 중복 확인
  const checkUserIdAvailability = async () => {
    // const requestUrl = `${BASE_URL}/api/users/check-user-id?userId=${formData.userId}`;
    const requestUrl = `http://localhost:8088/api/users/check-user-id?userId=${formData.userId}`;
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

  //  이메일 중복 확인
  const checkEmailAvailability = async () => {
    // const requestUrl = `${BASE_URL}/api/users/check-user-email?email=${formData.email}`;
    const requestUrl = `http://localhost:8088/api/users/check-user-email?email=${formData.email}`;
    console.log("이메일 중복 확인 요청 URL:", requestUrl);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.statusText} (상태 코드: ${response.status})`
        );
      }

      const isTaken = await response.json();
      setIsEmailAvailable(isTaken);

      if (isTaken) {
        alert("사용 가능한 이메일입니다.");
      } else {
        alert("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      alert(`이메일 중복 확인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue =
      name === "phone_number" ? value.replace(/[^0-9]/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  const handleDateChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordFields;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 비밀번호 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8088/api/users/${user.id}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(passwordFields),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText); // 서버가 보내준 에러 메시지를 그대로 alert로 띄우기
        return;
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordPopup(false);
    } catch (err) {
      console.error(err);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleAddressClick = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.roadAddress;
        if (data.jibunAddress) {
          fullAddress += ` (${data.jibunAddress})`;
        }
        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
        }));
      },
    }).open();
  };

  const handleAddressDetailChange = (e) => {
    setFormData((prev) => ({ ...prev, addressDetail: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phoneNumber) {
      if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
        alert("전화번호는 10~11자리 숫자만 입력해야 합니다.");
        return;
      }
    }

    if (formData.email) {
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
      ) {
        alert("올바른 이메일 형식을 입력하세요.");
        return;
      }
    }

    const { birthYear, birthMonth, birthDay } = formData;
    if (birthYear || birthMonth || birthDay) {
      // 하나라도 입력됐다면 모두 입력됐는지 확인
      if (!birthYear || !birthMonth || !birthDay) {
        alert("생년월일을 모두 선택해주세요.");
      } else {
        // 유효한 날짜인지 검사
        const isValidDate = !isNaN(
          new Date(
            `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
              birthDay
            ).padStart(2, "0")}`
          ).getTime()
        );
        if (!isValidDate) {
          alert("올바른 생년월일을 입력해주세요.");
        }
      }
    }

    const birth =
      formData.birthYear && formData.birthMonth && formData.birthDay
        ? `${formData.birthYear}-${String(formData.birthMonth).padStart(
            2,
            "0"
          )}-${String(formData.birthDay).padStart(2, "0")}`
        : null;

    const fullAddress = `${formData.address} ${formData.addressDetail}`;

    const phoneNumber = formData.phoneNumber?.trim();
    const payload = {
      name: formData.name,
      nickname: formData.nickname,
      user_id: formData.userId,
      birth,
      phone_number: !phoneNumber ? null : phoneNumber,
      email: formData.email,
      address: fullAddress,
    };

    try {
      const res = await fetch(`http://localhost:8088/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("수정 실패");

      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("정보가 성공적으로 수정되었습니다.");
      window.location.href = "/mypage";
    } catch (err) {
      console.error(err);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <DefaultLayout
      headerProps={{
        showBack: true,
        title: "정보 수정",
        showIcons: { search: true },
      }}
    >
      <div className="edit-profile">
        <h2>정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <label>
            이름 <span className="edit-form-required">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="edit-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>
            닉네임 <span className="edit-form-required">*</span>
          </label>
          <div className="nickname-check-wrapper">
            <input
              type="text"
              name="nickname"
              className="edit-input"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={checkUserNicknameAvailability}
              className="nickname-check-button"
            >
              중복 확인
            </button>
          </div>
          {isUserNicknameAvailable !== null && (
            <div
              style={{
                color: isUserNicknameAvailable ? "green" : "red",
                marginTop: "-15px",
                marginBottom: "15px",
              }}
            >
              {isUserNicknameAvailable ? "✅ 사용 가능" : "❌ 사용 불가"}
            </div>
          )}

          <label>
            아이디 <span className="edit-form-required">*</span>
          </label>
          <div className="id-check-wrapper">
            <input
              type="text"
              name="userId"
              className="edit-input"
              value={formData.userId}
              onChange={handleChange}
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
            <div
              style={{
                color: isUserIdAvailable ? "green" : "red",
                marginTop: "-15px",
                marginBottom: "15px",
              }}
            >
              {isUserIdAvailable ? "✅ 사용 가능" : "❌ 사용 불가"}
            </div>
          )}

          <label>
            비밀번호 <span className="edit-form-required">*</span>{" "}
          </label>
          <button
            type="button"
            onClick={() => setShowPasswordPopup(true)}
            style={{ margin: "1rem 0" }}
            className="edit-password-button"
          >
            비밀번호 변경
          </button>

          <label>
            이메일 <span className="edit-form-required">*</span>{" "}
          </label>
          <div className="email-check-wrapper">
            <input
              type="email"
              name="email"
              className="edit-input"
              value={formData.email}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={checkEmailAvailability}
              className="email-check-button"
            >
              중복 확인
            </button>
          </div>
          {isEmailAvailable !== null && (
            <div
              style={{
                color: isEmailAvailable ? "green" : "red",
                marginTop: "-15px",
                marginBottom: "15px",
              }}
            >
              {isEmailAvailable ? "✅ 사용 가능" : "❌ 사용 불가"}
            </div>
          )}

          <label>생년월일</label>
          <div className="birth-selects">
            <ReactSelect
              options={years.map((year) => ({ label: year, value: year }))}
              value={
                formData.birthYear
                  ? { label: formData.birthYear, value: formData.birthYear }
                  : null
              }
              onChange={(selected) =>
                handleDateChange("birthYear", selected?.value)
              }
              style={{ width: "100px", height: "40px", fontSize: "16px" }}
              placeholder="년"
            />
            <ReactSelect
              options={months.map((month) => ({
                label: month,
                value: month,
              }))}
              value={
                formData.birthMonth
                  ? { label: formData.birthMonth, value: formData.birthMonth }
                  : null
              }
              onChange={(selected) =>
                handleDateChange("birthMonth", selected?.value)
              }
              style={{ width: "65px", height: "40px", fontSize: "16px" }}
              placeholder="월"
            />
            <ReactSelect
              options={days.map((day) => ({ label: day, value: day }))}
              value={
                formData.birthDay
                  ? { label: formData.birthDay, value: formData.birthDay }
                  : null
              }
              onChange={(selected) =>
                handleDateChange("birthDay", selected?.value)
              }
              style={{ width: "65px", height: "40px", fontSize: "16px" }}
              placeholder="일"
            />
          </div>

          <label>전화번호</label>
          <input
            type="text"
            name="phoneNumber"
            className="edit-input"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <label>주소</label>
          <div className="address-wrapper">
            <input
              type="text"
              name="address"
              className="edit-input"
              value={formData.address}
              onClick={handleAddressClick}
              placeholder="주소 검색 클릭"
              readOnly
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, address: "" })}
              className="clear-address-button"
            >
              ❌
            </button>
          </div>
          
          <label>상세 주소</label>
          <input
            type="text"
            name="addressDetail"
            className="edit-input"
            value={formData.addressDetail}
            onChange={handleAddressDetailChange}
            placeholder="상세 주소 입력"
          />

          <div className="edit-actions">
            <button type="submit">저장</button>
            <button
              type="button"
              onClick={() => (window.location.href = "/mypage")}
            >
              취소
            </button>
          </div>
        </form>
        {/* 💡 비밀번호 팝업창 UI */}
        {showPasswordPopup && (
          <>
            <div
              className="edit-popup-backdrop"
              onClick={() => setShowPasswordPopup(false)}
            />
            <div className="edit-password-popup">
              <h3>비밀번호 변경</h3>
              <input
                type="password"
                name="currentPassword"
                placeholder="현재 비밀번호"
                value={passwordFields.currentPassword}
                onChange={handlePasswordFieldChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="새 비밀번호"
                value={passwordFields.newPassword}
                onChange={handlePasswordFieldChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="새 비밀번호 확인"
                value={passwordFields.confirmPassword}
                onChange={handlePasswordFieldChange}
              />
              <div className="edit-popup-buttons">
                <button
                  className="edit-popup-edit-button"
                  onClick={handlePasswordSubmit}
                >
                  비밀번호 변경
                </button>
                <button
                  className="edit-popup-cancel-button"
                  onClick={() => setShowPasswordPopup(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditProfile;
