import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Div = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  gap: 10px;
`;

const Web_SelectMode = () => {
  const [init, setInit] = useState(false);
  const [userData, setUserData] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        const docRef = doc(dbService, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setInit(true);
      } else {
        setInit(false);
      }
    });
  }, []);

  function handleOnSubmit() {
    const docRef = setDoc(doc(dbService, "studentUser", "ysh"), {
      name: displayName,
      // email: email,
      // rc: rc,
    });
    if (docRef) {
      console.log("create firstStep에 저장 성공");
    }
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setInit(true);
      setUserData(result.user);
      setDisplayName(auth.currentUser.displayName);
      console.log(userData);
      console.log(auth.currentUser);
    });
  };

  return (
    <Div>
      <h1>Web_SelectMode</h1>
      <button onClick={handleGoogleLogin}>학생 로그인</button>
      <button onClick={handleGoogleLogin}>관리자 로그인</button>
      <button onClick={handleOnSubmit}>정보저장</button>
    </Div>
  );
};

export default Web_SelectMode;
