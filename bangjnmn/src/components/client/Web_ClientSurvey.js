import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { useNavigate } from "react-router-dom";
import { onReadUserData } from "../../utils/AccountStatus";

const ClientSurvey = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onReadUserData(navigate);
  }, [navigate]);
  // 각 질문에 대한 답변을 저장하는 state
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

  const handleSubmitAnswers = async () => {
    const usersCollection = collection(dbService, "studentUser");
    const subCollectionName = "survey";

    const userDocRef = doc(usersCollection, "윤성현"); //실제 로그인한 사용자 이름으로 변경 해줘요

    const surveyData = {
      ...answers,
    };

    try {
      await setDoc(
        userDocRef,
        { [subCollectionName]: surveyData },
        { merge: true }
      );
      console.log("서브 컬렉션에 데이터가 추가되었습니다.");
    } catch (error) {
      console.error(
        "서브 컬렉션에 데이터를 추가하는 중 오류가 발생했습니다.",
        error
      );
    }
  };
  const handleAnswerChange = (e) => {
    const { name, value } = e.target;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

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
        <textarea name="q1" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q2. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q2" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q3. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q3" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q4. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q4" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q5. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q5" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q6. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q6" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q7. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q7" onChange={handleAnswerChange}></textarea>
      </div>
      <div>
        Q8. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="q8" onChange={handleAnswerChange}></textarea>
      </div>
      <button onClick={handleSubmitAnswers}>답변제출</button>
    </div>
  );
};

export default ClientSurvey;
