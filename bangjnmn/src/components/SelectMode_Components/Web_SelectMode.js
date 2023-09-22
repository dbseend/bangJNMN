import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Div = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  gap: 10px;
`;

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Web_SelectMode = () => {
  const [init, setInit] = useState(false);
  const [userData, setUserData] = useState("");
  const [uid, setUid] = useState("");
  const [displayName, setDisplayName] = useState(""); //이름
  const [email, setEmail] = useState(""); //이메일
  const [studentId, setStudentId] = useState(""); //학번
  const [phoneNumber, setPhoneNumber] = useState(""); //전화번호
  const [major, setMajor] = useState(""); //전공
  const [rc, setRc] = useState(""); //RC
  const [team, setTeam] = useState(""); //팀
  const navigate = useNavigate();

  //페이지 새로 고침 시 로그인 상태 확인
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

  //로그인
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setInit(true);
      setUserData(auth.currentUser);
      setUid(auth.currentUser.displayName.uid);
      setDisplayName(auth.currentUser.displayName);
      setEmail(auth.currentUser.email);
    });
  };

  //회원가입
  const signUp = (e) => {
    const docRef = setDoc(doc(dbService, "studentUser", displayName), {
      displayName: displayName,
      email: email,
      studentId: studentId,
      phoneNumber: phoneNumber,
      major: major,
      rc: rc,
      team: team,
    });
    if (docRef) {
      console.log("회원가입에 저장 성공");
    }
  };

  //회원정보 한개 조회
  async function fetchStudnetData() {
    // firebase Read : 함수 원하는 collection 안에 원하는 doc 안에 내용을 읽어올 때 사용한다.
    const docRef = doc(dbService, "studentUser", "윤성현 학부생", displayName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      // setFirstStep(docSnap.data().create);
      // console.log(firstStep);
    } else {
      console.log("No such document!");
      // setFirstStep("정보 없음");
    }
  }

  //모든 회원정보 조회
  async function fetchAllStudnetData() {
    // firebase Read : 함수 원하는 collection 안에 모든 doc을 읽어올 때 사용한다.
    const data = await getDocs(collection(dbService, "studentUser"));
    const newData = data.docs.map((doc) => ({ ...doc.data() }));
    console.log(newData);
    console.log("get create doc!");
  }

  //서브 컬렉션 만들기
  async function makeSubCollection() {
    const userId = "fne0ukrCF3YZHPDO0pFjb0PICey1";
    const usersCollection = collection(dbService, "studentUser");
    const subCollectionName = "survey";
    // const subCollectionRef = usersCollection
    //   .doc(userId)
    //   .collection(subCollectionName);

    // subCollectionRef.add({
    //   title: "설문",
    //   content: "답변1: 매우 좋음",
    // });
  }

  const changeStudentId = (e) => {
    setStudentId(e.target.value);
  };
  const changePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  const changeMajor = (e) => {
    setMajor(e.target.value);
  };
  const changeRc = (e) => {
    setRc(e.target.value);
  };
  const changeTeam = (e) => {
    setTeam(e.target.value);
  };

  return (
    <Div>
      <h1>Web_SelectMode</h1>
      <h2>{displayName}</h2>
      <button onClick={handleGoogleLogin}>학생 로그인</button>
      <button onClick={handleGoogleLogin}>관리자 로그인</button>
      <FormDiv>
        <input
          value={studentId}
          onChange={changeStudentId}
          type="text"
          name="studentId"
          placeholder="studnetId"
        />
        <input
          value={phoneNumber}
          onChange={changePhoneNumber}
          type="text"
          name="phoneNumber"
          placeholder="phoneNumber"
        />
        <input
          value={major}
          onChange={changeMajor}
          type="text"
          name="major"
          placeholder="major"
        />
        <input
          value={rc}
          onChange={changeRc}
          type="text"
          name="rc"
          placeholder="rc"
        />
        <input
          value={team}
          onChange={changeTeam}
          type="text"
          name="team"
          placeholder="team"
        />
        <button onClick={signUp}>회원가입</button>
      </FormDiv>
      <button onClick={fetchStudnetData}>회원정보 1명 조회</button>
      <button onClick={fetchAllStudnetData}>회원정보 모두 조회</button>
      <button onClick={makeSubCollection}>서브컬렉션 만들기</button>
    </Div>
  );
};

export default Web_SelectMode;
