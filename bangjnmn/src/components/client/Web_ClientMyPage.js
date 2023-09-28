import React from "react";

const ClientMyPage = () => {
  const currentPath = window.location.pathname;
  const auth = localStorage.getItem("auth");

  return (
    <div>
      <h1>ClientMyPage</h1>
    </div>
  );
};

export default ClientMyPage;
