import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, dbService } from "../../api/fbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  background: #204e4a;
`;

const Title = styled.div`
  margin-top: 85px;
  color: #fff9f3;
  text-align: center;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 83.333% */
  letter-spacing: 0.1px;
  width: 111px;
  height: 20px;
  left: 665px;
`;

const Mass1 = styled.div`
  margin-top: 90px;
  margin-bottom: 52px;
`;

const Mass = styled.div`
  margin-bottom: 52px;
`;
const Table = styled.div`
  width: 645px;
  height: 56px;
  flex-shrink: 0;
  border: 1px solid #000;
  background: #fff;
  display: flex;
`;

const Typo = styled.div`
  color: #000;
  font-family: Roboto bold;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  padding-top: 21px;
  padding-left: 16px;
  margin-right: 81px;
  width: 60px;
`;

const Content = styled.div`
  color: #000;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  margin-top: 21px;
  margin-right: 70px;
`;
const Radio = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  border: 2px solid var(--m-3-sys-light-on-surface-variant, #204e4a);
  /* 선택되지 않은 상태의 배경색과 기타 스타일 */
  &:not(:checked) {
    background-color: transparent; /* 선택되지 않은 상태에서는 배경색이 투명합니다. */
  }
  /* 선택된 상태에서의 배경색과 기타 스타일 */
  &:checked {
    background-color: #204e4a; /* 선택된 상태에서의 배경색 */
  }
  margin-top: 21px;
  margin-right: 11px;
`;
const Date = styled.input`
  width: 150px;
  height: 32px;
  gap: 8px;
  border: 1px solid #79747e;
  margin-top: 12px;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  padding-left: 10px;
  border-radius: 10px;
`;

const Text = styled.input`
  width: 150px;
  height: 32px;
  padding: 6px, 8px, 6px, 16px;
  gap: 8px;
  border: 1px solid #79747e;
  margin-top: 10px;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  padding-left: 10px;
  border-radius: 10px;
`;

const Submit = styled.button`
  width: 157px;
  height: 50px;
  padding: 10px, 24px, 10px, 24px;

  border-radius: 100px;
  gap: 8px;
  background: #cecccc;
  margin-bottom: 74px;

  font-family: Roboto;
  font-size: 24px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
  color: #000000;
  border: 1px solid #79747e;
`;
// const SubmitContainer = styled.div`
//   display: flex;
//   justify-content: center;
// `;

