import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import DefaultLayout from "../../../layouts/DefaultLayout";
import "../../../styles/pages/editProfile.css";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    birth: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const [showPasswordField, setShowPasswordField] = useState(false); // 💡 비밀번호 변경 토글

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        password: "",
        birth: user.birth || "",
        phone_number: user.phone_number?.replace(/[^0-9]/g, "") || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue =
      name === "phone_number" ? value.replace(/[^0-9]/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 전화번호 유효성 검사 (숫자만, 10~11자리)
    if (!formData.phone_number || !/^\d{10,11}$/.test(formData.phone_number)) {
      alert("전화번호는 10~11자리 숫자만 입력해야 합니다.");
      return;
    }

    // ✅ 이메일 유효성 검사
    if (
      !formData.email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      alert("올바른 이메일 형식을 입력하세요.");
      return;
    }

    const payload = {
      ...formData,
    };
    //  비밀번호 변경 버튼을 누르지 않거나
    //  눌렀지만 입력하지 않았을 때,
    //  서버에 전송할 password 필드 제거
    if (!showPasswordField || !formData.password) {
      delete payload.password;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("수정 실패");

      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("정보가 성공적으로 수정되었습니다.");
      navigate("/mypage");
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
          <div>
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>비밀번호</label>
            <button
              type="button"
              onClick={() => setShowPasswordField((prev) => !prev)}
              style={{ margin: "1rem 0" }}
            >
              {showPasswordField ? "비밀번호 변경 취소" : "비밀번호 변경"}
            </button>

            {showPasswordField && (
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="새 비밀번호 입력"
              />
            )}
          </div>

          <div>
            <label>생년월일</label>
            <input
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>전화번호</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>주소</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="edit-actions">
            <button type="submit">저장</button>
            <button type="button" onClick={() => navigate("/mypage")}>
              취소
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditProfile;
