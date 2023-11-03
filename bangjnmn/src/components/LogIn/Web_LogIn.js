import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { dbService } from "../../api/fbase";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import logo from "../../assets/img/realLogo.png";

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding: 0;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
  background: #f4f4f4;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: -40px;
`;
const LogoImg = styled.img`
  width: 84px;
  height: 88px;
  top: 869px;
  left: 804px;
`;

const Logo = styled.h1`
  display: flex;
  width: 222px;
  height: 46px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #38373c;
  text-align: center;
  font-family: Roboto;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 50% */
  letter-spacing: 0.1px;
  margin-top: 45px;
`;
const LoginButton = styled.button`
  width: 315px;
  height: 65px;
  top: 469px;
  left: 563px;
  border-radius: 100px;
  border: 1px;
  gap: 8px;
  border: 1px solid #000000;
  background: #ffffff;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
  margin-top: 39px;
`;

const SignupButton = styled.button`
  width: 315px;
  height: 65px;
  top: 469px;
  left: 563px;
  border-radius: 100px;
  border: 1px;
  gap: 8px;
  border: 1px solid #000000;
  background: #ffffff;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
  margin-top: 22px;
`;

const LogIn = () => {
  const [init, setInit] = useState(false);
  const [userData, setUserData] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const goToSignUp = async () => {
    navigate("/signUp");
  };
  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider(); // provider를 구글로 설정
      await signInWithPopup(auth, provider); // popup을 이용한 signup
      const user = auth.currentUser;
      setInit(true);
      setUserData(user); // user data 설정
      setName(user.displayName);
      setEmail(user.email);
      setUid(user.uid);
      console.log("유저 ", user);

      // 이메일 도메인 확인
      checkEmailDomain(user);
    } catch (error) {
      console.error("Google 로그인 에러:", error);
    }
  };

  const checkEmailDomain = (user) => {
    const emailDomain = user.email.split("@")[1]; // 이메일 주소에서 도메인 추출

    if (emailDomain !== "handong.ac.kr") {
      // 오버레이 레이어를 추가하여 메시지 표시
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";

      const message = document.createElement("div");
      message.textContent = "학교 메일 계정 (@handong.ac.kr)으로 로그인하세요.";
      message.style.backgroundColor = "#fff";
      message.style.padding = "20px";
      message.style.borderRadius = "8px";

      overlay.appendChild(message);
      document.body.appendChild(overlay);

      // 오버레이 레이어를 클릭하면 닫기
      overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
      });

      navigate("/");
    } else {
      checkNewUser(user.displayName);
    }
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
        console.log("기존 유저");

        const data = docSnap.data();
        if (data.access === "client") {
          navigate("/client");
        } else if (data.access === "admin") {
          navigate("/admin");
        }
        // const data = { key: docSnap.data().access };
        // const expirationTime = new Date().getTime() + 60 * 1000; // 현재 시간에서 1시간(3600초) 후의 시간을 계산

        // // 데이터와 만료 시간을 객체로 저장
        // const itemToStore = { data, expirationTime };

        // // 로컬 스토리지에서 이전 데이터 가져오기
        // const storedItem = JSON.parse(localStorage.getItem("accessData"));

        // if (storedItem) {
        //   // 만료되지 않았으면 로컬 스토리지에 저장된 데이터를 사용하여 작업 수행
        //   if (new Date().getTime() < storedItem.expirationTime) {
        //     if (storedItem.data.key === "client") {
        //       navigate("/client");
        //       return; // 리다이렉트 후 함수 종료
        //     } else if (storedItem.data.key === "admin") {
        //       navigate("/admin");
        //       return; // 리다이렉트 후 함수 종료
        //     }
        //   } else {
        //     // 데이터가 만료된 경우 삭제
        //     localStorage.removeItem("accessData");
        //   }
        // }

        // // 새로운 데이터를 로컬 스토리지에 저장
        // localStorage.setItem("accessData", JSON.stringify(itemToStore));
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
      <GlobalStyle />
      <LogoContainer>
        <LogoImg src={logo} />
        <Logo>방주니마니</Logo>
      </LogoContainer>

      <LoginButton onClick={handleGoogleLogin}>
        한동대 이메일로 로그인하기
      </LoginButton>
      <SignupButton onClick={goToSignUp}> 회원가입하기</SignupButton>
    </Div>
  );
};

export default LogIn;
