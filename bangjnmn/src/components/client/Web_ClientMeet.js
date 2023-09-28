import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onReadUserData } from "../../utils/AccountStatus";

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
  const startTime = 9 * 60; // 09:00를 분 단위로 표현
  const interval = 30; // 30분 간격

  const navigate = useNavigate();

  useEffect(() => {
    onReadUserData(navigate);
  }, [navigate]);

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
      <table border="1">
        <tbody>
          {[...Array(20)].map((_, rowIndex) => {
            // 각 행에 대한 시간 계산
            const minutes = startTime + rowIndex * interval;
            const hours = Math.floor(minutes / 60);
            const minutesOfDay = minutes % 60;

            // 시간을 2자리 숫자로 표현 (예: 09, 10, 11)
            const formattedHours = hours.toString().padStart(2, "0");
            const formattedMinutes = minutesOfDay.toString().padStart(2, "0");

            // 행에 시간을 표시
            const timeLabel = `${formattedHours}:${formattedMinutes}`;

            return (
              <tr key={rowIndex}>
                <td>{timeLabel}</td>
                {/* 내용이 비어있는 열 */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Div>
  );
};

export default ClientMeet;
