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
import { createGlobalStyle } from "styled-components";
import icon from "../../assets/img/hh.svg";

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
const Pont = styled.p`
  color: #000;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 125% */
  letter-spacing: 0.1px;
  margin-right: 20px;
`;
const Universe = styled.div`
  width: 1026px;
  /* height: 957px; */
  flex-shrink: 0;
  background: #ffffff;
  /* display: flex; */
  flex-direction: center;
  align-items: center;
  padding-left: 189px;
`;
const Up = styled.div`
  align-items: center;
`;
const Check = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;
const Cancel = styled.button`
  margin-top: 10px;
  height: 38px;

  border-radius: 100px;
  border: 1px solid #000;
  background: #cecccc;
  cursor:pointer;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Top = styled.div`
  width: 483px;
  height: 145px;
  /* margin-top: 42px; */
  /* margin-left: 188px; */
  background: #38373c;
  color: #ffffff;
  display: flex;

  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: #fff;
  text-align: center;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 120% */
`;

const Table = styled.table`
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
    display: none;
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
const ClientMeet = () => {
  const [user, setUser] = useState("");
  const [selectedTime, setSelectedTime] = useState(-1);
  const [reservationList, setReservationList] = useState([]);
  const [reserveTF, setReserveTF] = useState(Array().fill(false));
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
    setReserveTF(Array(40).fill(false));

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

        alert("면담 예약이 취소 되었습니다.");
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
      <GlobalStyle />
      <Universe>
        <Row>
          <Up>
            <Check>
              {user.meetTF ? (
                <Pont>예약한 시간: {user.meetTime}</Pont>
              ) : (
                <Pont>예약된 정보가 없습니다.</Pont>
              )}
              <Cancel onClick={deleteMeet}>예약 취소하기</Cancel>
            </Check>

            <Top> 가능한 시간을 선택하세요. </Top>
            <Table>
              <tbody>
                {times.map((item, index) => (
                  <tr key={index}>
                    <TableCell
                      style={{
                        backgroundColor: reserveTF[index]
                          ? "#48474E"
                          : selectedTime === index
                          ? "#F4F4F4"
                          : "",
                        cursor: reserveTF[index] ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        handleSelectTime(index);
                      }}
                    >
                      {reservationList[index] &&
<<<<<<< HEAD
                  reservationList[index].access === "client"
                    ? item + " " + reservationList[index].name
                    : item}
=======
                      reservationList[index].access === "client"
                        ? item + " " + reservationList[index].name
                        : item}
>>>>>>> main
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Up>
          <Box>
            <Text>상담 예약 날짜</Text>
            <TextNIcon>
              {" "}
              <Text2>날짜 선택 </Text2>
              <IconImg src={icon} />{" "}
            </TextNIcon>

            <DateSelect type="date" onChange={handleSelectDate} />

            <ConfirmWrapper>
              <Confirm onClick={checkTime}>확인</Confirm>
            </ConfirmWrapper>
          </Box>
        </Row>
        <Reserve onClick={reserveMeet}>확인</Reserve>
      </Universe>

      {/* <button onClick={checkTime}>조회</button>
       */}
    </Div>
  );
};

export default ClientMeet;
