import React from "react";

const CheckLogin = () => {
  const currentPath = window.location.pathname;

  const uid = localStorage.getItem("uid");
  const auth = localStorage.getItem("auth");

  if (uid) {
    if (auth == 0) {
      navigate("/admin");
    } else if (auth == 1) {
      navigate("/client");
    }
  } else {
    alert("로그인이 필요합니다");
    navigate("/");
  }
};
