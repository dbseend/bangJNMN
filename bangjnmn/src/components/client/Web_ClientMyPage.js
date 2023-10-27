import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate, Prompt } from "react-router-dom";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";
import React from "react";
const ClientMyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "user", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUserData(stuSnap.data());
          }
          if (
            // client -> admin 접근 차단
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/client");
          } else if (
            // admin -> client 접근 차단
            localStorage.getItem("access") === "admin" &&
            currentPath.includes("client")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/admin");
          }
        } else {
          // 로그인 안 함
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };
    window.onbeforeunload = (e) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    checkStatus();
  }, [isModified]);

  const fetchData = async (displayName) => {
    try {
      const docRef = doc(dbService, "user", displayName);
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
    setPhoneNumber(userData ? userData.phoneNumber : ""); // 전화번호 수정 모드 진입 시 기존 번호를 표시
  };

  const handleFieldChange = (e) => {
    const newPhoneNumber = e.target.value;
    const phoneNumberPattern = /^010\d{4}\d{4}$/;

    setPhoneNumber(newPhoneNumber); // 입력 값을 항상 상태에 업데이트

    if (newPhoneNumber === "" || phoneNumberPattern.test(newPhoneNumber)) {
      // 조건을 만족하거나 빈 문자열일 경우 오류 메시지 초기화
      setErrorMessage("");
    } else {
      // 조건을 만족하지 않을 경우 오류 메시지 표시
      setErrorMessage("올바른 전화번호 형식이 아닙니다. (예: 01012345678)");
    }
  };

  const handleSave = async () => {
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      const docRef = doc(dbService, "user", userData.name);
      await updateDoc(docRef, { phoneNumber: phoneNumber });
      alert("전화번호 정보가 업데이트되었습니다.");
      setEditMode(false);
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

  const Button = styled.button`
    cursor: pointer;
  `;

  return (
    <div>
      <h1>ClientMyPage</h1>
      <div>담당 간사님: 최병호/김민정 간사님</div>
      <div>이름: {userData ? userData.name : "로딩 중..."}</div>
      <div>학번: {userData ? userData.stuNum : "로딩 중..."}</div>
      <div>이메일: {userData ? userData.email : "로딩 중..."}</div>
      <div>성별: {userData ? userData.gender : "로딩 중..."}</div>
      <div>학부: {userData ? userData.major : "로딩 중..."}</div>
      <div>
        전화번호:{" "}
        {editMode ? (
          <div>
            <input
              type="text"
              value={phoneNumber}
              onChange={handleFieldChange}
            />
            <span style={{ color: "red" }}>{errorMessage}</span>
          </div>
        ) : userData ? (
          userData.phoneNumber ? (
            userData.phoneNumber
          ) : (
            "전화번호 없음"
          )
        ) : (
          "로딩 중..."
        )}
        {editMode ? (
          <Button onClick={handleSave}>저장</Button>
        ) : (
          <Button onClick={handleEdit}>수정</Button>
        )}
      </div>
      <div>생년월일: {userData ? userData.birth : "로딩 중..."}</div>
      <div>
        RC: {userData && userData.rc ? userData.rc: "로딩 중..."}
      </div>
      <div>
        팀: {userData && userData.team ? userData.team : "로딩 중..."}
      </div>
      <div>인실: {userData ? userData.roommateNum : "로딩 중..."}</div>
      <div>기숙사: {userData ? userData.dorm : "로딩 중..."}</div>
      <div>방호수: </div>
    </div>
  );
};

export default ClientMyPage;
