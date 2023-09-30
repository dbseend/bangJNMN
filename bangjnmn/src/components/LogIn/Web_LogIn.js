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
  /* width: 100%; */
  overflow: hidden;
  background: #38373C; 
  width: 100vw; //화면 너비 만큼
  height: 100vh; /* 화면 높이 만큼 */
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

  color: #f26938;
  text-align: center;
  font-family: Roboto;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 50% */
  letter-spacing: 0.1px;
  margin-top: 40px;
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
        checkNewUser(result.user.displayName);
      });
  };

  const checkNewUser = async (displayName) => {
    const docRef = doc(dbService, "studentUser", displayName);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("기존 유저");
        if (localStorage.getItem("access") === "client") {
          navigate("/client");
        } else if (localStorage.getItem("access") === "admin") {
          navigate("/admin");
        }
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
