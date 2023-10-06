import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {auth, dbService} from "../../api/fbase";
import { doc, getDoc } from "firebase/firestore";

const AdminHome = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "user", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUser(stuSnap.data());
          }
          if ( // client -> admin 접근 차단
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/client");
          } else if ( // admin -> client 접근 차단
            localStorage.getItem("access") === "admin" &&
            currentPath.includes("client")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/admin");
          }
        } else { // 로그인 안 함
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);
  return (
    <div>
      <h1>AdminHome</h1>
    </div>
  );
};

export default AdminHome;
