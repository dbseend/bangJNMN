import React from 'react'
import { useNavigate } from 'react-router-dom'
import  styled  from "styled-components";

const TableRow = styled.tr`
  border: 1px solid #000;
`;

const TableCell = styled.td`
  padding: 8px;
`;

const Item = ({ data }) => {
  console.log(data)
  const navigate = useNavigate()
  return (
    <TableRow>
        <TableCell>{data.name}</TableCell>
        <TableCell>{data.stuNum}</TableCell>
        <TableCell>{data.team}</TableCell>
        <TableCell>{data.major}</TableCell>
        <TableCell>{data.birth}</TableCell>
        <TableCell>{data.roommateNum}</TableCell>
        <TableCell>
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
        </TableCell>
  </TableRow>
  )
}

export default Item