import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Web_AdminNavBar = () => {
  const navigate = useNavigate();

  //navigate 예시
  const moveToRoom = () => {
    navigate("admin/room");
  };

  return (
    <div>
      <h1>admin navbar</h1>
      {/* Link to 사용 예시 */}
      <Link to="/admin/rome">
        <h2>Link to 로 방배정하러 가자 ~</h2>
      </Link>
      <h2 onClick={moveToRoom}>navigate 로 방배정하러 가자 ~</h2>
    </div>
  );
};

export default Web_AdminNavBar;
