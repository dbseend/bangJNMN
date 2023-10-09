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

  // async function updateUser() {
  //   await updateDoc(doc(fruitCollection, productId), {
  //     name: fruit.name,
  //     season: fruit.season,
  //     color: fruit.color,
  //     taste: fruit.taste,
  //     count: fruit.count,
  //     price: fruit.price,
  //   })
  //   navigate('/products')
  // }

  // async function deleteFruit() {
  //   await deleteDoc(doc(fruitCollection, productId))
  //   navigate('/products')
  // }

  // const changeHandler = e => {
  //   setFruit(prev => ({ ...prev, [e.target.name]: e.target.value }))
  // }

  return (
    <div>
      <h1>{userId} 제품 상세 페이지</h1>
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
      {/* <div>
        <button onClick={updateFruit}>수정</button>
        <button onClick={deleteFruit}>제거</button>
      </div> */}
    </div>
  )
}

export default User