const Dropdown = styled.select`
  width: 150px;
  height: 32px;
  top: 580px;
  left: 527px;
  border: 1px solid #79747e;
  margin-top: 11px;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
`;
const SearchAndDropdown = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #79747E",
    width: "150px",
    height: "32px",
    gap: "8px",
    marginTop: "9px",
    fontFamily: "Roboto",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "20px",
    letterSpacing: "0.1px",
    borderRadius: "10px",
    cursor: state.isFocused ? "pointer" : "default",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#204E4A" : "white",
    color: state.isFocused ? "white" : "black",
    fontSize: "12px",
  }),
};

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
  const navigate = useNavigate();

  const options = [
    { value: "김군오", label: "김군오 교수님 팀" },
    { value: "김민재", label: "김민재 교수님 팀" },
    { value: "김제니", label: "김제니 교수님 팀" },
    { value: "김주일", label: "김주일 교수님 팀" },
    { value: "도형기", label: "도형기 교수님 팀" },
    { value: "라영안", label: "라영안 교수님 팀" },
    { value: "박찬송", label: "박찬송 교수님 팀" },
    { value: "신성만", label: "신성만 교수님 팀" },
    { value: "용환기", label: "용환기 교수님 팀" },
    { value: "이정민", label: "이정민 교수님 팀" },
    { value: "정모니카", label: "정모니카 교수님 팀" },
    { value: "제양규", label: "제양규 교수님 팀" },
    { value: "조규봉", label: "조규봉 교수님 팀" },
    { value: "조현지", label: "조현지 교수님 팀" },
    { value: "차승만", label: "차승만 교수님 팀" },
    { value: "최혜봉", label: "최혜봉 교수님 팀" },
    { value: "황성수", label: "황성수 교수님 팀" },
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
          setName(user.displayName);
          setEmail(user.email);
          const stuRef = doc(dbService, "user", user.displayName);
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

  const isValidPhoneNumber = (value) => {
    // 정규 표현식을 사용하여 유효한 전화번호 확인
    const phonePattern = /^(010\d{8})$/;
    return phonePattern.test(value);
  };

  const isValidStuNum = (value) => {
    // 정규 표현식을 사용하여 유효한 학번 확인
    const stuNumPattern = /^2\d{7}$/;
    return stuNumPattern.test(value);
  };

  //회원가입
  const signUp = async (e) => {
    e.preventDefault();
    if (
      name === "" ||
      email === "" ||
      gender === 0 ||
      birth === "" ||
      phoneNumber === "" ||
      stuNum === "" ||
      major === "" ||
      rc === "" ||
      team === "" ||
      dorm === "" ||
      roommateNum === 0 ||
      !isValidPhoneNumber(phoneNumber) ||
      !isValidStuNum(stuNum)
    ) {
      alert("누락되거나 틀린 내용이 있습니다.");
      return; // 필드가 하나라도 비어 있을 경우 함수 종료
    }

    const signUpData = {
      name: name,
      email: email,
      gender: gender,
      birth: birth,
      phoneNumber: phoneNumber,
      stuNum: stuNum,
      major: major,
      rc: rc,
      dorm: dorm,
      team: team.label,
      roommateNum: roommateNum,
      roomNum: "",
      access: "client",
      meetTime: 0,
      meetTF: false,
    };

    const docRef = setDoc(doc(dbService, "user", name), signUpData);

    if (docRef) {
      console.log("회원가입에 저장 성공");
      alert("회원가입 되었습니다.");
      navigate("/client");
    }
  };

  const changeTeam = (team) => {
    setTeam(team);
    console.log(team.label);
  };

  const changeGender = (e) => {
    setGender(e.target.id);
    console.log(e.target.id);
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
    console.log(e.target.value);
  };

  const changeRc = (e) => {
    setRc(e.target.value);
    console.log(e.target.value);
  };

  const changePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
    console.log(e.target.value);
  };

  const changeDorm = (e) => {
    setDorm(e.target.value);
    console.log(e.target.value);
  };

  const changeRoommateNum = (e) => {
    setRoommateNum(e.target.id);
    console.log(e.target.id);
  };

  return (
    <Div>
      <Title>방주니마니</Title>

      <form>
        <Mass1>
          <Table>
            <Typo> 이름 </Typo> <Content> {userData.displayName} </Content>
          </Table>
          <Table>
            <Typo> 이메일 </Typo>
            <Content> {userData.email} </Content>
          </Table>

          <Table>
            <label htmlFor="gender">
              {" "}
              <Typo> 성별 </Typo>
            </label>
            <Radio
              type="radio"
              name="gender"
              value="male"
              id="남자"
              onClick={changeGender}
            />{" "}
            <Content> 남자 </Content>
            <Radio
              type="radio"
              name="gender"
              value="female"
              id="여자"
              onClick={changeGender}
            />{" "}
            <Content> 여자 </Content>
          </Table>
          <Table>
            <label htmlFor="birth">
              {" "}
              <Typo> 생년월일 </Typo>{" "}
            </label>
            <Date type="date" name="birth" onChange={changeBirth} />
          </Table>

          <Table>
            <label htmlFor="phoneNumber">
              {" "}
              <Typo> 전화번호 </Typo>
            </label>
            <Text
              type="text"
              name="phoneNumber"
              onChange={changePhoneNumber}
              placeholder="숫자만 입력하세요"
              required="required"
              pattern="01[0-9]{9}"
              maxLength={13}
            />
          </Table>
        </Mass1>

        <Mass>
          <Table>
            <label htmlFor="studentNumber">
              {" "}
              <Typo> 학번 </Typo>
            </label>
            <Text
              type="text"
              name="stuNum"
              onChange={changeStuNum}
              placeholder="학번을 입력하세요"
              pattern="2[0-9]{2}00[0-9]{3}"
              maxLength={8}
            />
          </Table>
          <Table>
            <label htmlFor="major">
              {" "}
              <Typo> 학부 </Typo>
            </label>
            <Dropdown value={major} onChange={changeMajor}>
              <option value="" disabled>
                학부 선택
              </option>
              {majors.map((majorOption) => (
                <option key={majorOption} value={majorOption}>
                  {majorOption}
                </option>
              ))}
            </Dropdown>
          </Table>

          <Table>
            <label htmlFor="rc">
              {" "}
              <Typo> RC </Typo>{" "}
            </label>
            <Dropdown value={rc} onChange={changeRc}>
              <option value="" disabled>
                RC 선택
              </option>
              {rcs.map((rcOption) => (
                <option key={rcOption} value={rcOption}>
                  {rcOption}
                </option>
              ))}
            </Dropdown>
          </Table>

          <Table>
            <label htmlFor="dorm">
              {" "}
              <Typo> 거주호관 </Typo>{" "}
            </label>
            <Dropdown value={dorm} onChange={changeDorm}>
              <option value="" disabled>
                호관 선택
              </option>
              {dorms.map((dormOption) => (
                <option key={dormOption} value={dormOption}>
                  {dormOption}
                </option>
              ))}
            </Dropdown>
          </Table>
          <Table>
            <label htmlFor="team">
              {" "}
              <Typo> 팀 </Typo>{" "}
            </label>

            <Select
              onChange={changeTeam}
              type="text"
              name="team"
              value={team}
              options={options}
              isSearchable
              placeholder="팀 선택"
              styles={SearchAndDropdown}
            />
          </Table>
          <Table>
            <label htmlFor="roommateNum">
              <Typo> 인실 </Typo>{" "}
            </label>
            <Radio
              type="radio"
              name="roommateNum"
              value="room4"
              id="room4"
              onClick={changeRoommateNum}
            />{" "}
            <Content> 4인실 </Content>
            <Radio
              type="radio"
              name="roommateNum"
              value="room2"
              id="room2"
              onClick={changeRoommateNum}
            />{" "}
            <Content> 2인실 </Content>
            <Radio
              type="radio"
              name="roommateNum"
              value="room1"
              id="room1"
              onClick={changeRoommateNum}
            />{" "}
            <Content> 1인실 </Content>
          </Table>
        </Mass>
        <br />
      </form>
      <Submit onClick={signUp}> 확인 </Submit>
    </Div>
  );
};

export default SignUp;
