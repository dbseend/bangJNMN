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
    const userCollection = collection(dbService, "user");
    const roomCollection = collection(dbService, "room");
    const q = query(
      userCollection,
      where("access", "==", "client"), //client 정보만 불러오도록
      where("rc", "==", "카이퍼"), // rc 필터
      where("team", "==", "박찬송 교수님 팀"), //팀 필터
      where("dorm", "==", "하용조관") // 생활관 필터
    );
    const clientInfo = await getDocs(q); // 필터(client, rc, 팀, 생활관)를 통해 나온 유저 정보

    const userMale4 = [];
    const userMale2 = [];
    const userFemale4 = [];
    const userFemale2 = [];

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
            setMale4((prevArray) => [...prevArray, userAndSurveyData]);
            console.log("남자 4인실: ", userAndSurveyData);
          } else if (userData.gender === "여자") {
            setFemale4((prevArray) => [...prevArray, userAndSurveyData]);
            console.log("여자 4인실: ", userAndSurveyData);
          }
        } else if (userData.roommateNum === "room2") {
          if (userData.gender === "남자") {
            setMale2((prevArray) => [...prevArray, userAndSurveyData]);
            console.log("남자 2인실: ", userAndSurveyData);
          } else if (userData.gender === "여자") {
            setFemale2((prevArray) => [...prevArray, userAndSurveyData]);
            console.log("여자 2인실: ", userAndSurveyData);
          }
        }
      }
    }

    const restUserMale4 = [];
    const restUserMale2 = [];
    const restUserFemale4 = [];
    const restUserFemale2 = [];
    let remainder, l;
    //남자 4인실 인원 남는 경우
    if (userMale4.length % 4 !== 0) {
      l = userMale4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restUserMale4.push(userMale4[l - i - 1]);
        userMale4.pop();
      }
    }
    //남자 2인실 인원 남는 경우
    if (userMale2.length % 2 !== 0) {
      l = userMale2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restUserMale2.push(userMale4[l - i - 1]);
        userMale2.pop();
      }
    }
    //여자 4인실 인원 남는 경우
    if (userFemale4.length % 4 !== 0) {
      l = userFemale4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restUserFemale4.push(userMale4[l - i - 1]);
        userFemale4.pop();
      }
    }
    //여자 2인실 인원 남는 경우
    if (userFemale2.length % 2 !== 0) {
      l = userFemale2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restUserFemale2.push(userMale4[l - i - 1]);
        userFemale2.pop();
      }
    }

    setRestMale4(restUserMale4);
    setRestMale2(restUserMale2);
    setRestFemale4(restUserFemale4);
    setRestFemale2(restUserFemale2);
  }

  async function makeRoom() {
    sortByRole(); //새섬,새내기,팀원을 기준 오름차순으로 정렬
    const freshAndHelper = male4.filter(
      //새섬, 새내기 정보
      (user) => user.Q1 === 1 || user.Q2 === 2
    );
    const teamMate = male4.filter((user) => user.Q1 === 3); //팀원 정보
    console.log(male4[0]);
    console.log(freshAndHelper.length);
    console.log(teamMate.length);
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
    </div>
  );
};

export default AdminRoom;
