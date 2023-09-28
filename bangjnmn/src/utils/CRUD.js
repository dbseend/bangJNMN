import React, { useState } from "react";

//학생 한명 조회
export const fetchData = async () => {
  const [userData, setUserData] = useState("");

  //studentUser 컬렉션 안에 로그인 한 사용자의 문서 참조
  const docRef = doc(dbService, "studentUser", displayName);
  //사용자의 문서 정보 받아오기
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    setUserData(docSnap.data()); //문서의 모든 값 불러오기
    setUserData(docSnap.data().필드이름) //문서에서 특정 필드 값 불러오기
  } else {
    console.log("No such document!");
    setUserData("정보 없음");
  }
};

//모든 학생 조회
export const fetchAllData = async () => {
  const [allUserData, setAllUserData] = useState("");

  //studentUser 안에 있는 모든 문서의 정보 받아오기
  const data = await getDocs(collection(dbService, "studentUser"));
  const newData = data.docs.map((doc) => ({ ...doc.data() }));
  setAllUserData(newData);
  console.log(newData);
  console.log("get create doc!");
};

//학생 정보 업데이트
export const handleOnUpdate = () => {
  console.log("update 시작");
  const docRef = doc(dbService, "studentUser", displayName);
  updateDoc(docRef, {
    update: valuel, //수정할 값
  });
  if (docRef) {
    console.log("update 성공");
  }
};
