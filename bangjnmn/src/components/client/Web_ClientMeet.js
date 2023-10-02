import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
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
  const [user, setUser] = useState("");
  const [index, setIndex] = useState([]);
  const [reserveTF, setReserveTF] = useState(Array(5).fill(false));
  const [meetInfo, setMeetInfo] = useState("");
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

  const checkTime = async () => {
    const meetCollection = collection(dbService, "meetReservation");
    const monthRef = doc(meetCollection, month);
    const dayCollection = collection(monthRef, "day");
    const dayRef = doc(dayCollection, day);

    const docSnap = await getDoc(dayRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      const arr = Object.values(data);
      setIndex(arr);
      for (let i = 0; i < arr.length; i++) {
        reserveTF[arr[i].time] = true;
      }
    } else {
      console.log("No such document!");
      setMeetInfo("정보 없음");
    }

    console.log(reserveTF);
  };

  const reserveMeet = () => {
    const meetCollection = collection(dbService, "meetReservation");
    const monthRef = doc(meetCollection, month);
    const dayCollection = collection(monthRef, "day");
    const dayRef = doc(dayCollection, day);

    if (reserveTF[clickedIndex] == true) {
      alert("이미 예약된 시간입니다!");
    }

    setDoc(
      dayRef,
      {
        [clickedIndex]: {
          time: clickedIndex,
          name: user.name,
        },
      },
      { merge: true }
    )
      .then(() => {
        console.log("day 문서 업데이트 성공!");
        alert("예약이 완료되었습니다.");
      })
      .catch((error) => {
        console.error("day 문서 업데이트 실패: ", error);
        alert("예약에 실패했습니다.");
      });
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
    const month = (dateObject.getMonth() + 1).toString();
    const day = dateObject.getDate().toString();

    setMeetDate(e.target.value);
    setMonth(month);
    setDay(day);
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
                  backgroundColor: reserveTF[index]
                    ? "red"
                    : clickedIndex === index
                    ? "lightblue"
                    : "",
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
