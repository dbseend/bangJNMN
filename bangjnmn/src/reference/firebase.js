import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { auth, dbService, storage } from "./fbase";
import { async } from "@firebase/util";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";

function App() {
  const [valuel, setValuel] = useState();
  const [firstStep, setFirstStep] = useState("");
  const [getImformation, setGetImformation] = useState();
  const [imageUpload, setImageUpload] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [userData, setUserData] = useState("");
  const [init, setInit] = useState(false);

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);

  const onChange = (event) => {
    //input 값이 입력 될 때 onchange를 통해 자동적으로 setState해준다! = 동기화 시켜주기
    const {
      target: { value },
    } = event;
    console.log(value);
    setValuel(value);
  };

  /* ################################# Create data ################################# */
  function handleOnSubmitid() {
    // firebase create 함수 원하는 collection에 doc id(램덤값)을 넣어준다.
    console.log("create 시작");
    const docRef = addDoc(collection(dbService, "create", displayName), {
      // create라는 collection 안에 넣겠다는 뜻
      create: valuel,
      update: valuel,
      delete: valuel,
    });
    if (docRef) {
      setValuel();
      console.log("create 성공");
    }
  }

  function handleOnSubmitWithdoc() {
    // firebase create 함수 원하는 collection 안에 원하는 doc을 입력할 떄 쓴다.
    console.log("create firstStep에 저장 시작");
    const docRef = setDoc(doc(dbService, "create", displayName), {
      // create라는 collection 안에 firstStep이라는 document에 저장하겠다는 뜻
      create: valuel,
      update: valuel,
      delete: valuel,
    });
    if (docRef) {
      setValuel();
      console.log("create firstStep에 저장 성공");
    }
  }

  /* ################################# Read data ################################# */
  async function fetchData() {
    // firebase Read : 함수 원하는 collection 안에 원하는 doc 안에 내용을 읽어올 때 사용한다.
    const docRef = doc(dbService, "create", displayName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setFirstStep(docSnap.data().create);
      console.log(firstStep);
    } else {
      console.log("No such document!");
      setFirstStep("정보 없음");
    }
  }

  async function fetchAllData() {
    // firebase Read : 함수 원하는 collection 안에 모든 doc을 읽어올 때 사용한다.
    const data = await getDocs(collection(dbService, displayName));
    const newData = data.docs.map((doc) => ({ ...doc.data() }));
    setGetImformation(newData);
    console.log(newData);
    console.log("get create doc!");
  }

  useEffect(() => {
    // 화면 켜지면 한 번만 읽어오게~
    fetchData();
    fetchAllData();
  }, []);

  /* ################################# Update data ################################# */
  function handleOnUpdate() {
    // firebase Update : 함수 원하는 collection 안에 원하는 doc 안에 특정 field를 업데이트해주고 싶을 때 사용한다
    console.log("update 시작");
    const docRef = doc(dbService, "create", displayName);
    updateDoc(docRef, {
      update: valuel,
    });
    if (docRef) {
      setValuel();
      console.log("update 성공");
    }
  }

  /* ################################# Delete data ################################# */
  function handleOnDelte() {
    // firebase Delete : 함수 원하는 collection 안에 원하는 doc 안에 특정 field를 삭제한다.
    console.log("delete 시작");
    const docRef = doc(dbService, "create", "firstStep");
    updateDoc(docRef, {
      delete: deleteField(),
    });
    if (docRef) {
      setValuel();
      console.log("delete 성공");
    }
  }

  function handleOnDelteDoc() {
    // firebase Delete : 함수 원하는 collection 안에 원하는 doc 전체를 삭제한다.
    console.log("문서 delete 시작");
    const docRef = doc(dbService, "create", "firstStep");
    deleteDoc(docRef, {
      delete: deleteField(),
    });
    if (docRef) {
      setValuel();
      console.log("문서 delete 성공");
    }
  }

  /* ################################# Storage 활용 ################################# */
  // 간단하게 생각해서 위에는 글자를 사용한 데이터를 관리했다면 Storage는 파일을 관리하는 과정입니다!
  function Uploadimage() {
    // 이미지 Storage에 저장하고 url 불러와서 DB에 저장하기
    if (imageUpload == null) return;
    const imageRef = ref(storage, "image/" + "지금 넣는 이미지 이름"); //  Storage안에 읽을 또는 저장할 파일 위치 지정
    uploadBytes(imageRef, imageUpload).then(() => {
      // Storage 해당 위치에 파일 저장
      const storagek = getStorage();
      getDownloadURL(ref(storagek, "image/" + "지금 넣는 이미지")) // Storage 해당 위치에 사진 파일을 URL로 변환하여 DB에 저장
        .then((url) => {
          // url 사용
        });
    });
  }

  /* ################################# Auth 로그인 활용 ################################# */
  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider(); // provider를 구글로 설정
    signInWithPopup(auth, provider) // popup을 이용한 signup
      .then((result) => {
        setInit(true);
        setUserData(result.user); // user data 설정
        console.log(userData); // console로 들어온 데이터 표시
        console.log(auth.currentUser); // 현재 로그인한 사람의 정보를 auth로 부터 읽어오기
        checkNewUser();
        //   const docRef = doc(dbService, "users", auth.currentUser.uid);
        //               const docSnap =  getDoc(docRef);
        //               if (docSnap.exists()) {
        //                   console.log('기존 유저');
        //                   // setUserDate(true);
        //               } else {
        //                 console.log('새로운 유저');
        //                 // setUserDate(true);
        //               }
        // })
        // .catch((err) => {
        //   console.log(err);
      });
  }

  async function checkNewUser() {
    const docRef = doc(dbService, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("기존 유저");
    } else {
      console.log("새로운 유저");
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(dbService, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("기존 유저");
        } else {
          console.log("새로운 유저");
        }
        setInit(true);
      } else {
        setInit(false);
      }
    });
  }, []);

  const onLogOutClick = () => {
    // 로그아웃
    auth.signOut();
    console.log("logout");
  };

  function onReadUserData() {
    auth.onAuthStateChanged(async (user) => {
      // 실시간으로 계속해서 user의 정보를 읽어오는 과정
      if (user) {
        // 로그인 상태
        console.log(user);
      } else {
        // 로그아웃 상태
        console.log(user);
      }
    });
  }

  return (
    <div>
      <header style={{ display: "flex" }}>
        <h1>React</h1>
        <h2>firebase</h2>
        <h3>CRUD</h3>
      </header>
      <input type="text" value={valuel} required onChange={onChange} />
      <button onClick={handleOnSubmitWithdoc}>저장하기</button>
      <button onClick={handleOnUpdate}>업데이트하기</button>
      <button onClick={handleOnDelte}>삭제하기</button>
      <div>
        <h1>{valuel}</h1>
      </div>
      <button onClick={handleOnDelteDoc}>document 삭제</button>
      <button onClick={handleOnSubmitid}>collection에만 저장</button>
      <div>
        <button onClick={fetchData}>firstStep data 정보 읽기</button>
        <button onClick={fetchAllData}>
          create collection data 모든 정보 읽기
        </button>
        <h1>{firstStep}</h1>
      </div>
      <div>
        <h1>사진 가져오기</h1>
        <input
          type="file"
          accept="image/jpg, image/png, image/jpeg"
          onChange={(e) => {
            // 사진 파일만 받는다는 input 설정
            setImageUpload(e.target.files?.[0]); // 사진 파일을 넣었을 떄 변수 설정해주기
          }}
        />
        <button onClick={Uploadimage}>파일 저장</button>
      </div>
      <div>
        <h1>user의 데이터 가져오기</h1>
        <button onClick={handleGoogleLogin}>Google로 로그인하기</button>
        <button onClick={onLogOutClick}>로그아웃</button>
        {init ? (
          <div>
            <h1>{displayName}</h1>
            <button onClick={onReadUserData}>user 데이터 확인</button>
          </div>
        ) : (
          <div>
            <h1>로그인 해주세요.</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
