import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";
import { doc, getDoc, getDocs, setDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  const [stuNum, setStuNum] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [birth, setBirth] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dorm, setDorm] = useState("");
  const [roommateNum, setRoommateNum] = useState(0);
 
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
  const dorms = ["비전관", "벧엘관", "하용조관", "로뎀관", "은혜관", "국제관", "갈대상자관", "창조관"];
  
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

  const changeGender = (e) => {
    setGender(e.target.value);
    console.log(e.target.value);
  }

  const changeMajor = (e) => {
    setMajor(e.target.value);
    console.log(e.target.value);
  };

  const changeStuNum = (e) => {
    setStuNum(e.target.value);
    console.log(e.target.value);
  };

  const changeBirth = (e) => {
    setBirth(e.target.value);
    console.log.apply(e.target.value);
  }

  const changeRc = (e) => {
    setRc(e.target.value);
    console.log(e.target.value);
  };

  const changePhoneNumber = (e) => {
    const inputPhoneNumber = e.target.value.replace(/\D/g, '');
    let formattedPhoneNumber = '';
    if (inputPhoneNumber.length >= 3) {
      formattedPhoneNumber += inputPhoneNumber.substring(0, 3) + '-';
    }
    if (inputPhoneNumber.length >= 7) {
      formattedPhoneNumber += inputPhoneNumber.substring(3, 7) + '-';
    }
    if (inputPhoneNumber.length >= 11) {
      formattedPhoneNumber += inputPhoneNumber.substring(7, 11);
    }
    setPhonenumber(formattedPhoneNumber);
    console.log(formattedPhoneNumber);
  };

  const changeTeam = (e) => {
    setTeam(e.target.value);
    console.log(e.target.value);
  }
  const changeDorm = (e) => {
    setDorm(e.target.value);
    console.log(e.target.value);
  }

  const changeRoommateNum = (e) => {
    setRoommateNum(e.target.value);
    console.log(e.target.value);
  }

  //회원가입
  const signUp = (e) => {
    const docRef = setDoc(doc(dbService, "studentUser", name), {
      name: name,
      email: email,
      gender: gender,
      stuNum: stuNum,
      major: major,
      phoneNumber: phoneNumber,
      birth: birth,
      rc: rc,
      team: team,
      dorm: dorm,
      roommateNum: roommateNum,
      roomNum: "",
      access: "client"
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
        <input type="radio" name="gender" value="male" onClick = {changeGender} /> 남자
        <input type="radio" name="gender" value="female" onClick = {changeGender}/> 여자
        <br />

        <label for="studentNumber">학번</label>
        <input type="text" name="studentNumber" onChange = {changeStuNum}/>
        <br />

        <label for="major">학부</label>
        <select value={major} onChange={changeMajor}>
          <option value = "" disabled> 학부 선택  </option>
          {majors.map((majorOption) => (
            <option key={majorOption} value={majorOption}>
              {majorOption}
            </option>
          ))}
        </select>
        <br />

        <label for="phoneNumber">전화번호</label>
        <input type="text" name="phoneNumber" onChange = {changePhoneNumber} placeholder = "전화번호를 입력하세요" 
          required = "required" pattern = "01[0-9]{9}" maxLength = {13}/>
        <br />

        <label for="birth"> 생년월일 </label>
        <input type = "date" name = "birth" onChange = {changeBirth}/>
        <br />

        <label for="rc"> RC </label>
        <select value={rc} onChange={changeRc}>
        <option value = "" disabled> rc 선택 </option>
          {rcs.map((rcOption) => (
            <option key={rcOption} value={rcOption}>
              {rcOption}
            </option>
          ))}
        </select>
        <br />

        <label for = "team"> 팀 </label>
        <input type = "text" name = "team" onChange = {changeTeam}/>
        <br />

        <label for = "dorm"> 호관 </label>
        <select value={dorm} onChange={changeDorm}>
        <option value = "" disabled> 호관 선택 </option>
          {dorms.map((dormOption) => (
            <option key={dormOption} value={dormOption}>
              {dormOption}
            </option>
          ))}
        </select>
        <br />

        <label for = "roommateNum"> 인실 </label>
        <input type="radio" name="roommateNum" value="room1" onClick = {changeRoommateNum}/> 1인실
        <input type="radio" name="roommateNum" value="room2" onClick = {changeRoommateNum}/> 2인실
        <input type="radio" name="roommateNum" value="room4" onClick = {changeRoommateNum}/> 4인실
        <br />        
      </form>
      <button onClick = {signUp}> 회원가입 </button>
        <label for="numberOfRoom">호인실</label>
        <input type="radio" name="numberOfRoom" value="room1" /> 1인실
        <input type="radio" name="numberOfRoom" value="room2" /> 2인실
        <input type="radio" name="numberOfRoom" value="room4" /> 4인실
        <br />
      </form>
      <button onClick={signUp}> 회원가입 </button>
    </Div>
  );
};

export default LogIn;
