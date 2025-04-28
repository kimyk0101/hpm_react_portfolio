import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PreviewModal from "../../components/modal/PreviewModal";
import { FaEdit } from "react-icons/fa";

//  s3 버킷 주소
const BUCKET_URL = "https://highpentam.s3.ap-northeast-2.amazonaws.com";

const ProfileImage = () => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef();
  const menuRef = useRef();
  const selectedFileRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  //  유저 프로필 이미지 조회
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/users/photos/by-user/${user.id}`
        );
        const data = (await res.ok) ? await res.json() : null;

        if (data?.file_path) {
          setImageUrl(`${BUCKET_URL}/${data.file_path}?t=${Date.now()}`);
        } else {
          setImageUrl("/default-profile.jpg");
        }
      } catch (err) {
        console.error("사진 불러오기 실패:", err);
        setImageUrl("/default-profile.jpg");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchPhoto();
  }, [user]);

  // ✅ 외부 클릭 시 사진 업로드메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 파일 선택 시 미리보기
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setIsPreviewOpen(true);
    };
    reader.readAsDataURL(file);
    selectedFileRef.current = file;
  };

  // ✅ S3 Presigned URL 요청
  const getPresignedUrl = async (fileName) => {
    const res = await fetch(
      `${BASE_URL}/api/s3/presigned-url?fileName=${fileName}`
    );
    const url = await res.text();
    return url;
  };

  // ✅ S3 업로드
  const uploadToS3 = async (file) => {
    const presignedUrl = await getPresignedUrl(file.name);
    const res = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("S3 업로드 실패");
    const s3Path = presignedUrl.split("?")[0].replace(`${BUCKET_URL}/`, "");
    return s3Path;
  };

  // ✅ 업로드 확정 -> DB에 경로 저장
  const confirmUpload = async () => {
    const file = selectedFileRef.current;
    if (!file || !user?.id) return;

    try {
      const s3Path = await uploadToS3(file);

      const formData = new FormData();
      formData.append("usersId", user.id);
      formData.append("photo", file);

      const res = await fetch(`${BASE_URL}/api/users/photos/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setImageUrl(`${BUCKET_URL}/${s3Path}?t=${Date.now()}`);
        setIsPreviewOpen(false);
        setMenuOpen(false);
      }
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };

  // ✅ 삭제 요청
  const handleDelete = async () => {
    const confirm = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      const res = await fetch(`${BASE_URL}/api/users/photos/by-id/${user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImageUrl("/default-profile.jpg");
        alert("사진이 삭제되었습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="profile-wrapper">
      <div
        className="profile-img-container"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {!isLoading && (
          <img
            src={imageUrl}
            alt="프로필"
            className={`profile-img ${!isLoading ? "profile-img-loaded" : ""}`}
          />
        )}

        <div className="edit-menu-wrapper">
          <FaEdit className="edit-icon" />
          {menuOpen && (
            <div
              className="profile-menu"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => fileInputRef.current.click()}>
                프로필 사진 변경
              </button>
              <button onClick={handleDelete}>프로필 사진 삭제</button>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {isPreviewOpen && (
        <PreviewModal
          imageUrl={previewUrl}
          onConfirm={confirmUpload}
          onCancel={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileImage;
