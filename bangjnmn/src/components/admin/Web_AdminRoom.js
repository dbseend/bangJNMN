import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { dbService } from "../../api/fbase";
import { checkStatus } from "../../utils/CheckStatus";
import { get } from "react-hook-form";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  /* overflow: hidden; */
`;

const SelectContainer = styled.div`
  margin-top: 5px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
`;

const AsignRoomButton = styled.button`
  width: 88px;
  height: 38px;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 1px solid #000;
  background: #cecccc;
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
    backgroundColor: state.isFocused ? "#04589C" : "white",
    color: state.isFocused ? "white" : "black",
    fontSize: "12px",
  }),
};
const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f4f4f4;
  position: relative;
  z-index: 1;
  //margin-top: 1px;
`;

const Rect1 = styled.div`
  width: 1200px;
  max-width: 100%;
  height: 1000px;
  flex-shrink: 0;
  background: white;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Font1 = styled.div`
  color: black;
  margin-top: 42px;
  margin-left: 20px;
  margin-bottom: 16px;
  font-family: Roboto;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 80% */
  letter-spacing: 0.5px;
  text-decoration-line: underline;
`;

const Font2 = styled.div`
  color: black;
  font-family: Roboto;
  margin-left: 20px;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 39px; /* 260% */
  letter-spacing: 0.5px;
`;

const Margin1 = styled.div`
  margin-left: 83px;
`;

const Margin2 = styled.div`
  margin-top: 10px;
`;

const Title = styled.div`
  color: black;
  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 450;
  line-height: 16px; /* 123.077% */
  letter-spacing: 0.5px;
`;

const Info = styled.div`
  color: black;
  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 123.077% */
  letter-spacing: 0.5px;
`;

const Table = styled.table`
  margin-left: 20px;
  margin-top: 20px;
  background-color: gray;
  border: 1px solid black;
`;

const TableCell = styled.td`
  width: 210px;
  padding: 8px;
  border: 1px solid black; // 각 셀을 구분선으로 둘러싸기
  text-align: center;
`;

