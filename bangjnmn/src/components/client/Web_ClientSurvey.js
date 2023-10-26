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
    const usersCollection = collection(dbService, "name");
    const subCollectionName = "survey";
    const userDocRef = doc(usersCollection, name);

    const userDocExists = (await getDoc(userDocRef)).exists();
    if (!userDocExists) {
      try {
        await setDoc(userDocRef, {});
        console.log("사용자 문서 생성됨.");
      } catch (error) {
        console.error("사용자 문서를 생성하지 못했습니다.", error);
        return;
      }
    }

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
    margin: 8px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #cecccc;
    position: relative;
    z-index: 1;
    margin-top: 10px;
  `;

  const Rect1 = styled.div`
    width: 650px;
    max-width: 100%;
    height: 870px;
    flex-shrink: 0;
    background: white;
    margin: 0 auto;
  `;

  const Rect2 = styled.div`
    width: 323px;
    height: 46px;
    flex-shrink: 0;
    background: #f1f1f1;
    text-align: left;
    margin-left: 160px;
    margin-right: 167;
    border-radius: 7px;
  `;

  const Font1 = styled.div`
    font-family: Roboto;
    font-size: 10px;
    font-weight: 600;
    line-height: 20px;
    margin-left: 166px;
    text-align: left;
    color: #797979;
    margin-bottom: 5px;
  `;

  const Font2 = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-weight: 700;
    font-size: 18px ;
    line-height: 22px;
    margin-left: 166px;
    text-align: left;
    color: black;
    margin-bottom: 14px;
  `;

  const Font3 = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
    line-height: 15.5px;
    margin-left: 8px;
    padding-top: 7px;
    //text-align: left;
    color: black;
  `;

  const Font4 = styled.div`
    font-family: Roboto;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 15.5px;
    margin-left: 8px;
    //text-align: left;
    color: black;
  `;

  const Question = styled.div`
    margin-top: 30px;
    font-family: Roboto;
    font-size: 11px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-left: 166px;
    text-align: left;
    color: black;
  `;

  const Answer = styled.div`
    font-family: Roboto;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 166px;
    text-align: left;
    color: black;
    margin-bottom: 19px;
  `;

  const Button = styled.button`
    cursor: pointer;
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
  `;

  const SubmitContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Radio = styled.div`
  color : black;`

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
        </Answer>
        <Question>
          2. 평균 기상시간이 몇 시인가요?
          <br></br>
        </Question>
        <Answer>
          <input
            type="radio"
            name="Q1"
            value="1"
            onChange={handleAnswerChange}
          />{" "}
          7시 이전
          <input
            type="radio"
            name="Q1"
            value="2"
            onChange={handleAnswerChange}
          />{" "}
          7시 이전
          <input
            type="radio"
            name="Q1"
            value="3"
            onChange={handleAnswerChange}
          />{" "}
          7시 이후
          <input
            type="radio"
            name="Q1"
            value="4"
            onChange={handleAnswerChange}
          />{" "}
          7시 이후
        </Answer>
        <Question>
          Q2. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
          <br></br>
        </Question>
        <Answer>
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
        </Answer>
        <Question>
          Q3. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
          <br></br>
        </Question>
        <Answer>
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
        </Answer>
        <Question>
          Q4. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
          <br></br>
        </Question>
        <Answer>
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
        </Answer>
        <Question>
          Q5. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
          <br></br>
        </Question>
        <Answer>
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
        </Answer>
        <Question>
          Q6. ㅇㅇㅇㅇ에 자신의 ㅁㅁ?
          <br></br>
        </Question>
        <Answer>
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
        </Answer>
      </Rect1>
      <SubmitContainer>
        <Submit onClick={handleSubmitAnswers}>확인</Submit>
      </SubmitContainer>
    </Div>
  );
};

export default ClientSurvey;
