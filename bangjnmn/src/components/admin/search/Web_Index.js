import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { collection, doc, getDoc, updateDoc, deleteDoc, getDocs} from 'firebase/firestore'
import { dbService } from '../../../api/fbase'
import  styled  from "styled-components";

const Div = styled.div`
`
const UserData = styled.div`
`
const Survey = styled.div`
`

const User = () => {

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
    <Div>
        <UserData>
          <div>
          <h1>{userId} 학생 상세 페이지</h1>
          <div>
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
          </div>
          
        </div>
      </UserData>
      <Survey>
        <h2>설문조사 결과</h2>
        {surveyData.map((data, index) => (
          <p key={index}>Q1: {data.Q1} Q2: {data.Q2}</p>
        ))}
      </Survey>
      <button onClick={handleGoBack}>돌아가기</button>
    </Div>
    
    
  )
}

export default User