import React, { useEffect, useState } from "react";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, dbService } from "../../api/fbase";
import styled from "styled-components";
import { checkStatus } from "../../utils/CheckStatus";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #cecccc;
  position: relative;
  z-index: 1;
  margin-top: 8px;
`;

const Rect1 = styled.div`
  width: 770px;
  max-width: 100%;
  height: 1900px;
  flex-shrink: 0;
  background: white;
  margin: 0 auto;
`;

const Rect2 = styled.div`
  width: 490px;
  height: 55px;
  flex-shrink: 0;
  background: #f1f1f1;
  text-align: left;
  margin-left: 160px;
  margin-right: 167;
  border-radius: 6px;
`;

const Font1 = styled.div`
  font-family: Roboto;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  margin-left: 166px;
  margin-top: 10px;
  text-align: left;
  color: #797979;
  margin-bottom: 17px;
`;

const Font2 = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 22px;
  margin-left: 166px;
  text-align: left;
  color: black;
  margin-bottom: 19px;
`;

const Font3 = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-size: 13px;
  font-weight: 700;
  line-height: 15.5px;
  margin-left: 13px;
  padding-top: 10px;
  //text-align: left;
  color: black;
`;

const Font4 = styled.div`
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.5px;
  margin-top: 4px;
  margin-left: 13px;
  //text-align: left;
  color: black;
`;

const Question = styled.div`
  margin-top: 30px;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-left: 160px;
  text-align: left;
  color: black;
  margin-bottom: 14px;
`;

const Answer = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-left: 163px;
  text-align: left;
  color: black;
  margin-bottom: 33px;
`;

const Submit = styled.button`
  display: flex;
  padding: 10px 24px;
  margin-top: 17px;
  margin-bottom: 20px;
  width: 88px;
  height: 50px;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  border: none;
  border-radius: 100px;
  background-color: #fff9f3;
  color: #38373c;

  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.1px;

  cursor: pointer;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Margin = styled.div`
  margin-left: 6px;
  margin-top: 6px;
