import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { useNavigate } from "react-router-dom";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
`;

const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid black;
  width: 200px;
`;

const TableCell = styled.td`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  cursor: pointer;
`;

const ClientMeet = () => {
  const [allUserData, setAllUserData] = useState("");
  const [user, setUser] = useState("");
  const [meetDate, setMeetDate] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [reserved, setReserved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "studentUser", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUser(stuSnap.data());
          }
          if (
            localStorage.getItem("access") === "client" &&
            currentPath.includes("admin")
          ) {
            console.log("접근할 수 없습니다.");
            navigate("/client");
          }
        } else {
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);

  const times = Array.from({ length: 5 }, (_, index) => {
    const startTime = 9 * 60;
    const interval = 30;

    const minutes = startTime + index * interval;
    const hours = Math.floor(minutes / 60);
    const minutesOfDay = minutes % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutesOfDay.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  });

  const reserveMeet = () => {
    if (user.meet == false) {
      const stuCollection = collection(dbService, "studentUser");
      const stuRef = doc(stuCollection, user.name);
      updateDoc(stuRef, {
        meetTime: clickedIndex,
        meetTF: true,
      });
      setReserved(true);
      console.log(clickedIndex);
    }
    if (reserved == true) {
      alert("이미 예약하셨습니다");
    }
  };

  const handleSelectTime = (index) => {
    if (clickedIndex === index) {
      setClickedIndex(-1);
    } else {
      setClickedIndex(index);
    }
  };

  const handleSelectDate = (e) => {
    const dateObject = new Date(e.target.value);
    const month = (dateObject.getMonth() + 1).toString(); // 월 (0부터 시작하므로 1을 더함)
    const day = dateObject.getDate().toString(); // 일

    setMeetDate(e.target.value);
    setMonth(month);
    setDay(day);
  };

  const checkTime = async () => {
    /*
    meetReservation 컬렉션 -> 특정 달에 해당하는 문서 -> day 컬렉션 -> 특정 일에 해당하는 문서
    -> 면담시간, 면담 학생 맵 필드로 넣기
    */
    const meetCollection = collection(dbService, "meetReservation");
    const monthRef = doc(meetCollection, month);
    const dayCollection = collection(monthRef, "day");
    const dayRef = doc(dayCollection, day);
    
    const data = await getDoc(dayRef);
  };

  return (
    <Div>
      <h1>원하는 상담날짜</h1>
      <input type="date" onChange={handleSelectDate} />
      <button onClick={checkTime}>조회</button>
      <Table>
        <tbody>
          {times.map((item, index) => (
            <tr key={index}>
              <TableCell
                style={{
                  backgroundColor: clickedIndex === index ? "lightblue" : "",
                }}
                onClick={() => handleSelectTime(index)}
              >
                {item}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={reserveMeet}>예약하기</button>
    </Div>
  );
};

export default ClientMeet;
