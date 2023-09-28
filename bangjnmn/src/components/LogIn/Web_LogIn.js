import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useParams } from "react-router-dom";

const Div = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
`;

const LogIn = () => {
  const [init, setInit] = useState(false);
  const [userData, setUserData] = useState("");
  const [uid, setUid] = useState("");
  const [auth, setAuth] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(0);
  const [grade, setGrade] = useState(0);
  const [stuNum, setStuNum] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [birth, setBrith] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dormitory, setDormitory] = useState("");
  const [roomNumber, setRoomNumber] = useState(0);
  const { params } = useParams();
  const currentURL = window.location.href;
  const currentPath = window.location.pathname;
  console.log(currentPath);

  const majors = [
    "글로벌리더십학부",
    "국제어문학부",
    "경영경제학부",
    "법학부",
    "커뮤니케이션학부",
    "공간환경시스템공학부",
    "기계제어공학부",
    "콘텐츠융합디자인학부",
    "생명과학부",
    "전산전자공학부",
    "상담심리사회복지학부",
    "ICT창업학부",
    "창의융합교육원",
    "AI 융합교육원",
  ];

  const rcs = ["토레이", "손양원", "카이퍼", "열송학사", "장기려", "카마이클"];

  const handleGoogleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider(); // provider를 구글로 설정
    signInWithPopup(auth, provider) // popup을 이용한 signup
      .then(async (result) => {
        setInit(true);
        setUserData(result.user); // user data 설정
        setName(result.user.displayName);
        setEmail(result.user.email);
        setUid(result.user.uid);
        console.log("유저 ", result.user);
        checkNewUser(result.user.displayName);
      });
  };

  const checkNewUser = async (displayName) => {
    const docRef = doc(dbService, "studentUser", displayName);

    try {
      const docSnap = await getDoc(docRef); // await 키워드를 사용하여 문서 스냅샷을 기다립니다.

      if (docSnap.exists()) {
        console.log("기존 유저");
        // 메인페이지로 이동
      } else {
        console.log("새로운 유저");
        //회원가입 페이지로 이동
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeMajor = (e) => {
    setMajor(e.target.value);
    console.log(e.target.value);
  };

  //회원가입
  const signUp = (e) => {
    const docRef = setDoc(doc(dbService, "studentUser", name), {
      name: name,
      email: email,
      stuNum: stuNum,
      phoneNumber: phoneNumber,
      major: major,
      rc: rc,
      team: team,
    });
    if (docRef) {
      console.log("회원가입에 저장 성공");
    }
  };

  return (
    <Div>
      <h1>LogIn Page</h1>
      <button onClick={handleGoogleLogin}>로그인하기</button>
      <form>
        <p>이름: {name}</p>
        <p>이메일: {email}</p>
        <br />
        <label for="gender">성별</label>
        <input type="radio" name="gender" value="male" /> 남자
        <input type="radio" name="gender" value="female" /> 여자
        <br />
        <label for="grade">학년</label>
        <input type="radio" name="grade" value="grade1" /> 1학년
        <input type="radio" name="grade" value="grade2" /> 2학년
        <input type="radio" name="grade" value="grade3" /> 3학년
        <input type="radio" name="grade" value="grade4" /> 4학년
        <br />
        <label for="studentNumber">학번</label>
        <input type="text" name="studentNumber" />
        <br />
        <label for="major">학부</label>
        <select value={major} onChange={changeMajor}>
          {majors.map((majorOption) => (
            <option key={majorOption} value={majorOption}>
              {majorOption}
            </option>
          ))}
        </select>
        <br />
        <label for="phoneNumber">전화번호</label>
        <input type="text" name="phoneNumber" />
        <br />
        <label for="numberOfRoom">호인실</label>
        <input type="radio" name="numberOfRoom" value="room1" /> 1인실
        <input type="radio" name="numberOfRoom" value="room2" /> 2인실
        <input type="radio" name="numberOfRoom" value="room4" /> 4인실
        <br />
      </form>
      <button onClick={signUp}> 회원가입 </button>
      <h1>현재 URL 정보</h1>
      <p>경로: {currentPath}</p>
    </Div>
  );
};

export default LogIn;
