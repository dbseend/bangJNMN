import {
  collection,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { dbService } from "../../api/fbase";
import { checkStatus } from "../../utils/CheckStatus";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding: 0;
  }
  `;


const Div = styled.div`
  display: flex;
  flex-direction: row;
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
  const [selectedTime, setSelectedTime] = useState(-1);
  const [reservationList, setReservationList] = useState([]);
  const [reserveTF, setReserveTF] = useState(Array().fill(false));
  const [meetDate, setMeetDate] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const times = Array.from({ length: 40 }, (_, index) => formatTime(index));

  useEffect(() => {
    checkStatus(setUser);
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
    setReserveTF(Array(5).fill(false));

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

  // 1. 지난 날이면 안됨
  // 2. 예약 날짜 지나면 자동으로 예약여부는 F로
  // 3. 예약 기한 정하기
  const reserveMeet = async () => {
    const meetReservationRef = collection(dbService, "meet");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);
    const userRef = doc(collection(dbService, "user"), user.name);

    const date = meetDate;
    const time = formatTime(selectedTime);
    const meetTime = date + " " + time;
    const meetCreated = new Date();

    if (user.meetTF == true) {
      alert("이미 면담 예약하셨습니다!");
      return;
    }

    if (reserveTF[selectedTime]) {
      alert("이미 예약된 시간입니다!");
      return;
    }

    try {
      const dayUpdateData = {
        [selectedTime]: {
          time: selectedTime,
          name: user.name,
          access: "client",
          meetCreated: serverTimestamp(),
        },
      };

      await setDoc(dayRef, { ...dayUpdateData }, { merge: true });

      await updateDoc(userRef, {
        meetTF: true,
        meetTime: meetTime,
      });

      console.log("day 문서 업데이트 성공!");
      alert("예약이 완료되었습니다.");
    } catch (error) {
      console.error("day 문서 업데이트 실패: ", error);
      alert("예약에 실패했습니다.");
    }
  };

  const deleteMeet = async () => {
    try {
      const [year, month, day, time] = user.meetTime.split(" ")[0].split("-");
      const formattedMonth = parseInt(month, 10).toString();
      const formattedDay = parseInt(day, 10).toString();

      const meetReservationRef = collection(dbService, "meetReservation");
      const dayRef = doc(
        collection(meetReservationRef, formattedMonth, "day"),
        formattedDay
      );
      const userRef = doc(collection(dbService, "user"), user.name);
      const meetIdx = user.meetIdx;

      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초로 변환
      const reserveTime = user.meetCreated.seconds; // 예약 시간을 초로 가정합니다.
      const timeDiff = currentTime - reserveTime; // 시간 차이 계산
      const timeDiffHours = timeDiff / 3600;

      if (timeDiffHours < 24) {
        await updateDoc(dayRef, {
          [meetIdx]: deleteField(),
        });

        await updateDoc(userRef, {
          meetTF: false,
          meetTime: "",
        });
      } else {
        alert("취소 할 수 없습니다(24시간 이내 가능)");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSelectTime = (index) => {
    if (meetDate == "") {
      alert("날짜를 먼저 선택해주세요!");
    }
    if (meetDate != "") {
      if (selectedTime === index) {
        setSelectedTime(-1);
      } else {
        setSelectedTime(index);
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
      <GlobalStyle/>
      <div> 
        <div> 가능한 시간을 선택하세요. </div>
        <Table>
        <tbody>
          {times.map((item, index) => (
            <tr key={index}>
              <TableCell
                style={{
                  backgroundColor: reserveTF[index]
                    ? "red"
                    : selectedTime === index
                    ? "lightblue"
                    : "",
                  cursor: reserveTF[index] ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  handleSelectTime(index);
                }}
              ></TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      <div>
        <div> 상담 예약 날짜 </div>
        <input type="date" onChange={handleSelectDate} />
        <div> 
          <div> 취소 </div>
          <div onClick={checkTime}> 확인 </div>
        </div>
      </div>
      
      

      {/* <button onClick={checkTime}>조회</button> */}
      
      <button onClick={reserveMeet}>예약하기</button>
      {/* {user.meetTF ? (
        <p>예약한 시간: {user.meetTime}</p>
      ) : (
        <p>예약된 정보가 없습니다.</p>
      )}
      <button onClick={deleteMeet}>예약 취소하기</button> */}
    </Div>
  );
};

export default ClientMeet;
