import React, { useState } from "react";
import Web_AdminNavBar from "../../components/admin/Web_AdminNavBar";
import Web_AdminSearch from "../../components/admin/search/Web_AdminSearch";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const AdminSearch = () => {
  return (
    <div>
      <GlobalStyle />
      <Web_AdminNavBar />
      <Web_AdminSearch />
    </div>
  );
};

export default AdminSearch;
