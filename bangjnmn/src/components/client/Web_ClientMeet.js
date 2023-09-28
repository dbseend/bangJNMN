import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClientMeet = () => {
  const [day, setDay] = useState("");
  const [selectTime, setSelectTime] = useState("");
  const [reservedTime, setReservedTime] = useState([]);
  const [rows, setRows] = useState(Array(10).fill(false));

  useEffect(() => {
    // 예시 시간 데이터 5개 생성
    const exampleTimes = ["09:00", "10:30", "13:00", "15:30", "17:00"];

    // 생성된 데이터를 selectTime 상태에 저장
    setSelectTime(exampleTimes);
  }, []);

  const handleClick = (index) => {
    const newRows = [...rows];
    newRows[index] = !newRows[index];
    setRows(newRows);
  };

  const changeDay = (e) => {
    setDay(e.target.value);
  };
  return (
    <Div>
      <h1>ClientMeet</h1>
      <label for="birth">원하는 면담 날짜</label>
      <input type="date" onSelect={changeDay} />
      <br />
      <h1>{day}</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            <p>시간</p>
            {rows.map((isGreen, index) => (
              <tr
                key={index}
                onClick={() => handleClick(index)}
                style={{ backgroundColor: isGreen ? "green" : "white" }}
              >
                <td>행 {index + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
      </div>
    </Div>
  );
};

export default ClientMeet;
