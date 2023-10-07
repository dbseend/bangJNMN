import React, { useEffect, useState } from "react";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, dbService } from "../../api/fbase";
import styled from "styled-components";

const ClientSurvey = () => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({
    role: "",
    Q1: "",
    Q2: "",
    Q3: "",
    Q4: "",
    Q5: "",
    Q6: "",
    Q7: "",
    Q8: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "user", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUser(stuSnap.data());
          }
          if (
            // client -> admin 접근 차단
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/client");
          } else if (
            // admin -> client 접근 차단
            localStorage.getItem("access") === "admin" &&
            currentPath.includes("client")
          ) {
            alert("접근할 수 없습니다.");
            navigate("/admin");
          }
        } else {
          // 로그인 안 함
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);

  // 각 질문에 대한 답변을 저장하는 state
  const handleSubmitAnswers = async () => {
    const usersCollection = collection(dbService, "user");
    const subCollectionName = "survey";
    const userDocRef = doc(usersCollection, name);

    // Filter out keys with falsy (empty string) values from answers
    const filteredAnswers = {};
    for (const key in answers) {
      if (answers[key]) {
        filteredAnswers[key] = answers[key];
      }
    }

    if (Object.keys(filteredAnswers).length === 0) {
      alert("모든 질문에 답변해주세요.");
      return;
    }

    try {
      await setDoc(doc(userDocRef, subCollectionName, name), filteredAnswers);

      console.log("설문 결과를 저장했습니다.");
    } catch (error) {
      console.error("설문 결과를 저장하지 못 했습니다.", error);
    }
  };

  const handleAnswerChange = (e) => {
    const { name, value } = e.target;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    overflow: hidden;
  `;

  const Button = styled.button`
    cursor: pointer;
  `;

  return (
    <div>
      {" "}
      <h1>ClientSurvey</h1>
      <h3>방배정을 위한 설문입니다: !!</h3>
      <div>
        Q1. 당신은 누구입니까 ?
        {answers.role ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="role"
          value="새섬"
          onChange={handleAnswerChange}
        />{" "}
        새섬
        <input
          type="radio"
          name="role"
          value="새내기"
          onChange={handleAnswerChange}
        />{" "}
        새내기
        <input
          type="radio"
          name="role"
          value="팀원"
          onChange={handleAnswerChange}
        />{" "}
        팀원
      </div>
      <div>
        Q1. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q1 ? "" : <span style={{ color: "red" }}>답변 필요</span>}
        <br></br>
        <input
          type="radio"
          name="Q1"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q1"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q1"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q2. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q2 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q2"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q2"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q2"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q3. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q3 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q3"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q3"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q3"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q4. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q4 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q4"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q4"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q4"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q5. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q5 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q5"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q5"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q5"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q6. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q6 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q6"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q6"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q6"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q7. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q7 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q7"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q7"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q7"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q8. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
        {answers.Q8 ? "" : <span style={{ color: "red" }}>답변 필요</span>}{" "}
        <br></br>
        <input
          type="radio"
          name="Q8"
          value="1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q8"
          value="2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q8"
          value="3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <Button onClick={handleSubmitAnswers}>답변제출</Button>
    </div>
  );
};

export default ClientSurvey;
