import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";

const ClientMyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  useState({
    phoneNumber: "",
  });

  useEffect(() => {
    const currentPath = window.location.pathname;

    // 실시간으로 계속해서 user의 정보를 읽어오는 과정
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Firebase Authentication에서 사용자 정보를 가져옴
        const displayName = user.displayName;

        // fetchData 함수 호출 시 displayName 전달
        const data = await fetchData(displayName);

        setUserData(data);

        console.log("로그인 함");
        console.log(user);

        if (
          localStorage.getItem("access") === "client" &&
          currentPath.includes("admin")
        ) {
          alert("접근할 수 없습니다.");
          navigate("/client");
        }
      } else {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    });
  }, [navigate]);

  const fetchData = async (displayName) => {
    try {
      const docRef = doc(dbService, "studentUser", displayName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        console.log("No such document!");
        return { message: "정보 없음" };
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return { message: "데이터 불러오기 실패" };
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormData({ phoneNumber: userData.phoneNumber }); // 전화번호 수정 모드 진입 시 기존 번호를 표시
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSave = async () => {
    // Firebase에 수정한 전화번호 정보 업데이트
    try {
      const docRef = doc(dbService, "studentUser", userData.displayName);
      const { phoneNumber } = formData; // 전화번호 값 가져오기
      await updateDoc(docRef, { phoneNumber });
      alert("전화번호 정보가 업데이트되었습니다.");
      setEditMode(false); // 수정 모드 종료
      setUserData((prevData) => ({
        ...prevData,
        phoneNumber: formData.phoneNumber, // 수정한 전화번호로 업데이트된 정보를 반영
      }));
    } catch (error) {
      console.error("전화번호 정보 업데이트 오류:", error);
      alert("전화번호 정보 업데이트에 실패했습니다.");
    }
  };

  const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    overflow: hidden;
  `;

  return (
    <div>
      <h1>ClientMyPage</h1>
      <div>담당 간사님: </div>
      <div>이름: {userData ? userData.name : "로딩 중..."}</div>
      <div>학번: {userData ? userData.stuNum : "로딩 중..."}</div>
      <div>이메일: {userData ? userData.email : "로딩 중..."}</div>
      <div>성별: {userData ? userData.gender : "로딩 중..."}</div>
      <div>학부: {userData ? userData.major : "로딩 중..."}</div>
      <div>
        전화번호: {editMode ? (
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
          />
        ) : (
          userData ? userData.phoneNumber : "로딩 중..."
        )}
        {editMode ? (
          <button onClick={handleSave}>저장</button>
        ) : (
          <button onClick={handleEdit}>수정</button>
        )}
      </div>
      <div>생년월일: {userData ? userData.birth : "로딩 중..."}</div>
      <div>RC: {userData ? userData.rc : "로딩 중..."}</div>
      <div>팀: {userData ? userData.team : "로딩 중..."}</div>
      <div>인실: {userData ? userData.roommateNum : "로딩 중..."}</div>
      <div>기숙사: {userData ? userData.dorm : "로딩 중..."}</div>
      <div>방호수: </div>
    </div>
  );
};

export default ClientMyPage;
