import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";
import styled from "styled-components";
import main from "../../assets/img/mainImg.webp";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  height: calc(100vh - 72px); /* 화면 높이 - 네비게이션 바 높이 */
`;

const MainImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ClientHome = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  return (
    <Div>
      <GlobalStyle />
      <MainImg src={main} draggable="false" />
    </Div>
  );
};

export default ClientHome;
