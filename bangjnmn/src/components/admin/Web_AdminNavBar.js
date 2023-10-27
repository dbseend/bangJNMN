/*import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/fbase";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; 
  justify-content: center; 
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
`;
const Margin = styled.div`
  margin-right: 60px;
`

const Web_AdminNavBar = () => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    // 로그아웃
    auth.signOut();
    console.log("logout");
  };

  const moveToHome = () => {
    navigate("/admin/");
  };
  const moveToStudent = () => {
    navigate("/admin/students");
  };
  const moveToRoom = () => {
    navigate("/admin/room");
  };
  const moveToMeet = () => {
    navigate("/admin/meet");
  };


  return (
    <Div>
        <div onClick={moveToHome}>홈</div>
      <Margin></Margin>
        <div onClick={moveToStudent}>학생정보 조회 하자 ~</div>
      <Margin></Margin>
        <div onClick={moveToRoom}>기숙사 방배정 보자 ~</div>
      <Margin></Margin>
        <div onClick={moveToMeet}>면담 예약 하러 가자~</div>
      <Margin></Margin>
      <div onClick={onLogOutClick}> 로그아웃</div>
    </Div>
  );
};

export default Web_AdminNavBar;
*/

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
cursor: pointer;
`
const Menu = styled.div`
width: Fixed (331px);
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

cursor: pointer;
`

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
cursor: pointer;
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
    navigate("/admin/");
  };
  const moveToStudent = () => {
    navigate("/admin/search");
  };
  const moveToRoom = () => {
    navigate("/admin/room");
  };
  const moveToMeet = () => {
    navigate("/admin/meet");
  };
  return (
    <Div>
        <Home onClick={moveToHome}>방주니마니</Home>
      {/* <Margin></Margin> */}
        <Merong1 onClick={moveToStudent}>학생 조회</Merong1>
        <Merong2 onClick={moveToRoom}>방배정</Merong2>
        <Merong3 onClick={moveToMeet}>면담 관리</Merong3>
          <Logout onClick={onLogOutClick}> 로그아웃</Logout>
    </Div>
  );
};

export default Web_clientNavBar;
