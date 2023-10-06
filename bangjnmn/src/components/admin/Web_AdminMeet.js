import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";
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

const AdminMeet = () => {
  const [user, setUser] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(-1);
  const [reservationList, setReservationList] = useState([]);
  const [reserveTF, setReserveTF] = useState(Array(5).fill(false));
  const [meetDate, setMeetDate] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const times = Array.from({ length: 5 }, (_, index) => formatTime(index));
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          const stuRef = doc(dbService, "user", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setUser(stuSnap.data());
          }
          // if (
          //   localStorage.getItem("access") === "client" &&
          //   currentPath.includes("admin")
          // ) {
          //   console.log("접근할 수 없습니다.");
          //   navigate("/client");
          // }
        } else {
          console.log("로그인이 필요합니다.");
          navigate("/");
        }
      });
    };

    checkStatus();
  }, []);

  function formatTime(index) {
    const startTime = 9 * 60;
    const interval = 30;
    const minutes = startTime + index * interval;
    const hours = Math.floor(minutes / 60);
    const minutesOfDay = minutes % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutesOfDay.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  const checkTime = async () => {
    const meetReservationRef = collection(dbService, "meetReservation");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);

    try {
      const docSnap = await getDoc(dayRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const reservationList = Object.values(data);
        setReservationList(reservationList);

        reservationList.forEach((item) => {
          setReserveTF((prevReserveTF) => {
            const updatedReserveTF = [...prevReserveTF];
            updatedReserveTF[item.time] = true;
            return updatedReserveTF;
          });
        });

        console.log("Document data:", data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const reserveMeet = () => {
    const meetReservationRef = collection(dbService, "meetReservation");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);

    try {
      selectedTimes.forEach(async (selectedTime) => {
        const dayUpdateData = {
          [selectedTime]: {
            time: selectedTime,
            name: user.name,
          },
        };

        await setDoc(dayRef, { ...dayUpdateData }, { merge: true });
      });

      console.log("day 문서 업데이트 성공!");
      alert("예약이 완료되었습니다.");
    } catch (error) {
      console.error("day 문서 업데이트 실패: ", error);
      alert("예약에 실패했습니다.");
    }
  };

  const deleteMeet = async () => {
    const [year, month, day, time] = user.meetTime.split(" ")[0].split("-");
    const meetReservationRef = collection(dbService, "meetReservation");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);
    const userRef = doc(collection(dbService, "user"), user.name);
    const meetIdx = user.meetIdx;

    await updateDoc(dayRef, {
      [meetIdx]: deleteField(),
    });

    await updateDoc(userRef, {
      meetTF: false,
      meetTime: "",
      meetIdx: 0,
    });
  };

  const handleSelectTime = (index) => {
    if (meetDate == "") {
      alert("날짜를 먼저 선택해주세요!");
    }
    if (meetDate != "") {
      const selectedIndex = selectedTimes.indexOf(index);

      if (selectedIndex === -1) {
        setSelectedTimes([...selectedTimes, index]);
      } else {
        const newSelectedTimes = [...selectedTimes];
        newSelectedTimes.splice(selectedIndex, 1);
        setSelectedTimes(newSelectedTimes);
      }
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
      <h1>간사님 스케줄</h1>
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
                    : selectedTimes.includes(index)
                    ? "lightblue"
                    : "",
                  cursor: reservationList[index] ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  handleSelectTime(index);
                }}
              >
                {reservationList[index] &&
                reservationList[index].auth === "client"
                  ? item + reservationList[index].name
                  : item}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={reserveMeet}>예약하기</button>
      {user.meetTF ? (
        <p>예약한 시간: {user.meetTime}</p>
      ) : (
        <p>예약된 정보가 없습니다.</p>
      )}
      <button onClick={deleteMeet}>예약 취소하기</button>
    </Div>
  );
};

export default AdminMeet;
