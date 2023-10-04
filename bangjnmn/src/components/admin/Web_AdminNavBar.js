import React, { useState, useEffect } from "react";
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
    navigate("/admin/home");
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
