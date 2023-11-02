import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/fbase";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; 
  justify-content: center; 
  margin: -8px;
  width: Fixed (1,440px);
  overflow: hidden;
  display: flex;
  height: 30px;
  padding: 16px 80px;
  gap: 48px;

  border-bottom: 1px solid var(--cool-gray-20, #DDE1E6);
  background: #204E4A;
`;
const Home = styled.div`
width: 111px;
height: 20px;
font-family: Roboto;
font-size: 24px;
font-weight: 700;
line-height: 20px;
letter-spacing: 0.10000000149011612px;
text-align: center;
color: #fff9f3;
margin-right:532px;
margin-top:16px;
margin-bottom: 16px;
`
const Menu = styled.div`
/* width: Fixed (331px); */
height: Hug (48px);
gap: 16px;

//styleName: Other/Menu M;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: left;
color: #fff9f3;

`

// const Logout = styled.button`
// width: 105px;
// height: 40px;
// border-radius: 28px;
// border: 1px solid #DDE1E6;
// background-color: #CECCCC;
// font-family: Roboto;
// font-size: 16px;
// font-weight: 500;
// line-height: 16px;
// letter-spacing: 0.5px;
// color: #FFFFFF;
// text-align: center;

// padding: 0px, 16px, 0px, 16px;
// gap: 10px;
// `

const Logout = styled.button`
width: 105px;
height: 40px;
border-radius: 28px;
border: 1px solid #DDE1E6;
background-color: #CECCCC;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0.5px;
color: #FFFFFF;
text-align: center;

padding: 0px, 16px, 0px, 16px;
gap: 10px;
`
const Merong1 = styled.div`
width: 105px;
height: hug 40px;
cursor: pointer;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: center;
color: #fff9f3;
`
const Merong2 = styled.div`
width: 105px;
height: hug 40px;
cursor: pointer;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: center;
color: #fff9f3;
`
const Merong3 = styled.div`
width: 105px;
height: hug 40px;
cursor: pointer;
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: center;
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
        <Home onClick={moveToHome}>방주니마니</Home>
      {/* <Margin></Margin> */}
        <Menu onClick={moveToSurvey}>설문하기</Menu>
        <Menu onClick={moveToMeet}>면담 예약하기</Menu>
        <Menu onClick={moveToMyPage}>마이페이지</Menu>
        <Menu></Menu> <Menu></Menu>
          <Logout onClick={onLogOutClick}> 로그아웃</Logout>
    </Div>
  );
};

export default Web_clientNavBar;
