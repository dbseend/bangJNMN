import { doc, getDoc } from "firebase/firestore";
import { auth, dbService } from "../api/fbase";

export const checkStatus = async (setUser) => {
  const currentPath = window.location.pathname;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("로그인 되어있습니다.");
      const stuRef = doc(dbService, "user", user.displayName);
      const stuSnap = await getDoc(stuRef);
      if (stuSnap.exists()) {
        const access = stuSnap.data().access;
        // console.log(stuSnap.data().access);
        setUser(stuSnap.data());

        if (access === "client" && currentPath.includes("admin")) {
          alert("접근할 수 없습니다.");
          window.location.href = "/client"; // 페이지를 '/client'로 이동
        } else if (access === "admin" && currentPath.includes("client")) {
          alert("접근할 수 없습니다.");
          window.location.href = "/admin"; // 페이지를 '/client'로 이동
        }
      }
    } else {
      console.log("로그인이 필요합니다.");
      window.location.href = "/"; // 페이지를 '/client'로 이동
    }
  });
};
