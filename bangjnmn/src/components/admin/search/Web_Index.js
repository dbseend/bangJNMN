import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { dbService } from "../../../api/fbase";
import styled from "styled-components";

const Back = styled.div`
  background: #cecccc;
  margin-top: 7px;
  height: 100vh;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  max-width: 985px; // 중앙 박스의 최대 너비 설정
  margin: 0 auto; // 중앙 정렬
  overflow: auto;
  background-color: white;
`;
const UserData = styled.div`
  padding-left: 167px;
  padding-right: 168px;
  margin-bottom: 83px;
`
const Survey = styled.div`
  padding-left: 167px;
  margin-bottom: 50px;
`

const InfoBox = styled.div`
  border: 1px solid #000; // 테두리 설정
  display: flex; // 추가된 부분
  //padding: 14px;
`;

const Box = styled.div`
  font-weight: bold;
  margin-left:14px;
  width: 70px;
`

const Box1 = styled.div`
  //border: 1px solid #000;
  font-weight: bold;
  width: 250px;
`

const Row = styled.p`
  display: flex;
  flex-direction: row;
`

const Info = styled.label`
  padding-left: 113px;
  margin-left: auto;
`;


const Info1 = styled.label`
  margin-left: 70px;
`;

const Head = styled.h3`
  color: #000;
  padding-top: 41px;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 80% */
  letter-spacing: 0.5px;
  text-decoration-line: underline;
  margin-bottom: 25px;
`

const Head1 = styled.label`
  color: #000;
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 39px; /* 216.667% */
  letter-spacing: 0.5px;
  text-decoration-line: underline;
`
const SH = styled.p`
  color: #000;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  //line-height: 39px; /* 260% */
  letter-spacing: 0.5px;
  margin-bottom: 48px;
`

const Button = styled.button`
  margin-left: auto;
  margin-right: auto;
  width: 90px;
  margin-bottom: 50px;
  //all: unset;
  align-items: center;
  border-radius: 100px;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  height: 40px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border: 1px solid;
  background-color: var(--m-3syslightprimary);
  box-shadow: var(--m3-elevation-light-1);
  padding-top: 20px;
  padding-bottom: 20px;
  background: #CECCCC;

  &:hover {
    background: #A3A3A3; // 마우스를 올렸을 때의 배경색을 설정
  }
`

