import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { collection, doc, getDoc, updateDoc, deleteDoc,} from 'firebase/firestore'
import { dbService } from '../../../api/fbase'

const User = () => {
  const [user, setUser] = useState({})
  const { userId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const userCollection = collection(dbService, 'user')

  useEffect(() => {
    setUser({ ...state })
  }, [])

  console.log(user)

  return (
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
        <input value={user.team ? user.team.value : ''} name="team"/>
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
      {/* <div>
        <button onClick={updateFruit}>수정</button>
        <button onClick={deleteFruit}>제거</button>
      </div> */}
    </div>
  )
}

export default User