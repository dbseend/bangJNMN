import React, { useEffect } from "react";
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

const Web_clientNavBar = () => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    // 로그아웃
    auth.signOut();
    console.log("logout");
  };

  const moveToHome = () => {
    navigate("/client/home");
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
        <div onClick={moveToHome}>홈</div>
      <Margin></Margin>
        <div onClick={moveToSurvey}>Link to 로 설문하러 가자 ~</div>
      <Margin></Margin>
        <div onClick={moveToMeet}>Link to 로 면담예약하러 가자 ~</div>
      <Margin></Margin>
        <div onClick={moveToMyPage}>Link to 로 마이페이지 가자 ~</div>
      <Margin></Margin>
      <div onClick={onLogOutClick}> 로그아웃</div>
    </Div>
  );
};

export default Web_clientNavBar;
