import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";

const ClientMyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

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
      <div>이름: {userData ? userData.studentUser : "로딩 중..."}</div>
      <div>학번: {userData ? userData.stuNum : "로딩 중..."}</div>
      <div>이메일: {userData ? userData.email : "로딩 중..."}</div>
      <div>성별: {userData ? userData.gender : "로딩 중..."}</div>
      <div>학부: {userData ? userData.major : "로딩 중..."}</div>
      <div>전화번호: {userData ? userData.phoneNumber : "로딩 중..."}</div>
      <div>생년월일: {userData ? userData.birth : "로딩 중..."}</div>
      <div>RC: {userData ? userData.rc : "로딩 중..."}</div>
      <div>팀: {userData ? userData.team : "로딩 중..."}</div>
      <div>인실: {userData ? userData.roommateNum : "로딩 중..."}</div>
    </div>
  );
};

export default ClientMyPage;