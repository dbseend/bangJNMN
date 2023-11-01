import React from "react";
import Web_clientNavBar from "../../components/client/Web_ClientNavBar";
import Web_ClientSurvey from "../../components/client/Web_ClientSurvey";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
body{
margin:0;
padding:0;
}
`;

const ClientSurvey = () => {
  return (
    <div>
      <GlobalStyle />
      <Web_clientNavBar />
      <Web_ClientSurvey />
    </div>
  );
};

export default ClientSurvey;
