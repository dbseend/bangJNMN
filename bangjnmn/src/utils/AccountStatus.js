import React from "react";
import { auth } from "../api/fbase";

//로그인 상태(권한) 확인
export const onReadUserData = (navigate) => {
  const currentPath = window.location.pathname;

  auth.onAuthStateChanged(async (user) => {
    // 실시간으로 계속해서 user의 정보를 읽어오는 과정
    if (user) {
      console.log("로그인 함");
      // 로그인 상태
      if (
        localStorage.getItem("access") == "client" &&
        currentPath.includes("admin")
      ) {
        alert("접근할 수 없습니다.");
        navigate("/client");
      }
    } else {
      // 로그아웃 상태
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  });
};
