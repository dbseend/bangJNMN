import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { dbService } from "../../api/fbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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
  background: #38373c;
`;


const Logo = styled.h1`
  color: #F26938;
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

`
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

  color: #f26938;
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
      checkNewUser(result.user.displayName);
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
    const auth = getAuth();
    //   const uiConfig = {
    //     callbacks: {
    //       signInSuccessWithAuthResult: (authResult) => {
    //         if (authResult.user.email.split('@')[1] !== "handong.ac.kr") {
    //           return false; // 로그인 실패로 처리하여 팝업을 닫는다.
    //         }
    //         return true; // 로그인 성공으로 처리
    //       },
    //     },
    //   };
    // const ui = new firebaseui.auth.AuthUI(auth);
    // ui.start('#firebaseui-auth-container', uiConfig);
  }
};

  const checkNewUser = async (displayName) => {
    const docRef = doc(dbService, "user", displayName);
    
    try {
      const docSnap = await getDoc(docRef);
      // const data = { key: docSnap.data().access };
      // const expirationTime = new Date().getTime() + 3600 * 1000;
      // const itemToStore = { data, expirationTime };
      localStorage.setItem("access", "client");
      // if (docSnap.exists()) {
      //   console.log("기존 유저");
      //   if (localStorage.getItem("access") === "client") {
      //     navigate("/client");
      //   } else if (localStorage.getItem("access") === "admin") {
      //     navigate("/admin");
      //   }
      // } else {
      //   console.log("새로운 유저");
      //   navigate("/signup");
      // }
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
