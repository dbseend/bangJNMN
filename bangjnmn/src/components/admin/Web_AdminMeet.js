import {
  collection,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { dbService } from "../../api/fbase";
import icon from "../../assets/img/hh.svg";
import { checkStatus } from "../../utils/CheckStatus";

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
  background: #f4f4f4;
`;
const Universe = styled.div`
  width: 1026px;
  /* height: 100vh; */
  flex-shrink: 0;
  background: #ffffff;
  /* display: flex; */
  flex-direction: center;
  align-items: center;
  padding-left: 189px;
`;
const Title = styled.div`
  color: #000;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 80% */
  letter-spacing: 0.5px;
  text-decoration-line: underline;
  margin-top: 42px;
  margin-bottom: 16px;
`;

const Info = styled.div`
  color: #000;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 39px; /* 260% */
  letter-spacing: 0.5px;
`;
const Table = styled.table`
  margin-top: 16px;
  border-collapse: collapse;
  border: 1px solid black;
  width: 482px;
  height: 42px;
  flex-shrink: 0;
`;

const TableCell = styled.td`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  width: 482px;
  height: 42px;
  flex-shrink: 0;
`;
const Box = styled.div`
  position: fixed;
  top: 320px;
  /* right: 300px;  */
  width: 311px;
  height: 276px;
  background: #38373c;
  color: #ffffff;
  margin-left: 500px;
  border-radius: 28px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
`;
const TextNIcon = styled.div`
  display: flex;
  margin-bottom: 36px;
`;
const Text = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  /* font-weight: 500; */
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
  margin-bottom: 46px;
`;
const Text2 = styled.div`
  color: #fff;
  font-family: Roboto;
  font-size: 23px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 200% */
`;
const DateSelect = styled.input`
  width: 263px;
  height: 36px;
  background: transparent;
  display: flex;
  padding: 8px 0px 8px 16px;
  align-items: center;
  align-self: stretch;
  border-radius: 4px 4px 0px 0px;
  border: solid 1px #ffffff;
  border-color: #ffffff;
  color: #ffffff;
  margin-bottom: 24px;

  /* Hide the calendar icon in webkit-based browsers (Chrome, Safari) */
  &::-webkit-calendar-picker-indicator {
    //display: none;
  }
`;

const IconImg = styled.img`
  margin-left: 173px;
  /* display: flex; */
  /* padding: 16px 12px 8px 24px; */
  /* flex-direction: column;
align-items: flex-start;
gap: 36px;
align-self: stretch; */
`;
const ConfirmWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 24px;
  margin-top: 50px;
`;

const Confirm = styled.div`
  cursor: pointer;
  height: 20px;
  color: #fff;
  text-align: center;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  /* font-weight: 500; */
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.1px;
`;
const Reserve = styled.button`
  display: flex;
  width: 88px;
  height: 38px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 1px solid #000;
  background: #cecccc;
  margin-top: 28px;
  margin-left: 395px;
  margin-bottom: 25px;
`;

const AdminMeet = () => {
  const [user, setUser] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [reserveTF, setReserveTF] = useState(Array(18).fill(false));
  const [meetDate, setMeetDate] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const times = Array.from({ length: 18 }, (_, index) => formatTime(index));

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
    setReserveTF(Array(18).fill(false)); // 각 시간의 예약 여부를 모두 false로 초기화

    // 조회하고 싶은 날짜 문서 참조
    const meetReservationRef = collection(dbService, "meet");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);

    try {
      const docSnap = await getDoc(dayRef);
      if (docSnap.exists()) {
        const data = docSnap.data(); // 날짜에 해당하는 문서
        const list = Object.values(data); // 문서의 value 값들만 뽑아내기

        // reservationList와 reserveTF를 업데이트하는 루프
        for (let i = 0; i < list.length; i++) {
          if (list[i] && list[i].time >= 0 && list[i].time < 18) {
            const time = list[i].time;
            // reservationList를 업데이트
            reservationList[time] = list[i];
            // reserveTF를 업데이트
            setReserveTF((prevReserveTF) => {
              const updatedReserveTF = [...prevReserveTF];
              updatedReserveTF[time] = true;
              return updatedReserveTF;
            });
          }
        }

        console.log("Document data:", data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*
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
  */
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
  const reserveMeet = () => {
    const meetReservationRef = collection(dbService, "meetReservation");
    const dayRef = doc(collection(meetReservationRef, month, "day"), day);

    try {
      selectedTimes.forEach(async (selectedTime) => {
        const dayUpdateData = {
          [selectedTime]: {
            time: selectedTime,
            name: user.name,
            access: "admin",
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

      console.log(reserveTF[selectedIndex], selectedIndex);
      if (reserveTF[selectedIndex] === true) {
        alert("이미 선택된 시간입니다!");
      }
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
      <GlobalStyle />
      <Universe>
        <Title>면담 예약</Title>

        <Info>현재 페이지에서는 면담 예약 수정이 가능합니다.</Info>

        <Table>
          <tbody>
            {times.map((item, index) => (
              <tr key={index}>
                <TableCell
                  style={{
                    backgroundColor: reserveTF[index]
                      ? "#62606A"
                      : selectedTimes === index
                      ? "#F4F4F4"
                      : "",
                    cursor: reserveTF[index] ? "not-allowed" : "pointer",
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

        <Box>
          <Text>간사 일정 등록</Text>
          <TextNIcon>
            {" "}
            <Text2>예약 날짜 </Text2>
            <IconImg src={icon} />{" "}
          </TextNIcon>

          <DateSelect type="date" onChange={handleSelectDate} />

          <ConfirmWrapper>
            <Confirm onClick={checkTime}>확인</Confirm>
          </ConfirmWrapper>
        </Box>

        <Reserve onClick={reserveMeet}>예약하기</Reserve>
      </Universe>
    </Div>
  );
};

export default AdminMeet;
