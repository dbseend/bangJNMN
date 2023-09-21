import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvs9_--j1AZEw08GpRvbkEiIDu0erfbaI",
  authDomain: "bangjnmn.firebaseapp.com",
  projectId: "bangjnmn",
  storageBucket: "bangjnmn.appspot.com",
  messagingSenderId: "176236963852",
  appId: "1:176236963852:web:035f2abfcc53565cb2e629",
  measurementId: "G-XB2R4YX88Q"
};

const app = initializeApp(firebaseConfig); // firebase 초기화
const auth = getAuth(app); // firebase auth => user 정보를 관리한다.
const dbService = getFirestore(app); //  firebase DB => DB를 관리
const storage = getStorage(app); //storage => 파일이나 사진등의 text가 아닌 저장 내용들

export { app, auth, dbService, storage };
