import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { useNavigate } from "react-router-dom";

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
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [name, setName] = useState("");
  const [reserved, setReserved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const currentPath = window.location.pathname;

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("로그인 되어있습니다.");
          setName(user.displayName);
          const stuRef = doc(dbService, "studentUser", user.displayName);
          const stuSnap = await getDoc(stuRef);
          if (stuSnap.exists()) {
            setReserved(stuSnap.data().meetTF);
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

    const fetchAllData = async () => {
      const data = await getDocs(collection(dbService, "studentUser"));
      const newData = data.docs.map((doc) => ({ ...doc.data() }));
      setAllUserData(newData);
      console.log(newData);
    };

    checkStatus();
    fetchAllData();
  }, []);

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
    }
    if (reserved == true) {
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
