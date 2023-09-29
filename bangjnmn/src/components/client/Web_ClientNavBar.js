import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Web_clientNavBar = () => {
  const navigate = useNavigate();

  //navigate 예시
  const moveToMeet = () => {
    navigate("/client/meet");
  };

  return (
    <div>
      <h1>client navbar</h1>
      {/* Link to 사용 예시 */}
      <Link to="/client/meet">
        <h2>Link to 로 면담예약하러 가자 ~</h2>
      </Link>
      <h2 onClick={moveToMeet}>navigate 로 면담예약하러 가자 ~</h2>
    </div>
  );
};

export default Web_clientNavBar;
