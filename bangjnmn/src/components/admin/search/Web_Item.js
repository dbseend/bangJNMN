
import React from 'react'
import { useNavigate } from 'react-router-dom'
import  styled  from "styled-components";

const TableRow = styled.tr`
  border: 1px solid #000;
`;

const TableCell = styled.td`
  padding: 8px;
`;

const Divh = styled.td`
  border-bottom: 1px solid #000;
  border-left: 1px solid #000;
  padding-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Divh1 = styled.td`
  border-bottom: 1px solid #000;
  padding-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Divh2 = styled.td`
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  padding-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Button = styled.button`
  all: unset;
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
  padding: 10px 18px 7px 16px;
  background: #CECCCC;

  &:hover {
    background: #A3A3A3; // 마우스를 올렸을 때의 배경색을 설정
  }
`;



const Item = ({ data }) => {

  function Room(roommateNum){
    if(roommateNum == "room4") return "4인실"
    if(roommateNum == "room2") return "2인실"
    if(roommateNum == "room1") return "1인실"
  }
  
  console.log(data)
  const navigate = useNavigate()
  return (
    <tr>
        <Divh>{data.name}</Divh>
        <Divh1>{data.stuNum}</Divh1>
        <Divh1>{data.team}</Divh1>
        <Divh1>{data.major}</Divh1>
        <Divh1>{data.birth}</Divh1>
        <Divh1>{Room(data.roommateNum)}</Divh1>
        <Divh2>
          {
            <Button
              onClick={() => {
                console.log(data.id)
                navigate(data.id, { state: data })
              }}
            >
              상세정보
            </Button>
          }
        </Divh2>
  </tr>
  )
}

export default Item;
