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
  const [m4FhCount, setM4FhCount] = useState(0);
  const [m4TCount, setM4TCount] = useState(0);
  const [m4FRoomCount, setM4RoomCount] = useState(0);

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  async function settingUsers() {
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
            setMale4((prevArray) => [...prevArray, userAndSurveyData]);
            // console.log("남자 4인실: ", userAndSurveyData);
          } else if (userData.gender === "여자") {
            setFemale4((prevArray) => [...prevArray, userAndSurveyData]);
            // console.log("여자 4인실: ", userAndSurveyData);
          }
        } else if (userData.roommateNum === "room2") {
          if (userData.gender === "남자") {
            setMale2((prevArray) => [...prevArray, userAndSurveyData]);
            // console.log("남자 2인실: ", userAndSurveyData);
          } else if (userData.gender === "여자") {
            setFemale2((prevArray) => [...prevArray, userAndSurveyData]);
            // console.log("여자 2인실: ", userAndSurveyData);
          }
        }
      }
    }

    // const restUserMale4 = [];
    // const restUserMale2 = [];
    // const restUserFemale4 = [];
    // const restUserFemale2 = [];
    // let remainder, l;
    // //남자 4인실 인원 남는 경우
    // if (userMale4.length % 4 !== 0) {
    //   l = userMale4.length;
    //   remainder = l % 4;
    //   for (let i = 0; i < remainder; i++) {
    //     setMale4((prevArray) => [...prevArray, userAndSurveyData]);
    //     restUserMale4.push(userMale4[l - i - 1]);
    //     userMale4.pop();
    //   }
    // }
    // //남자 2인실 인원 남는 경우
    // if (userMale2.length % 2 !== 0) {
    //   l = userMale2.length;
    //   remainder = l % 2;
    //   for (let i = 0; i < remainder; i++) {
    //     restUserMale2.push(userMale4[l - i - 1]);
    //     userMale2.pop();
    //   }
    // }
    // //여자 4인실 인원 남는 경우
    // if (userFemale4.length % 4 !== 0) {
    //   l = userFemale4.length;
    //   remainder = l % 4;
    //   for (let i = 0; i < remainder; i++) {
    //     restUserFemale4.push(userMale4[l - i - 1]);
    //     userFemale4.pop();
    //   }
    // }
    // //여자 2인실 인원 남는 경우
    // if (userFemale2.length % 2 !== 0) {
    //   l = userFemale2.length;
    //   remainder = l % 2;
    //   for (let i = 0; i < remainder; i++) {
    //     restUserFemale2.push(userMale4[l - i - 1]);
    //     userFemale2.pop();
    //   }
    // }

    // setRestMale4(restUserMale4);
    // setRestMale2(restUserMale2);
    // setRestFemale4(restUserFemale4);
    // setRestFemale2(restUserFemale2);
  }

  async function makeRoom() {
    sortByRole(); //새섬,새내기,팀원을 기준 오름차순으로 정렬

    //4인실
    const freshAndHelper = male4.filter(
      //새섬, 새내기 정보
      (user) => user.q1 === "새내기" || user.q1 === "새섬"
    );
    console.log("남자 4인실: 새섬, 새내기", freshAndHelper);
    const teamMate = male4.filter((user) => user.q1 === "팀원"); //팀원 정보
    console.log("남자 4인실: 팀원", teamMate);

    let roomMates = {};
    let roommateKey;
    let memData = {};
    //새섬,새내기가 4명일 때
    if (freshAndHelper.length === 4) {
      for (let i = 0; i < 4; i++) {
        roommateKey = `m${i + 1}`;
        memData = {
          name: freshAndHelper[m4FhCount].name,
          stsuNum: freshAndHelper[m4FhCount].stuNum,
        };
        setM4FhCount(m4FhCount + 1);
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
            name: freshAndHelper[m4FhCount].name,
            stuNum: freshAndHelper[m4FhCount].stuNum,
          };
          setM4FhCount(m4FhCount + 1);
        } else {
          memData = {
            name: teamMate[m4TCount].name,
            stuNum: teamMate[m4TCount].stuNum,
          };
          setM4TCount(m4TCount + 1);
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
            name: freshAndHelper[m4FhCount].name,
            stuNum: freshAndHelper[m4FhCount].stuNum,
          };
          setM4FhCount(m4FhCount + 1);
        } else {
          memData = {
            name: teamMate[m4TCount].name,
            stuNum: teamMate[m4TCount].stuNum,
          };
          setM4TCount(m4TCount + 1);
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
        `${m4FRoomCount + 1}번방` // 문자열에 변수 값 넣으려면 백틱(`) 사용
      );
      await setDoc(roomRef, roomMates);
      console.log("데이터를 저장하였습니다.");
      setM4RoomCount(m4FRoomCount + 1);
      roomMates = {};
      roommateKey = 0;
      memData = {};
    } catch (error) {
      console.error("데이터를 저장하지 못 했습니다.", error);
    }

    //나머지
    let j = 0;
    console.log(male4.length - (m4FhCount + m4TCount));
    for (let i = 0; i < male4.length - (m4FhCount + m4TCount); i++) {
      roommateKey = `m${j + 1}`;
      memData = {
        name: teamMate[m4TCount].name,
        stsuNum: teamMate[m4TCount].stuNum,
      };
      setM4FhCount(m4TCount + 1);
      roomMates[roommateKey] = memData;
      j++;

      if ((j + 1) % 4 === 0) {
        try {
          const roomRef = doc(
            dbService,
            "room",
            "카이퍼",
            "박찬송",
            "남자",
            "4인실",
            `${m4FRoomCount + 1}번방` // 문자열에 변수 값 넣으려면 백틱(`) 사용
          );
          await setDoc(roomRef, roomMates);
          console.log("데이터를 저장하였습니다.");
          setM4RoomCount(m4FRoomCount + 1);
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
    console.log("남자 4인실", male4);
    // console.log("남자 2인실", male2);
    // console.log("여자 4인실", female4);
    // console.log("여자 2인실", female2);
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
