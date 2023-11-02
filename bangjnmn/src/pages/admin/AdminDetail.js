import React from "react";
import Web_AdminNavBar from "../../components/admin/Web_AdminNavBar";
import User from "../../components/admin/search/Web_Index";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const AdminDetail = () => {
  return (
    <div>
      <GlobalStyle />
      <Web_AdminNavBar/>
      <User />
    </div>
  );
};

export default AdminDetail;
