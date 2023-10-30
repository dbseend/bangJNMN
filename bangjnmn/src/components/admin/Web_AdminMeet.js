import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { dbService } from "../../api/fbase";
import { checkStatus } from "../../utils/CheckStatus";

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
    setReserveTF(Array(5).fill(false)); // 각 시간의 예약 여부를 모두 false로 초기화

    // 조회하고 싶은 날짜 문서 참조
    const meetReservationRef = collection(dbService, "meetReservation");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);

    try {
      const docSnap = await getDoc(dayRef);
      if (docSnap.exists()) {
        const data = docSnap.data(); // 날짜에 해당하는 문서
        const list = Object.values(data); // 문서의 value 값들만 뽑아내기
        const newList = [...reservationList]; // reservationList 복사

        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (list[i] && list[i].time === j) {
              newList[j] = list[i];
            }
          }
        }
        console.log(newList);
        console.log(reservationList);
        setReservationList(newList);
        
        for (let i = 0; i < newList.length; i++) {
          const item = newList[i];
          setReserveTF((prevReserveTF) => {
            const updatedReserveTF = [...prevReserveTF];
            if (item) {
              updatedReserveTF[item.time] = true;
            } else {
              updatedReserveTF[i] = false;
            }
            return updatedReserveTF;
          });
        }

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
            access: user.access,
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
                reservationList[index].access === "client"
                  ? item + " " + reservationList[index].name
                  : item}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={reserveMeet}>예약하기</button>
    </Div>
  );
};

export default AdminMeet;