const AdminRoom = () => {
  const [user, setUser] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dorm, setDorm] = useState("");
  const [selectedRc, setSelectedRc] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [male4, setMale4] = useState([]);
  const [male2, setMale2] = useState([]);
  const [female4, setFemale4] = useState([]);
  const [female2, setFemale2] = useState([]);
  const [resMale4, setResMale4] = useState([]);
  const [resMale2, setResMale2] = useState([]);
  const [resFemale4, setResFemale4] = useState([]);
  const [resFemale2, setResFemale2] = useState([]);
  const [restMale4, setRestMale4] = useState([]);
  const [restMale2, setRestMale2] = useState([]);
  const [restFemale4, setRestFemale4] = useState([]);
  const [restFemale2, setRestFemale2] = useState([]);
  const male4Ref = useRef([]);
  const male2Ref = useRef([]);
  const female4Ref = useRef([]);
  const female2Ref = useRef([]);
  const [isExceuted, setIsExceuted] = useState(false);

  const optionsTeam = [
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

  const optionsStandard = [
    { value: "생활패턴", label: "생활패턴" },
    { value: "예민도", label: "예민도" },
    { value: "삶의질", label: "삶의질" },
  ];

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  async function assignRoom() {
    await setUsersInfo(); // setUsersInfo가 완료될 때까지 기다립니다.
    makeTeamRoom(); // setUsersInfo가 완료된 후에 실행됩니다.
    await makeRestRoom(); // setUsersInfo가 완료된 후에 실행됩니다.
    getResult();
    setIsExceuted(true);
  }

  async function setUsersInfo() {
    const m4 = []; // 남자 4인실
    const restM4 = []; // 남자 남은 4인실
    const m2 = []; // 남자 2인실
    const restM2 = []; // 남자 남은 2인실
    const f4 = []; // 여자 4인실
    const restF4 = []; // 여자 남은 4인실
    const f2 = []; // 여자 2인실
    const restF2 = []; // 여자 남은 2인실

    const userCollection = collection(dbService, "user");
    const team = selectedTeam.label;
    const q = query(
      userCollection,
      where("access", "==", "client"), // client 정보만 불러오도록
      where("rc", "==", "카이퍼"), // rc 필터
      where("team", "==", team), // 팀 필터
      where("dorm", "==", "하용조관") // 생활관 필터
    );
    const clientInfo = await getDocs(q); // 필터(client, rc, 팀, 생활관)를 통해 나온 유저 정보

    const infoLength = clientInfo.size;
    for (let i = 0; i < infoLength; i++) {
      const userInfo = clientInfo.docs[i];
      const userData = userInfo.data();

      const surveyDoc = doc(
        dbService,
        "user",
        userData.name,
        "survey",
        userData.name
      );
      const surveySnap = await getDoc(surveyDoc);

      if (surveySnap.exists()) {
        const surveyData = surveySnap.data();
        const userAndSurveyData = {
          name: userData.name,
          q1: surveyData.Q1,
          q2: surveyData.Q2,
          q3: surveyData.Q3,
          q4: surveyData.Q4,
          q5: surveyData.Q5,
          q6: surveyData.Q6,
          q7: surveyData.Q7,
          q8: surveyData.Q8,
          q9: surveyData.Q9,
        };

        // 성별, roommateNum에 따른 분류
        if (userData.roommateNum === "room4") {
          if (userData.gender === "남자") {
            m4.push(userAndSurveyData);
          } else if (userData.gender === "여자") {
            f4.push(userAndSurveyData);
          }
        } else if (userData.roommateNum === "room2") {
          if (userData.gender === "남자") {
            m2.push(userAndSurveyData);
          } else if (userData.gender === "여자") {
            f2.push(userAndSurveyData);
          }
        }
      }
    }

    // 남자 4인실 인원 남는 경우
    let remainder, l;
    if (m4.length % 4 !== 0) {
      l = m4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restM4.push(m4[l - i - 1]);
        m4.pop();
      }
    }
    // 남자 2인실 인원 남는 경우
    if (m2.length % 2 !== 0) {
      l = m2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restM2.push(m2[l - i - 1]);
        m2.pop();
      }
    }
    // 여자 4인실 인원 남는 경우
    if (f4.length % 4 !== 0) {
      l = f4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restF4.push(f4[l - i - 1]);
        f4.pop();
      }
    }
    // 여자 2인실 인원 남는 경우
    if (f2.length % 2 !== 0) {
      l = f2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restF2.push(f2[l - i - 1]);
        f2.pop();
      }
    }

    // setMale4(m4);
    // setRestMale4(restM4);
    // setMale2(m2);
    // setRestMale2(restM2);
    // setFemale4(f4);
    // setRestFemale4(restF4);
    // setFemale2(f2);
    // setRestFemale2(restF2);
    male4Ref.current = m4;
    male2Ref.current = m2;
    female4Ref.current = f4;
    female2Ref.current = f2;

    console.log(m4);
    console.log(m2);
    console.log(f4);
    console.log(f2);
    console.log("다 끝남 유저인포!");
  }

  async function makeTeamRoom() {
    console.log("방 배정 해볼까?");
    //남자, 여자 => 4인실, 2인실
    sortByRole(); //새섬,새내기,팀원을 기준 오름차순으로 정렬
    const team = selectedTeam.label;
    const standard = selectedStandard.label;

    //4번 반복 -> 남자 4인실, 남자 2인실, 여자 4인실, 여자 2인실
    for (let k = 0; k < 4; k++) {
      let roomCnt = 0; // 현재까지 만들어진 방 개수
      let fhCnt = 0; //새섬, 새내기 방에 들어간 인원
      let m4TCnt = 0; //4인실 팀원 방에 들어간 인원
      let roomMates = []; // 방 룸메 정보(최대 4명)
      let roommateKey; // 방 룸메 번호(1~4)
      let memData = {}; // 방 룸메 한명당 정보
      let currenRoom = []; // 현재 사용하고 있는 배열
      let memNum = 0;
      let gender = "";
      let memNums = "";

      switch (k) {
        case 0:
          currenRoom = male4Ref.current;
          memNum = 4;
          gender = "남자";
          memNums = "4인실";
          break;
        case 1:
          currenRoom = male2Ref.current;
          memNum = 2;
          gender = "남자";
          memNums = "2인실";
          break;
        case 2:
          currenRoom = female4Ref.current;
          memNum = 4;
          gender = "여자";
          memNums = "4인실";
          break;
        case 3:
          currenRoom = female2Ref.current;
          memNum = 2;
          gender = "여자";
          memNums = "2인실";
          break;
      }

      //4인실
      const freshAndHelper = currenRoom.filter(
        //새섬, 새내기 정보
        (user) => user.q1 === "새내기" || user.q1 === "새섬"
      );
      const teamMate = currenRoom.filter((user) => user.q1 === "팀원"); //팀원 정보

      if (selectedStandard.label === "수면패턴") {
        freshAndHelper.sort((a, b) => a.q2 + a.q3 - (b.q2 + b.q3));
        teamMate.sort((a, b) => a.q2 + a.q3 - (b.q2 + b.q3));
      } else if (selectedStandard.label === "예민도") {
        freshAndHelper.sort(
          (a, b) => a.q4 + a.q5 + a.q6 + a.q7 - (b.q4 + b.q5 + b.q7 + b.q8)
        );
        teamMate.sort(
          (a, b) => a.q4 + a.q5 + a.q6 + a.q7 - (b.q4 + b.q5 + b.q7 + b.q8)
        );
      } else if (selectedStandard.label === "삶의질") {
        freshAndHelper.sort((a, b) => a.q8 + a.q9 - (b.q8 + b.q9));
        teamMate.sort((a, b) => a.q8 + a.q9 - (b.q8 + b.q9));
      }

      if (memNum === 4 && currenRoom.length !== 0) {
        //새섬,새내기가 4명일 때
        if (freshAndHelper.length === 4) {
          for (let i = 0; i < memNum; i++) {
            roommateKey = `m${i + 1}`;
            memData = {
              name: freshAndHelper[fhCnt].name,
            };
            fhCnt++;
            roomMates.push(memData);
            // roomMates[roommateKey] = memData;
          }
        }
        //새섬, 새내기가 4명보다 작을 때
        else if (freshAndHelper.length < 4) {
          for (let i = 0; i < memNum; i++) {
            roommateKey = `m${i + 1}`;
            memData = {};

            if (i < freshAndHelper.length) {
              memData = {
                name: freshAndHelper[fhCnt].name,
              };
              fhCnt++;
            } else {
              memData = {
                name: teamMate[m4TCnt].name,
              };
              m4TCnt++;
            }
            roomMates.push(memData);
            // roomMates[roommateKey] = memData;
          }
        }

        //새섬, 새내기가 4명보다 많을 때 - 5,6 => 2/3, 3/3 으로 나누기
        else if (freshAndHelper.length > memNum) {
          for (let i = 0; i < memNum; i++) {
            roommateKey = `m${i + 1}`;
            memData = {};

            if (i < 3) {
              memData = {
                name: freshAndHelper[fhCnt].name,
              };
              fhCnt++;
            } else {
              memData = {
                name: teamMate[m4TCnt].name,
              };
              m4TCnt++;
            }
            roomMates.push(memData);
            // roomMates[roommateKey] = memData;
          }
        }

        console.log(
          selectedTeam.label,
          selectedStandard.label,
          gender,
          memNums
        );
        console.log(roomMates);
        try {
          const roomRef = doc(
            dbService,
            "room",
            "카이퍼",
            team,
            standard,
            gender,
            memNums
          );

          const data = { roomMates: roomMates };

          // 기존 데이터를 병합하면서 업데이트
          await setDoc(roomRef, data, { merge: true });

          console.log("데이터를 저장하였습니다.");
          roomCnt++;
          roomMates = [];
          roommateKey = 0;
          memData = {};
        } catch (error) {
          console.error("데이터를 저장하지 못 했습니다.", error);
        }
      }

      //나머지 + 2인실
      let j = 0;
      const restMem = currenRoom.length - (fhCnt + m4TCnt);
      for (let i = 0; i < restMem; i++) {
        roommateKey = `m${j + 1}`;
        if (fhCnt < freshAndHelper.length) {
          memData = {
            name: freshAndHelper[fhCnt].name,
          };
          fhCnt++;
        } else {
          memData = {
            name: teamMate[m4TCnt].name,
          };
          m4TCnt++;
        }
        roomMates.push(memData);
        // roomMates[roommateKey] = memData;
        j++;

        console.log(
          selectedTeam.label,
          selectedStandard.label,
          gender,
          memNums
        );
        if (j % memNum === 0) {
          console.log(roomMates);
          try {
            const roomRef = doc(
              dbService,
              "room",
              "카이퍼",
              team,
              standard,
              gender,
              memNums
            );

            // 기존 데이터 가져오기
            const docSnapshot = await getDoc(roomRef);

            if (docSnapshot.exists()) {
              const existingData = docSnapshot.data();

              // 동적으로 필드 이름 생성
              const dynamicFieldName = `mate${roomCnt + 1}`;

              // 기존 데이터에서 dynamicFieldName 필드 가져오기
              const existingFieldData = existingData[dynamicFieldName] || [];

              // 새로운 mate 필드 항목 추가
              const newRoomMatesItem = { roomMates: roomMates }; // 원하는 데이터로 대체
              existingFieldData.push(newRoomMatesItem);

              // 업데이트할 데이터 생성
              const data = { [dynamicFieldName]: existingFieldData };

              // 데이터 업데이트
              await updateDoc(roomRef, data);

              console.log(`${dynamicFieldName}을 업데이트하였습니다.`);
              roomCnt++;
              roomMates = [];
              roommateKey = 0;
              memData = {};
            } else {
              // 문서가 존재하지 않는 경우 새로운 데이터 생성
              const data = { mate1: [{ roomMates: roomMates }] }; // 원하는 데이터로 대체
              await setDoc(roomRef, data);

              console.log("mate1을 초기화하였습니다.");
            }
          } catch (error) {
            console.error("데이터를 업데이트하지 못 했습니다.", error);
          }

          j = 0;
        }
      }
    }
  }

  async function makeRestRoom() {}

  function info() {
    console.log("남자 4인실", male4);
    console.log("남자 2인실", male2);
    console.log("여자 4인실", female4);
    console.log("여자 2인실", female2);
  }

  // 새섬,새내기,팀원을 기준으로 오름차순으로 정렬
  const sortByRole = () => {
    const sortedMale4 = [...male4].sort((a, b) => a.Q1 - b.Q1);
    setMale4(sortedMale4);

    const sortedMale2 = [...male2].sort((a, b) => a.Q1 - b.Q1);
    setMale4(sortedMale2);

    const sortedFemale4 = [...female4].sort((a, b) => a.Q1 - b.Q1);
    setMale4(sortedFemale4);

    const sortedFemale2 = [...female2].sort((a, b) => a.Q1 - b.Q1);
    setMale2(sortedFemale2);
  };

  const changeTeam = (selectedTeam) => {
    setSelectedTeam(selectedTeam);
    console.log(selectedTeam);
  };

  const changeStandard = (selectedStandard) => {
    setSelectedStandard(selectedStandard);
    console.log(selectedStandard);
  };

  async function getResult() {
    const team = selectedTeam.label;
    const standard = selectedStandard.label;
    let gender = "";
    let memNums = "";
    let num = 0;
    for (let k = 0; k < 4; k++) {
      switch (k) {
        case 0:
          gender = "남자";
          memNums = "4인실";
          num = 4;
          break;
        case 1:
          gender = "남자";
          memNums = "2인실";
          num = 2;
          break;
        case 2:
          gender = "여자";
          memNums = "4인실";
          num = 4;
          break;
        case 3:
          gender = "여자";
          memNums = "2인실";
          num = 2;
          break;
      }

      try {
        const roomRef = doc(
          dbService,
          "room",
          "카이퍼",
          team,
          standard,
          gender,
          memNums
        );

        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dataLength = Object.keys(data).length;

          let resInfo = [];
          if (num === 4) {
            for (let i = 0; i < dataLength; i++) {
              for (let j = 0; j < 4; j++) {
                const mateKey = `mate${i + 1}`; // 예: mate1, mate2, ...
                const roomMatesKey = j.toString(); // 예: "0", "1", "2", "3"
                if (
                  data[mateKey] &&
                  data[mateKey][roomMatesKey] &&
                  data[mateKey][roomMatesKey].roomMates
                ) {
                  const name = data[mateKey][roomMatesKey].roomMates[j].name;
                  resInfo.push(name);
                  console.log(name);
                }
              }
            }
          } else if (num === 2) {
            for (let i = 0; i < dataLength; i++) {
              for (let j = 0; j < 2; j++) {
                const mateKey = `mate${i + 1}`; // 예: mate1, mate2, ...
                const roomMatesKey = j.toString(); // 예: "0", "1", "2", "3";
                if (
                  data[mateKey] &&
                  data[mateKey][roomMatesKey] &&
                  data[mateKey][roomMatesKey].roomMates
                ) {
                  const name = data[mateKey][roomMatesKey].roomMates[j].name;
                  resInfo.push(name);
                  console.log(mateKey, roomMatesKey, name);
                }
              }
            }
          }
          console.log(resInfo);
          switch (k) {
            case 0:
              setResMale4(resInfo);
              break;
            case 1:
              setResMale2(resInfo);
              break;
            case 2:
              setResFemale4(resInfo);
              break;
            case 3:
              setResFemale2(resInfo);
              num = 2;
              break;
          }
          resInfo = [];
        }
      } catch (error) {
        console.error("데이터를 업데이트하지 못 했습니다.", error);
      }
    }
  }

  return (
    <Main>
      <Div>
        <Rect1>
          <Font1>기숙사 방배정</Font1>
          <Font2>기숙사 방배정 결과를 조회합니다.</Font2>
          <SelectContainer>
            <Select
              onChange={changeTeam}
              type="text"
              name="team"
              value={selectedTeam}
              options={optionsTeam}
              isSearchable
              placeholder="팀 선택"
              styles={SearchAndDropdown}
            />
            <Margin1></Margin1>
            <Select
              onChange={changeStandard}
              type="text"
              name="standard"
              value={selectedStandard}
              options={optionsStandard}
              isSearchable
              placeholder="기준 선택"
              styles={SearchAndDropdown}
            />{" "}
            <Margin1></Margin1>
            <Margin2>
              {" "}
              <AsignRoomButton onClick={assignRoom}>배정하기</AsignRoomButton>
            </Margin2>
          </SelectContainer>
          {isExceuted ? (
            <>
              <Table>
                <tbody>
                  <tr>
                    <TableCell>여자 4인실</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                  </tr>
                  {resFemale4.map((name, index) => (
                    <React.Fragment key={index}>
                      {(index + 1) % 4 === 1 ? (
                        <TableCell>{index / 4 + 1}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 2 || (index + 1) % 4 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 3 || (index + 1) % 4 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 0 ? <tr></tr> : null}
                    </React.Fragment>
                  ))}
                  <tr>
                    <TableCell>여자 2인실</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                  </tr>
                  {resFemale2.map((name, index) => (
                    <React.Fragment key={index}>
                      {(index + 1) % 3 === 1 ? (
                        <TableCell>{index / 3 + 1}</TableCell>
                      ) : null}
                      {(index + 1) % 3 === 2 || (index + 1) % 3 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 3 === 0 ? <tr></tr> : null}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <TableCell>남자 4인실</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                  </tr>
                  {resMale4.map((name, index) => (
                    <React.Fragment key={index}>
                      {(index + 1) % 4 === 1 ? (
                        <TableCell>{index / 4 + 1}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 2 || (index + 1) % 4 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 3 || (index + 1) % 4 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 4 === 0 ? <tr></tr> : null}
                    </React.Fragment>
                  ))}
                  <tr>
                    <TableCell>남자 2인실</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>이름</TableCell>
                  </tr>
                  {resMale2.map((name, index) => (
                    <React.Fragment key={index}>
                      {(index + 1) % 3 === 1 ? (
                        <TableCell>{index / 3 + 1}</TableCell>
                      ) : null}
                      {(index + 1) % 3 === 2 || (index + 1) % 3 === 0 ? (
                        <TableCell>{name}</TableCell>
                      ) : null}
                      {(index + 1) % 3 === 0 ? <tr></tr> : null}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div>팀과 기준을 선택해주세요</div>
          )}
        </Rect1>
      </Div>
    </Main>
  );
};

export default AdminRoom;
