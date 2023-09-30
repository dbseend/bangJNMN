import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const SignUp = () => {
  const [userData, setUserData] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(0);
  const [stuNum, setStuNum] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dorm, setDorm] = useState("");
  const [roommateNum, setRoommateNum] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const options = [
    { value: "apple", label: "사과1" },
    { value: "banana", label: "바나나" },
    { value: "cherry", label: "체리" },
    { value: "date", label: "데이트" },
    { value: "grape", label: "포도" },
    { value: "kiwi", label: "키위" },
  ];

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
  const dorms = [
    "비전관",
    "벧엘관",
    "하용조관",
    "로뎀관",
    "은혜관",
    "국제관",
    "갈대상자관",
    "창조관",
  ];

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          console.log(user);
          setUserData(user);
          const stuRef = doc(dbService, "studentUser", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
          }
          if (
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            console.log("접근할 수 없습니다.");
            navigate("/client");
          }
        } else {
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);

  //회원가입
  const signUp = (e) => {
    const docRef = setDoc(doc(dbService, "studentUser", name), {
      name: name,
      email: email,
      gender: gender,
      birth: birth,
      phoneNumber: phoneNumber,
      stuNum: stuNum,
      major: major,
      rc: rc,
      team: team,
      dorm: dorm,
      roommateNum: roommateNum,
      roomNum: "",
      access: "client",
      meetTime: null,
      meetTF: false,
    });
    if (docRef) {
      console.log("회원가입에 저장 성공");
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const changeGender = (e) => {
    setGender(e.target.value);
    console.log(e.target.value);
  };

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
  };

  const changeRc = (e) => {
    setRc(e.target.value);
    console.log(e.target.value);
  };

  const changePhoneNumber = (e) => {
    const inputPhoneNumber = e.target.value.replace(/\D/g, "");
    let formattedPhoneNumber = "";
    if (inputPhoneNumber.length >= 3) {
      formattedPhoneNumber += inputPhoneNumber.substring(0, 3) + "-";
    }
    if (inputPhoneNumber.length >= 7) {
      formattedPhoneNumber += inputPhoneNumber.substring(3, 7) + "-";
    }
    if (inputPhoneNumber.length >= 11) {
      formattedPhoneNumber += inputPhoneNumber.substring(7, 11);
    }
    setPhoneNumber(formattedPhoneNumber);
    console.log(formattedPhoneNumber);
  };

  const changeTeam = (e) => {
    setTeam(e.target.value);
    console.log(e.target.value);
  };
  const changeDorm = (e) => {
    setDorm(e.target.value);
    console.log(e.target.value);
  };

  const changeRoommateNum = (e) => {
    setRoommateNum(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div>
      <h1>SignUp</h1>
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        isSearchable
        placeholder="옵션 선택"
      />

      {selectedOption && <p>선택한 옵션: {selectedOption.label}</p>}

      <form>
        <p>이름: {userData.displayName}</p>
        <p>이메일: {userData.email}</p>
        <br />
        <label htmlFor="gender">성별</label>
        <input
          type="radio"
          name="gender"
          value="male"
          onClick={changeGender}
        />{" "}
        남자
        <input
          type="radio"
          name="gender"
          value="female"
          onClick={changeGender}
        />{" "}
        여자
        <br />
        <label htmlFor="studentNumber">학번</label>
        <input type="text" name="studentNumber" onChange={changeStuNum} />
        <br />
        <label htmlFor="major">학부</label>
        <select value={major} onChange={changeMajor}>
          <option value="" disabled>
            학부 선택
          </option>
          {majors.map((majorOption) => (
            <option key={majorOption} value={majorOption}>
              {majorOption}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="phoneNumber">전화번호</label>
        <input
          type="text"
          name="phoneNumber"
          onChange={changePhoneNumber}
          placeholder="전화번호를 입력하세요"
          required="required"
          pattern="01[0-9]{9}"
          maxLength={13}
        />
        <br />
        <label htmlFor="birth"> 생년월일 </label>
        <input type="date" name="birth" onChange={changeBirth} />
        <br />
        <label htmlFor="rc"> RC </label>
        <select value={rc} onChange={changeRc}>
          <option value="" disabled>
            rc 선택
          </option>
          {rcs.map((rcOption) => (
            <option key={rcOption} value={rcOption}>
              {rcOption}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="team"> 팀 </label>
        <input type="text" name="team" onChange={changeTeam} />
        <br />
        <label htmlFor="dorm"> 호관 </label>
        <select value={dorm} onChange={changeDorm}>
          <option value="" disabled>
            호관 선택
          </option>
          {dorms.map((dormOption) => (
            <option key={dormOption} value={dormOption}>
              {dormOption}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="roommateNum"> 인실 </label>
        <input
          type="radio"
          name="roommateNum"
          value="room1"
          onClick={changeRoommateNum}
        />{" "}
        1인실
        <input
          type="radio"
          name="roommateNum"
          value="room2"
          onClick={changeRoommateNum}
        />{" "}
        2인실
        <input
          type="radio"
          name="roommateNum"
          value="room4"
          onClick={changeRoommateNum}
        />{" "}
        4인실
        <br />
      </form>
      <button onClick={signUp}> 회원가입 </button>
    </div>
  );
};

export default SignUp;
