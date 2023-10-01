import React, { useEffect, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, dbService } from "../../api/fbase";
import styled from "styled-components";

const ClientSurvey = () => {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({
    role: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;

    // 실시간으로 계속해서 user의 정보를 읽어오는 과정
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setName(user.displayName);
        console.log("로그인 함");
        console.log(user);
        if (
          localStorage.getItem("access") == "client" &&
          currentPath.includes("admin")
        ) {
          alert("접근할 수 없습니다.");
          navigate("/client");
        }
      } else {
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    });
  }, [navigate]);
  // 각 질문에 대한 답변을 저장하는 state

  const handleSubmitAnswers = async () => {
    const usersCollection = collection(dbService, "studentUser");
    const subCollectionName = "survey";
    const userDocRef = doc(usersCollection, name);

    const surveyData = {
      ...answers,
    };

    try {
      await setDoc(doc(userDocRef, subCollectionName, name), surveyData);

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

  return (
    <div>
      {" "}
      <h1>ClientSurvey</h1>
      <h3>방배정을 위한 설문입니다: !!</h3>
      <div>
        Q1. 당신은 누구입니까?
        <input
          type="radio"
          name="role"
          value="senior"
          onChange={handleAnswerChange}
        />{" "}
        새섬
        <input
          type="radio"
          name="role"
          value="freshman"
          onChange={handleAnswerChange}
        />{" "}
        새내기
        <input
          type="radio"
          name="role"
          value="team"
          onChange={handleAnswerChange}
        />{" "}
        팀원
      </div>

      <div>
        Q1. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q2"
          value="Q2"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q2"
          value="Q2"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q2"
          value="Q2"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q2. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q1"
          value="Q1"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q1"
          value="Q1"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q1"
          value="Q1"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q3. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q3"
          value="Q3"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q3"
          value="Q3"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q3"
          value="Q3"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q4. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q4"
          value="Q4"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q4"
          value="Q4"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q4"
          value="Q4"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q5. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q5"
          value="Q5"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q5"
          value="Q5"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q5"
          value="Q5"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q6. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q6"
          value="Q6"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q6"
          value="Q6"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q6"
          value="Q6"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q7. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q7"
          value="Q7"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q7"
          value="Q7"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q7"
          value="Q7"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <div>
        Q8. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <input
          type="radio"
          name="Q8"
          value="Q8"
          onChange={handleAnswerChange}
        />{" "}
        1번
        <input
          type="radio"
          name="Q8"
          value="Q8"
          onChange={handleAnswerChange}
        />{" "}
        2번
        <input
          type="radio"
          name="Q8"
          value="Q8"
          onChange={handleAnswerChange}
        />{" "}
        3번
      </div>
      <button onClick={handleSubmitAnswers}>답변제출</button>
    </div>
  );
};

export default ClientSurvey;