`;

const ClientSurvey = () => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
    Q5: 0,
    Q6: 0,
    Q7: 0,
    Q8: 0,
    Q9: 0,
    Sub: "",
  });
  const [questionsAnswered, setQuestionsAnswered] = useState({
    Q1: false,
    Q2: false,
    Q3: false,
    Q4: false,
    Q5: false,
    Q6: false,
    Q7: false,
    Q8: false,
    Q9: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser).then(() => {
      setName(user.name);
    });
  }, [user]);
  

  // 각 질문에 대한 답변을 저장하는 state
  const handleSubmitAnswers = async () => {
    console.log('내 이름은', name);
    const usersCollection = collection(dbService, "user"); // "user" 컬렉션으로 수정
    const userDocRef = doc(usersCollection, name); // 사용자 이름을 문서로 사용
    const subCollectionName = collection(userDocRef, "survey");
    const userDocExists = (await getDoc(userDocRef)).exists();

    const unansweredQuestions = [];

    const filteredAnswers = {};
    for (const key in answers) {
      if (answers[key]) {
        filteredAnswers[key] = answers[key];
        setQuestionsAnswered((prevQuestions) => ({
          ...prevQuestions,
          [key]: true,
        }));
      } else {
        unansweredQuestions.push(key);
      }
    }

    const isQ10Answered = !!answers.Q10; // Q10에 대한 답변이 있는지 확인

    /*if (Object.keys(answers).length === 0 && !isQ10Answered) {
      alert("모든 질문에 답변해주세요.");
      return;
    }*/

    const missingQuestions = [];

    for (const key in questionsAnswered) {
      if (key === "Sub" && !questionsAnswered[key]) {
        continue; // Q10 질문은 선택사항이므로 답변이 없어도 괜찮습니다.
      }

      if (!questionsAnswered[key]) {
        missingQuestions.push(key);
      }
    }

    if (missingQuestions.length > 0) {
      alert(`질문 ${missingQuestions.join(", ")}에 답변해주세요.`);
      return;
    }

    try {
      await setDoc(doc(userDocRef, "survey", name), filteredAnswers);
      // 제출 후 알림 표시
      alert("설문이 제출되었습니다.");

      // ClientHome 페이지로 리디렉션
      navigate("/client");
    } catch (error) {
      console.error("설문 제출 실패하였습니다.", error);
    }
  };

  const handleAnswerChange = (e) => {
    const { name, value } = e.target;

    if (name === "Sub") {
      // Q10의 textarea에 대한 조건을 적용
      const updatedAnswers = {
        ...answers,
        [name]: value,
      };
      setAnswers(updatedAnswers);
    } else {
      // 다른 입력 필드에 대한 조건을 적용
      const updatedAnswers = {
        ...answers,
        [name]: value,
      };
      setAnswers(updatedAnswers);

      // 라디오 버튼이 선택되었는지 확인하고 선택 상태 업데이트
      const updatedQuestionsAnswered = { ...questionsAnswered };
      updatedQuestionsAnswered[name] = true;
      setQuestionsAnswered(updatedQuestionsAnswered);
    }
  };

  return (
    <Div>
      {" "}
      <Rect1>
        <Font1>2024년도 1학기 방배정 설문조사</Font1>
        <Font2>설문조사</Font2>
        <Rect2>
          <Font3>아래 설문에 응답해주세요.</Font3>
          <Font4>
            설문 응답은 향후 룸메이트 배정 결과에 반영됩니다. 감사합니다.
          </Font4>
        </Rect2>

        <Question>
          1. 당신은 누구인가요?
          <br></br>
        </Question>
        <Answer>
            <input
            type="radio"
            name="Q1"
            value="새섬"
            checked={answers.Q1 === "새섬"}
            onChange={handleAnswerChange}
          />{" "}
          새섬<Margin></Margin>
          <input
            type="radio"
            name="Q1"
            value="새내기"
            checked={answers.Q1 === "새내기"}
            onChange={handleAnswerChange}
          />{" "}
          새내기 <Margin></Margin>
          <input
            type="radio"
            name="Q1"
            value="팀원"
            checked={answers.Q1 === "팀원"}
            onChange={handleAnswerChange}
          />{" "}팀원
        </Answer>
        <Question>
          2. 평균 기상시간이 몇 시인가요? (오전)
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q2"
            value="1"
            checked={answers.Q2 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          06시 이전 <Margin></Margin>
          <input
            type="radio"
            name="Q2"
            value="2"
            checked={answers.Q2 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          06 ~ 08시 <Margin></Margin>
          <input
            type="radio"
            name="Q2"
            value="3"
            checked={answers.Q2 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          08 ~ 10시 <Margin></Margin>
          <input
            type="radio"
            name="Q2"
            value="4"
            checked={answers.Q2 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          10 ~ 12시 <Margin></Margin>
          <input
            type="radio"
            name="Q2"
            value="5"
            checked={answers.Q2 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          12시 이후
        </Answer>
        <Question>
          3. 평균 취침시간이 몇 시인가요? (오후)
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q3"
            value="1"
            checked={answers.Q3 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          10시 이전 <Margin></Margin>
          <input
            type="radio"
            name="Q3"
            value="2"
            checked={answers.Q3 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          10 ~ 12시 <Margin></Margin>
          <input
            type="radio"
            name="Q3"
            value="3"
            checked={answers.Q3 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          12 ~ 14시 <Margin></Margin>
          <input
            type="radio"
            name="Q3"
            value="4"
            checked={answers.Q3 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          14 ~ 16시 <Margin></Margin>
          <input
            type="radio"
            name="Q3"
            value="5"
            checked={answers.Q3 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          16시 이후
        </Answer>
        <Question>
          4. 자신의 소리 예민도는 어느정도 입니까?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q4"
            value="1"
            checked={answers.Q4 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          1 (예민하지 않음) <Margin></Margin>
          <input
            type="radio"
            name="Q4"
            value="2"
            checked={answers.Q4 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          2 <Margin></Margin>
          <input
            type="radio"
            name="Q4"
            value="3"
            checked={answers.Q4 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          3 (보통) <Margin></Margin>
          <input
            type="radio"
            name="Q4"
            value="4"
            checked={answers.Q4 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          4 <Margin></Margin>
          <input
            type="radio"
            name="Q4"
            value="5"
            checked={answers.Q4 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          5 (예민함) 
        </Answer>
        <Question>
          5. 자신의 빛 예민도는 어느정도 입니까?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q5"
            value="1"
            checked={answers.Q5 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          1 (예민하지 않음) <Margin></Margin>
          <input
            type="radio"
            name="Q5"
            value="2"
            checked={answers.Q5 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          2 <Margin></Margin>
          <input
            type="radio"
            name="Q5"
            value="3"
            checked={answers.Q5 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          3 <Margin></Margin>
          <input
            type="radio"
            name="Q5"
            value="4"
            checked={answers.Q5 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          4 <Margin></Margin>
          <input
            type="radio"
            name="Q5"
            value="5"
            checked={answers.Q5 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          5 (예민함)
        </Answer>
        <Question>
          6. 자신의 추위 예민도는 어느정도 입니까?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q6"
            value="1"
            checked={answers.Q6 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          1 (예민하지 않음) <Margin></Margin>
          <input
            type="radio"
            name="Q6"
            value="2"
            checked={answers.Q6 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          2 <Margin></Margin>
          <input
            type="radio"
            name="Q6"
            value="3"
            checked={answers.Q6 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          3 <Margin></Margin>
          <input
            type="radio"
            name="Q6"
            value="4"
            checked={answers.Q6 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          4 <Margin></Margin>
          <input
            type="radio"
            name="Q6"
            value="5"
            checked={answers.Q6 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          5 (예민함)
        </Answer>
        <Question>
          7. 자신의 더위 예민도는 어느정도 입니까?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q7"
            value="1"
            checked={answers.Q7 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          1 (예민하지 않음) <Margin></Margin>
          <input
            type="radio"
            name="Q7"
            value="2"
            checked={answers.Q7 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          2 <Margin></Margin>
          <input
            type="radio"
            name="Q7"
            value="3"
            checked={answers.Q7 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          3 <Margin></Margin>
          <input
            type="radio"
            name="Q7"
            value="4"
            checked={answers.Q7 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          4 <Margin></Margin>
          <input
            type="radio"
            name="Q7"
            value="5"
            checked={answers.Q7 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          5 (예민함)
        </Answer>
        <Question>
          8. 자신의 청소주기는 언제입니까?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q8"
            value="1"
            checked={answers.Q8 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          1주 <Margin></Margin>
          <input
            type="radio"
            name="Q8"
            value="2"
            checked={answers.Q8 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          2주 <Margin></Margin>
          <input
            type="radio"
            name="Q8"
            value="3"
            checked={answers.Q8 === "3"}
            onChange={handleAnswerChange}
          />{" "}
          4주 <Margin></Margin>
          <input
            type="radio"
            name="Q8"
            value="4"
            checked={answers.Q8 === "4"}
            onChange={handleAnswerChange}
          />{" "}
          8주 <Margin></Margin>
          <input
            type="radio"
            name="Q8"
            value="5"
            checked={answers.Q8 === "5"}
            onChange={handleAnswerChange}
          />{" "}
          안함
        </Answer>
        <Question>
          9. 흡연을 하시나요?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q9"
            value="1"
            checked={answers.Q9 === "1"}
            onChange={handleAnswerChange}
          />{" "}
          예 (흡연 합니다.) <Margin></Margin>
          <input
            type="radio"
            name="Q9"
            value="2"
            checked={answers.Q9 === "2"}
            onChange={handleAnswerChange}
          />{" "}
          아니요 (흡연 안 합니다.)
        </Answer>
        <Question>
          10. 마지막 간사님께 하고싶은 말을 자유롭게 해주세요. (선택)
          <br></br>
        </Question>
        <Answer>
          <textarea
            name="Sub"
            value={answers.Sub}
            onChange={handleAnswerChange}
            rows="4"
            cols="53"
          ></textarea>
        </Answer>
      </Rect1>
      <SubmitContainer>
        <Submit type="submit" onClick={handleSubmitAnswers}>
          확인
        </Submit>
      </SubmitContainer>
    </Div>
  );
};

export default ClientSurvey;
