import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { dbService } from "../../api/fbase";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #204E4A;
`;

const Logo = styled.h1`
  color: #fff9f3;
  text-align: center;
  font-family: Roboto;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 41.667% */
  letter-spacing: 0.1px;
  width: 222px;
  height: 20px;
  top: 420px;
  left: 608px;
`;
const LoginButton = styled.button`
  display: flex;
  width: 314px;
  height: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 100px;
  background: #cecccc;
  top: 504px;
  left: 563px;

  color: #38373C;
  text-align: center;
  font-family: Roboto;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 50% */
  letter-spacing: 0.1px;
  padding-left: 24px;
  padding-right: 24px;
`;

const LogIn = () => {
  const [init, setInit] = useState(false);
  const [userData, setUserData] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

const handleGoogleLogin = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider(); // provider를 구글로 설정
  signInWithPopup(auth, provider) // popup을 이용한 signup
    .then(async (result) => {
      setInit(true);
      setUserData(result.user); // user data 설정
      setName(result.user.displayName);
      setEmail(result.user.email);
      setUid(result.user.uid);
      console.log("유저 ", result.user);

      // 이메일 도메인 확인
      checkEmailDomain(result.user.email);
      // checkNewUser(result.user.displayName);
    })
    .catch((error) => {
      console.error("Google 로그인 에러:", error);
    });
};

const checkEmailDomain = (email) => {
  const emailDomain = email.split('@')[1]; // 이메일 주소에서 도메인 추출

  if (emailDomain !== "handong.ac.kr") {
    console.log('handong.ac.kr 메일이 아님');
    alert("학교 메일 계정 (@handong.ac.kr)으로 로그인하세요.");
    navigate("/");
    }
  else {checkNewUser(name)};
  };
  
  const checkNewUser = async (displayName) => {
    if (!displayName) {
      console.log("displayName이 없습니다.");
      return;
    }
    const docRef = doc(dbService, "user", displayName);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { key: docSnap.data().access };
        const expirationTime = new Date().getTime() + 60 * 1000; // 현재 시간에서 1시간(3600초) 후의 시간을 계산

        // 데이터와 만료 시간을 객체로 저장
        const itemToStore = { data, expirationTime };

        // 로컬 스토리지에서 이전 데이터 가져오기
        const storedItem = JSON.parse(localStorage.getItem("accessData"));

        if (storedItem) {
          // 만료되지 않았으면 로컬 스토리지에 저장된 데이터를 사용하여 작업 수행
          if (new Date().getTime() < storedItem.expirationTime) {
            if (storedItem.data.key === "client") {
              navigate("/client");
              return; // 리다이렉트 후 함수 종료
            } else if (storedItem.data.key === "admin") {
              navigate("/admin");
              return; // 리다이렉트 후 함수 종료
            }
          } else {
            // 데이터가 만료된 경우 삭제
            localStorage.removeItem("accessData");
          }
        }

        // 새로운 데이터를 로컬 스토리지에 저장
        localStorage.setItem("accessData", JSON.stringify(itemToStore));

        console.log("기존 유저");
      } else {
        console.log("새로운 유저");
        navigate("/signup");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Div>
      <Logo>방주니마니</Logo>
      <LoginButton onClick={handleGoogleLogin}>login</LoginButton>
    </Div>
  );
};

export default LogIn;
