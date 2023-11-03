import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";
import styled from "styled-components";
import main from "../../assets/img/main.png";
import { createGlobalStyle } from "styled-components";

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
  overflow: hidden;
`;
const MainImg = styled.img`
  width: 1500px;
  height: 900px;
`;

const AdminHome = () => {
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

export default AdminHome;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { checkStatus } from "../../utils/CheckStatus";

// const AdminHome = () => {
//   const [user, setUser] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkStatus(setUser);
//   }, []);
//   return (
//     <div>
//       <h1>AdminHome</h1>
//     </div>
//   );
// };

// export default AdminHome;
