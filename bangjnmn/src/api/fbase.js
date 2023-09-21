import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJqlmYxHRiApmHC1aVWVxvsXq5slNZISw",
  authDomain: "facebook-bb901.firebaseapp.com",
  projectId: "facebook-bb901",
  storageBucket: "facebook-bb901.appspot.com",
  messagingSenderId: "856175115665",
  appId: "1:856175115665:web:74ea57b49aa7b252072e30",
  measurementId: "G-Y9K254QCWD",
};

const app = initializeApp(firebaseConfig); // firebase 초기화
const auth = getAuth(app); // firebase auth => user 정보를 관리한다.
const dbService = getFirestore(app); //  firebase DB => DB를 관리
const storage = getStorage(app); //storage => 파일이나 사진등의 text가 아닌 저장 내용들

export { app, auth, dbService, storage };
