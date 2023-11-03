import React, { useEffect, useState } from "react";
import { checkStatus } from "../../utils/CheckStatus";
import { dbService } from "../../api/fbase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";

const AdminRoom = () => {
  const [user, setUser] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dorm, setDorm] = useState("");
  const [selectedRc, setSelectedRc] = useState("");
  const [selectedTeam, setSeletedTeam] = useState("");
  const [male4, setMale4] = useState([]);
  const [male2, setMale2] = useState([]);
  const [female4, setFemale4] = useState([]);
  const [female2, setFemale2] = useState([]);
  const [restMale4, setRestMale4] = useState([]);
  const [restMale2, setRestMale2] = useState([]);
  const [restFemale4, setRestFemale4] = useState([]);
  const [restFemale2, setRestFemale2] = useState([]);

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  async function settingUsers() {
    const m4 = []; //남자 4인실
    const restM4 = []; //남자 남은 4인실
    const m2 = []; //남자 2인실
    const restM2 = []; //남자 남은 2인실
    const f4 = []; //여자 4인실
    const restF4 = []; //여자 남은 4인실
    const f2 = []; //여자 2인실
    const restF2 = []; //여자 남은 2인실

    const userCollection = collection(dbService, "user");
    const q = query(
      userCollection,
      where("access", "==", "client"), //client 정보만 불러오도록
      where("rc", "==", "카이퍼"), // rc 필터
      where("team", "==", "박찬송 교수님 팀"), //팀 필터
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
          stuNum: userData.stuNum,
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
            setFemale4((prevArray) => [...prevArray, userAndSurveyData]);
          }
        } else if (userData.roommateNum === "room2") {
          if (userData.gender === "남자") {
            setMale2((prevArray) => [...prevArray, userAndSurveyData]);
          } else if (userData.gender === "여자") {
            setFemale2((prevArray) => [...prevArray, userAndSurveyData]);
          }
        }
      }
    }

    //남자 4인실 인원 남는 경우
    let remainder, l;
    if (m4.length % 4 !== 0) {
      l = m4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restM4.push(m4[l - i - 1]);
        m4.pop();
      }
    }
    //남자 2인실 인원 남는 경우
    if (m2.length % 2 !== 0) {
      l = m2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restM2.push(m2[l - i - 1]);
        m2.pop();
      }
    }
    //여자 4인실 인원 남는 경우
    if (f4.length % 4 !== 0) {
      l = f4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restF4.push(f4[l - i - 1]);
        f4.pop();
      }
    }
    //여자 2인실 인원 남는 경우
    if (f2.length % 2 !== 0) {
      l = f2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restF2.push(f2[l - i - 1]);
        f2.pop();
      }
    }

    setMale4(m4);
    setRestMale4(restM4);
    setMale2(m2);
    setRestMale2(restM2);
    setFemale4(f4);
    setRestFemale4(restF4);
    setFemale2(f2);
    setRestFemale4(restF2);
  }

  async function makeRoom() {
    sortByRole(); //새섬,새내기,팀원을 기준 오름차순으로 정렬

    let m4Cnt = 0; // 남자 4인실 현재까지 만들어진 방 개수
    let m4FhCnt = 0; //남자 4인실 새섬, 새내기 방에 들어간 인원
    let m4TCnt = 0; //남자 4인실 팀원 방에 들어간 인원
    let roomMates = {}; // 방 룸메 정보(최대 4명)
    let roommateKey; // 방 룸메 번호(1~4)
    let memData = {}; // 방 룸메 한명당 정보

    //4인실
    const freshAndHelper = male4.filter(
      //새섬, 새내기 정보
      (user) => user.q1 === "새내기" || user.q1 === "새섬"
    );
    console.log("남자 4인실: 새섬, 새내기", freshAndHelper);
    const teamMate = male4.filter((user) => user.q1 === "팀원"); //팀원 정보
    console.log("남자 4인실: 팀원", teamMate);

    //새섬,새내기가 4명일 때
    if (freshAndHelper.length === 4) {
      for (let i = 0; i < 4; i++) {
        roommateKey = `m${i + 1}`;
        memData = {
          name: freshAndHelper[m4FhCnt].name,
          stsuNum: freshAndHelper[m4FhCnt].stuNum,
        };
        m4FhCnt++;
        roomMates[roommateKey] = memData;
      }
    }
    //새섬, 새내기가 4명보다 작을 때
    else if (freshAndHelper.length < 4) {
      console.log("4명보다 작음 !");

      for (let i = 0; i < 4; i++) {
        roommateKey = `m${i + 1}`;
        memData = {};

        if (i < freshAndHelper.length) {
          memData = {
            name: freshAndHelper[m4FhCnt].name,
            stuNum: freshAndHelper[m4FhCnt].stuNum,
          };
          m4FhCnt++;
        } else {
          memData = {
            name: teamMate[m4Cnt].name,
            stuNum: teamMate[m4Cnt].stuNum,
          };
          m4TCnt++;
        }

        roomMates[roommateKey] = memData;
      }
    }

    //새섬, 새내기가 4명보다 많을 때 - 5,6
    else if (freshAndHelper.length > 4) {
      console.log("4명보다 많음 !");

      for (let i = 0; i < 4; i++) {
        roommateKey = `m${i + 1}`;
        memData = {};

        if (i < freshAndHelper.length) {
          memData = {
            name: freshAndHelper[m4FhCnt].name,
            stuNum: freshAndHelper[m4FhCnt].stuNum,
          };
          m4FhCnt++;
        } else {
          memData = {
            name: teamMate[m4TCnt].name,
            stuNum: teamMate[m4TCnt].stuNum,
          };
          m4TCnt++;
        }

        roomMates[roommateKey] = memData;
      }
    }

    try {
      const roomRef = doc(
        dbService,
        "room",
        "카이퍼",
        "박찬송",
        "남자",
        "4인실",
        `${m4Cnt + 1}번방` // 문자열에 변수 값 넣으려면 백틱(`) 사용
      );
      await setDoc(roomRef, roomMates);
      console.log("데이터를 저장하였습니다.");
      m4Cnt++;
      console.log(m4Cnt, " 번 방입니다");
      roomMates = {};
      roommateKey = 0;
      memData = {};
    } catch (error) {
      console.error("데이터를 저장하지 못 했습니다.", error);
    }

    //나머지
    let j = 0;
    console.log(male4.length - (m4FhCnt + m4TCnt));
    const restMem = male4.length - (m4FhCnt + m4TCnt);
    for (let i = 0; i < restMem; i++) {
      roommateKey = `m${j + 1}`;
      memData = {
        name: teamMate[m4TCnt].name,
        stsuNum: teamMate[m4TCnt].stuNum,
      };
      m4TCnt++;
      roomMates[roommateKey] = memData;
      j++;

      if (j % 4 === 0) {
        //방 인원수 채웠을 때
        console.log("4명 채웠습니당");
        try {
          const roomRef = doc(
            dbService,
            "room",
            "카이퍼",
            "박찬송",
            "남자",
            "4인실",
            `${m4Cnt + 1}번방` // 문자열에 변수 값 넣으려면 백틱(`) 사용
          );
          await setDoc(roomRef, roomMates);
          console.log("데이터를 저장하였습니다.");
          m4Cnt++;
          console.log(m4Cnt, " 번 방입니다");
          roomMates = {};
          roommateKey = 0;
          memData = {};
        } catch (error) {
          console.error("데이터를 저장하지 못 했습니다.", error);
        }
        j = 0;
      }
    }
  }

  function info() {
    console.log(male4.length);
    console.log(restMale4.length);
    console.log("남자 4인실", male4);
    console.log("남자 4인실 남음", "제발 1명 나와라", restMale4);
    // console.log("남자 2인실", male2.length);
    // console.log("여자 4인실", female4.length);
    // console.log("여자 2인실", female2.length);
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

  return (
    <div>
      <h1>AdminRoom</h1>
      <button onClick={settingUsers}>방배정</button>
      <button onClick={makeRoom}>방짜줘</button>
      <button onClick={info}>정보 확인</button>
    </div>
  );
};

export default AdminRoom;
