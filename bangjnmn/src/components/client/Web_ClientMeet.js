import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, doc, updateDoc } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { useNavigate } from "react-router-dom";

const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid black;
  width: 200px; /* 원하는 표 너비 설정 */
`;

const TableCell = styled.td`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  cursor: pointer;
`;

const ClientMeet = () => {
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [name, setName] = useState("");
  const [reserved, setReserved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {}, []);
  const times = Array.from({ length: 19 }, (_, index) => {
    const startTime = 9 * 60;
    const interval = 30;

    const minutes = startTime + index * interval;
    const hours = Math.floor(minutes / 60);
    const minutesOfDay = minutes % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutesOfDay.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  });

  // 클릭 이벤트 핸들러 함수
  const handleCellClick = (index) => {
    if (clickedIndex === index) {
      setClickedIndex(-1);
    } else {
      setClickedIndex(index);
    }
  };

  const reserveMeet = () => {
    if (reserved == false) {
      const stuCollection = collection(dbService, "studentUser");
      const stuRef = doc(stuCollection, "윤성현");
      updateDoc(stuRef, {
        meetTime: clickedIndex,
        meetTF: true,
      });
      setReserved(true);
      console.log(clickedIndex);
    } else {
      alert("이미 예약하셨습니다");
    }
  };

  return (
    <div>
      <Table>
        <tbody>
          {times.map((item, index) => (
            <tr key={index}>
              <TableCell
                style={{
                  backgroundColor: clickedIndex === index ? "lightblue" : "",
                }}
                onClick={() => handleCellClick(index)}
              >
                {item}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={reserveMeet}>예약하기</button>
    </div>
  );
};

export default ClientMeet;
