import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { collection, doc, getDoc, updateDoc, deleteDoc, getDocs} from 'firebase/firestore'
import { dbService } from '../../../api/fbase'
import  styled  from "styled-components";

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
`
const UserData = styled.div`
  padding-left: 167px;
  padding-right: 168px;
`
const Survey = styled.div`
  padding-left: 167px;
`

const InfoBox = styled.div`
  border: 1px solid #000; // 테두리 설정
  display: flex; // 추가된 부분
  padding: 14px;
`;

const Info = styled.label`
  padding-left: 113px;
  margin-left: auto;
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
`
const SH = styled.p`
  color: #000;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  //line-height: 39px; /* 260% */
  letter-spacing: 0.5px;
`

const User = () => {

  function Answer2(num){
    if({num} == 1) return "06시 이전"
    else if({num} == 2) return "06 ~ 08시"
    else if({num} == 3) return "08 ~ 10시"
    else if({num} == 4) return "10 ~ 12시"
    else return "12시 이후"
  }

  function Answer3(num){
    if({num} == 1) return "22시 이후"
    else if({num} == 2) return "22 ~ 00시"
    else if({num} == 3) return "00 ~ 02시"
    else if({num} == 4) return "02 ~ 04시"
    else return "04시 이후"
  }

  function Answer4(num){
    if({num} == 1) return "매우 둔감"
    else if({num} == 2) return "둔감"
    else if({num} == 3) return "보통"
    else if({num} == 4) return "예민"
    else return "매우 예민"
  }

  function Answer5(num){
    if({num} == 1) return "매우 둔감"
    else if({num} == 2) return "둔감"
    else if({num} == 3) return "보통"
    else if({num} == 4) return "예민"
    else return "매우 예민"
  }

  function Answer6(num){
    if({num} == 1) return "매우 둔감"
    else if({num} == 2) return "둔감"
    else if({num} == 3) return "보통"
    else if({num} == 4) return "예민"
    else return "매우 예민"
  }

  function Answer7(num){
    if({num} == 1) return "매우 둔감"
    else if({num} == 2) return "둔감"
    else if({num} == 3) return "보통"
    else if({num} == 4) return "예민"
    else return "매우 예민"
  }

  function Answer8(num){
    if({num} == 1) return "1주"
    else if({num} == 2) return "2주"
    else if({num} == 3) return "4주"
    else if({num} == 4) return "8주"
    else return "안함"
  }

  function Answer9(num){
    if({num} == 1) return "흡연 안함"
    else return "흡연 함"
  }

  function Room(num){
    if({num} == "room4") return "4인실"
    if({num} == "room2") return "2인실"
    if({num} == "room1") return "1인실"
  }


  const [user, setUser] = useState({})
  const { userId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const userCollection = collection(dbService, 'user')
  const [surveyData, setSurveyData] = useState([]);

  useEffect(() => {
    console.log(state);
    setUser({ ...state })
    console.log(state.id);
  }, [])

  useEffect(() => {
    async function getSurvey() {
      const surveyCollection = collection(dbService, 'user', state.id, 'survey');
      const surveyDocs = await getDocs(surveyCollection);
      const surveyData = surveyDocs.docs.map(doc => doc.data());
      setSurveyData(surveyData);
      console.log(surveyData); // 'survey' 컬렉션의 데이터를 출력합니다.
    }
    getSurvey();
  }, [state.id]); // 'userId'가 변경될 때마다 'survey' 컬렉션을 가져옵니다.


  const handleGoBack = () => {
    navigate("../search"); // 이동할 경로를 지정합니다
  };


  console.log(user)

  return (
    <Back>
      <Div>
        <UserData>
          <Head> 학생 정보 조회</Head>
          <SH>학생의 상세 정보를 조회할 수 있습니다.</SH>
          <div>
            <InfoBox>
            <p><b>이름</b> <Info>{user.name}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>학번</b> <Info>{user.stuNum}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>팀</b> <Info>{user.team}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>전공</b> <Info>{user.major}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>생년월일</b> <Info>{user.birth}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>인실</b> <Info>{Room(user.roommateNum)}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>이메일</b> <Info>{user.email}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>성별</b> <Info>{user.gender}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>전화번호</b> <Info>{user.phoneNumber}</Info></p>
            </InfoBox>
            <InfoBox>
            <p><b>기숙사</b> <Info>{user.dorm}</Info></p>
            </InfoBox>

          {/* <div>
            <label>이름</label>
            <input value={user.name} name="name"/>
          </div>
          <div>
            <label>학번</label>
            <input value={user.stuNum} name="stuNum"/>
          </div>
          <div>
            <label>팀</label>
            <input value={user.team} name="team"/>
          </div>
          <div>
            <label>전공</label>
            <input value={user.major} name="major"/>
          </div>
          <div>
            <label>생년월일</label>
            <input value={user.birth} name="birth"/>
          </div>
          <div>
            <label>호실</label>
            <input value={user.roommateNum} name="roommateNum"/>
          </div>
          <div>
            <label>이메일</label>
            <input value={user.email} name="email"/>
          </div>
          <div>
            <label>성별</label>
            <input value={user.gender} name="gender"/>
          </div>
          <div>
            <label>전화번호</label>
            <input value={user.phoneNumber} name="phoneNumber"/>
          </div>
          <div>
            <label>기숙사</label>
            <input value={user.dorm} name="dorm"/>
          </div> */}
          
        </div>
      </UserData>
      <Survey>
        <h2>설문조사 결과</h2>
        {surveyData.map((data, index) => (
          <p key={index}>
            Q1. 당신은 누구입니까? {data.Q1} <br/>
            Q2. 당신의 기상시간은 언제입니까?: {Answer2(data.Q2)} <br/>
            Q3. 당신의 취침시간은 언제입니까?: {Answer3(data.Q3)} <br/>
            Q4. 당신은 소리에 예민합니까?: {Answer4(data.Q4)} <br/>
            Q5. 당신은 빛에 예민합니까?: {Answer5(data.Q5)} <br/>
            Q6. 당신은 더위에 예민합니까?: {Answer6(data.Q6)} <br/>
            Q7. 당신은 추위에 예민합니까?: {Answer7(data.Q7)} <br/>
            Q8. 당신의 청소 주기는 무엇입니까?: {Answer8(data.Q8)} <br/>
            Q9. 당신은 흡연을 하십니까?: {Answer9(data.Q9)} <br/>
            마지막 한마디(자유롭게) : {data.Sub} <br/>
          </p>
        ))}
      </Survey>
      <button onClick={handleGoBack}>돌아가기</button>
    </Div>
    </Back>
    
    
    
  )
}

export default User