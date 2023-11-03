import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/fbase";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding: 0;
  }
  `;
const Div = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: center;
  align-items: center; 
  overflow: hidden;
  display: flex;
  height: 30px;
  gap: 48px;
  height: 72px;
  background: #04589C;
  padding: 0 50px;
`;

const Home = styled.div`
height: 20px;
font-family: Roboto;
font-size: 24px;
font-weight: 700;
line-height: 20px;
letter-spacing: 0.10000000149011612px;
text-align: center;
color: #fff9f3;
/* margin-left:50px; */
margin-right:770px;
margin-top:16px;
margin-bottom: 16px;
cursor:pointer;
`
const Container = styled.div`
display: flex;
  gap: 16px;

`
const Menu = styled.div`
/* width: Fixed (331px); */
height: Hug (48px);
gap: 16px;
cursor: pointer;

font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
margin-right: 30px;
color: #fff9f3;

`

const Logout = styled.div`
height: Hug (48px);
gap: 16px;
cursor: pointer;

//styleName: Other/Menu M;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: left;
color: #fff9f3;
`
const Web_clientNavBar = () => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    // 로그아웃
    auth.signOut();
    console.log("logout");
    alert("로그아웃 되었습니다.");
  };

  const moveToHome = () => {
    navigate("/client/");
  };
  const moveToSurvey = () => {
    navigate("/client/survey");
  };
  const moveToMeet = () => {
    navigate("/client/meet");
  };
  const moveToMyPage = () => {
    navigate("/client/mypage");
  };
  return (
    <Div>
      <GlobalStyle/>
        <Home onClick={moveToHome}>방주니마니</Home>
        <Container>
        <Menu onClick={moveToSurvey}>설문하기</Menu>
        <Menu onClick={moveToMeet}>면담 예약하기</Menu>
        <Menu onClick={moveToMyPage}>마이페이지</Menu>
          <Logout onClick={onLogOutClick}> 로그아웃</Logout>
        </Container>
        
    </Div>
  );
};

export default Web_clientNavBar;