const User = () => {
  function Answer2(num) {
    if ({ num } == 1) return "06시 이전";
    else if ({ num } == 2) return "06 ~ 08시";
    else if ({ num } == 3) return "08 ~ 10시";
    else if ({ num } == 4) return "10 ~ 12시";
    else return "12시 이후";
  }

  function Answer3(num) {
    if ({ num } == 1) return "22시 이후";
    else if ({ num } == 2) return "22 ~ 00시";
    else if ({ num } == 3) return "00 ~ 02시";
    else if ({ num } == 4) return "02 ~ 04시";
    else return "04시 이후";
  }

  function Answer4(num) {
    if ({ num } == 1) return "매우 둔감";
    else if ({ num } == 2) return "둔감";
    else if ({ num } == 3) return "보통";
    else if ({ num } == 4) return "예민";
    else return "매우 예민";
  }

  function Answer5(num) {
    if ({ num } == 1) return "매우 둔감";
    else if ({ num } == 2) return "둔감";
    else if ({ num } == 3) return "보통";
    else if ({ num } == 4) return "예민";
    else return "매우 예민";
  }

  function Answer6(num) {
    if ({ num } == 1) return "매우 둔감";
    else if ({ num } == 2) return "둔감";
    else if ({ num } == 3) return "보통";
    else if ({ num } == 4) return "예민";
    else return "매우 예민";
  }

  function Answer7(num) {
    if ({ num } == 1) return "매우 둔감";
    else if ({ num } == 2) return "둔감";
    else if ({ num } == 3) return "보통";
    else if ({ num } == 4) return "예민";
    else return "매우 예민";
  }

  function Answer8(num) {
    if ({ num } == 1) return "1주";
    else if ({ num } == 2) return "2주";
    else if ({ num } == 3) return "4주";
    else if ({ num } == 4) return "8주";
    else return "안함";
  }

  function Answer9(num) {
    if ({ num } == 1) return "흡연 안함";
    else return "흡연 함";
  }


  function Room(roommateNum){
    if(roommateNum == "room4") return "4인실"
    if(roommateNum == "room2") return "2인실"
    if(roommateNum == "room1") return "1인실"

  }

  const [user, setUser] = useState({});
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const userCollection = collection(dbService, "user");
  const [surveyData, setSurveyData] = useState([]);

  useEffect(() => {
    console.log(state);
    setUser({ ...state });
    console.log(state.id);
  }, []);

  useEffect(() => {
    async function getSurvey() {
      const surveyCollection = collection(
        dbService,
        "user",
        state.id,
        "survey"
      );
      const surveyDocs = await getDocs(surveyCollection);
      const surveyData = surveyDocs.docs.map((doc) => doc.data());
      setSurveyData(surveyData);
      console.log(surveyData); // 'survey' 컬렉션의 데이터를 출력합니다.
    }
    getSurvey();
  }, [state.id]); // 'userId'가 변경될 때마다 'survey' 컬렉션을 가져옵니다.

  const handleGoBack = () => {
    navigate("../search"); // 이동할 경로를 지정합니다
  };

  console.log(user);

  return (
    <Back>
      <Div>
        <UserData>
          <Head> 학생 정보 조회</Head>
          <SH>학생의 상세 정보를 조회할 수 있습니다.</SH>
          <div>
            <InfoBox>
            <Row><Box>이름</Box> <Info>{user.name}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>학번</Box> <Info>{user.stuNum}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>팀</Box> <Info>{user.team}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>전공</Box> <Info>{user.major}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>생년월일</Box> <Info>{user.birth}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>인실</Box> <Info>{Room(user.roommateNum)}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>이메일</Box> <Info>{user.email}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>성별</Box> <Info>{user.gender}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>전화번호</Box> <Info>{user.phoneNumber}</Info></Row>
            </InfoBox>
            <InfoBox>
            <Row><Box>기숙사</Box> <Info>{user.dorm}</Info></Row>
            </InfoBox>
        </div>
      </UserData>
      <Survey>
        <Head1>학생 설문조사 결과</Head1>
        {surveyData.map((data, index) => (
          <p key={index}>
            <Row><Box1>1. 당신은 누구입니까?</Box1> <Info1>{data.Q1}</Info1></Row>
            <Row><Box1>2. 당신의 기상시간은 언제입니까?</Box1> <Info1>{Answer2(data.Q2)}</Info1></Row>
            <Row><Box1>3. 당신의 취침시간은 언제입니까?</Box1> <Info1>{Answer3(data.Q3)}</Info1></Row>
            <Row><Box1>4. 당신은 소리에 예민합니까?</Box1> <Info1>{Answer4(data.Q4)}</Info1></Row>
            <Row><Box1>5. 당신은 빛에 예민합니까?</Box1> <Info1>{Answer5(data.Q5)}</Info1></Row>
            <Row><Box1>6. 당신은 더위에 예민합니까?</Box1> <Info1>{Answer6(data.Q6)}</Info1></Row>
            <Row><Box1>7. 당신은 추위에 예민합니까?</Box1> <Info1>{Answer7(data.Q7)}</Info1></Row>
            <Row><Box1>8. 당신의 청소 주기는 무엇입니까?</Box1> <Info1>{Answer8(data.Q8)}</Info1></Row>
            <Row><Box1>8. 당신의 청소 주기는 무엇입니까?</Box1> <Info1>{Answer9(data.Q9)}</Info1></Row>
            <Row><Box1>마지막 한마디(자유롭게)</Box1> <Info1>{data.Sub}</Info1></Row>
          </p>
        ))}
      </Survey>
      <Button onClick={handleGoBack}>돌아가기</Button>
    </Div>

    </Back>
  );
};

export default User;
