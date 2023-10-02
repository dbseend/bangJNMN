import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";

const ClientMyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "studentUser", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUserData(stuSnap.data());
            setPhoneNumber(stuSnap.data().phoneNumber);
          }
          if (
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            console.log("접근할 수 없습니다.");
            navigate("/client");
          }
        } else {
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);

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
    setPhoneNumber({ phoneNumber: userData.phoneNumber }); // 전화번호 수정 모드 진입 시 기존 번호를 표시
  };

  const handleFieldChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSave = async () => {
    console.log(userData.name);
    try {
      const docRef = doc(dbService, "studentUser", userData.name);
      await updateDoc(docRef, { phoneNumber: phoneNumber });
      alert("전화번호 정보가 업데이트되었습니다.");
      setEditMode(false); // 수정 모드 종료
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
        전화번호:{" "}
        {editMode ? (
          <input
            type="text"
            value={phoneNumber}
            onChange={handleFieldChange}
          />
        ) : userData ? (
          userData.phoneNumber
        ) : (
          "로딩 중..."
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
