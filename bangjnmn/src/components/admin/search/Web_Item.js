import React from 'react'
import { useNavigate } from 'react-router-dom'

const Item = ({ data }) => {
  console.log(data.team); // 여기 추가
  const navigate = useNavigate()
  return (
    <tr>
      <td>{data.name}</td>
      <td>{data.stuNum}</td>
      <td>{data.team.value}</td>
      <td>{data.major}</td>
      <td>{data.birth}</td>
      <td>{data.roommateNum}</td>
      <td>
        {
          <button
            onClick={() => {
              console.log(data.id)
              navigate(data.id, { state: data })
            }}
          >
            상세정보
          </button>
        }
      </td>
    </tr>
  )
}

export default Item