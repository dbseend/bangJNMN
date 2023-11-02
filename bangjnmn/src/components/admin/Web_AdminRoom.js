import React, { useEffect, useState } from "react";
import { checkStatus } from "../../utils/CheckStatus";
import { dbService } from "../../api/fbase";
import { collection, getDocs, query, where } from "@firebase/firestore";

const AdminRoom = () => {
  const [user, setUser] = useState("");
  const [rc, setRc] = useState("");
  const [team, setTeam] = useState("");
  const [dorm, setDorm] = useState("");
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
    clientInfo.forEach((doc) => {
      const userData = doc.data();

      // 성별, roommateNum에 따른 분류
      if (userData.roommateNum === "room4") {
        if (userData.gender === "남자") {
          userMale4.push(userData);
        } else if (userData.gender === "여자") {
          userFemale4.push(userData);
        }
      } else if (userData.roommateNum === "room2") {
        if (userData.gender === "남자") {
          userMale2.push(userData);
        } else if (userData.gender === "여자") {
          userFemale2.push(userData);
        }
      }
    });

    const restUserMale4 = [];
    const restUserMale2 = [];
    const restUserFemale4 = [];
    const restUserFemale2 = [];
    let remainder, l;
    //남자 4인실 인원 남는 경우
    if (userMale4.length % 4 != 0) {
      l = userMale4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restUserMale4.push(userMale4[l - i - 1]);
        userMale4.pop();
      }
    }
    //남자 2인실 인원 남는 경우
    if (userMale2.length % 2 != 0) {
      l = userMale2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restUserMale2.push(userMale4[l - i - 1]);
        userMale2.pop();
      }
    }
    //여자 4인실 인원 남는 경우
    if (userFemale4.length % 4 != 0) {
      l = userFemale4.length;
      remainder = l % 4;
      for (let i = 0; i < remainder; i++) {
        restUserFemale4.push(userMale4[l - i - 1]);
        userFemale4.pop();
      }
    }
    //여자 2인실 인원 남는 경우
    if (userFemale2.length % 2 != 0) {
      l = userFemale2.length;
      remainder = l % 2;
      for (let i = 0; i < remainder; i++) {
        restUserFemale2.push(userMale4[l - i - 1]);
        userFemale2.pop();
      }
    }

    setMale4(userMale4);
    setMale2(userMale2);
    setFemale4(userMale4);
    setFemale2(userMale2);
    setRestMale4(restUserMale4);
    setRestMale2(restUserMale2);
    setRestFemale4(restUserFemale4);
    setRestFemale2(restUserFemale2);
  }

  async function makeRoom() {
    //새섬/새내기/팀원
    //4인실
    //새섬/새내기
    const freshManAndHelper = male4.filter(
      (user) => user.access === 1 || user.access === 2
    );
    //새섬/새내기가 4명인 경우
    if(freshManAndHelper.length === 4){
  
    }
    //새섬/새내기가 4명 미만인 경우
    else if(freshManAndHelper.length < 4){
  
    }
    //새섬/새내기가 4명 초과인 경우
    else if(freshManAndHelper.length > 4){
  
    }
  
    //팀원
    const access3Num = male4.filter(
      (user) => user.access === 3
    );
    //2인실
  }

  return (
    <div>
      <h1>AdminRoom</h1>
      <button onClick={settingUsers}>방배정</button>
    </div>
  );
};

export default AdminRoom;
