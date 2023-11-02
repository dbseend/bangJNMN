import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { dbService } from "../../api/fbase";
import { checkStatus } from "../../utils/CheckStatus";

const ClientMyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    checkStatus(setUserData);
  }, [isModified]);

  const handleEdit = () => {
    setEditMode(true);
    setPhoneNumber(userData ? userData.phoneNumber : ""); // 전화번호 수정 모드 진입 시 기존 번호를 표시
  };

  const handleFieldChange = (e) => {
    const newPhoneNumber = e.target.value;
    const phoneNumberPattern = /^010\d{4}\d{4}$/;
  
    setPhoneNumber((prevPhoneNumber) => {
      // Use the previous state to update the new state
      if (newPhoneNumber === "" || phoneNumberPattern.test(newPhoneNumber)) {
        setErrorMessage("");
      } else {
        setErrorMessage("   올바른 형식이 아닙니다.");
      }
  
      return newPhoneNumber; // Update the state with the new value
    });
  };  

  const handleSave = async () => {
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      const docRef = doc(dbService, "user", userData.name);
      await updateDoc(docRef, { phoneNumber: phoneNumber });
      alert("전화번호 정보가 변경되었습니다.");
      setEditMode(false);
    } catch (error) {
      console.error("전화번호 정보 업데이트 오류:", error);
      alert("전화번호 정보 변경에 실패했습니다.");
    }
  };

  const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    background: #F4F4F4;
    position: relative;
    z-index: 1;
    margin-top: 8px;
  `;

  const Rect1 = styled.div`
    width: 770px;
    max-width: 100%;
    height: 686.212px;
    flex-shrink: 0;
    background: white;
    margin: 0 auto;
  `;

  const Table = styled.div`
    margin-left: 166px;
    width: 480px;
    height: 37px;
    flex-shrink: 0;
    border: 1px solid #000;
    background: #fff;
    display: flex;
  `;

  const Button = styled.button`
    cursor: pointer;
  `;

  const Font1 = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 22px;
    margin-left: 166px;
    margin-top: 30px;
    text-align: left;
    color: black;
    margin-bottom: 26px;
    text-decoration: underline;
  `;

  const Font2 = styled.div`
    font-family: Roboto;
    font-size: 12.3px;
    font-style: normal;
    font-weight: 400;
    line-height: 15.5px;
    margin-top: 4px;
    margin-left: 166px;
    margin-bottom: 19px;
    //text-align: left;
    color: black;
  `;

  const Title = styled.div`
    font-family: Roboto;
    font-size: 17px;
    font-style: normal;
    font-weight: 700;
    line-height: 15.5px;
    margin-top: 10px;
    margin-left: 10px;
    width: 100px;
    color: black;
    justify-content: center;
    display: inline; /* 이 부분을 추가하세요 */
  `;

  const Info = styled.div`
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 15.5px;
    margin-top: 10px;
    margin-left: 45px; /* Info의 왼쪽 마진을 조절하세요 */
    color: black;
    display: inline; /* 이 부분을 추가하세요 */
  `;

  const Between = styled.div`
    margin-left: 20px;
  `;

  return (
    <Div>
      <Rect1>
        <Font1>마이페이지</Font1>
        <Font2>
          교내 행정부서에서 공지사항 등의 정보를 학생분들께 문자메세지나
          이메일로 보낼 때에<br></br> 본 화면(기본정보)에 입력된 연락처 정보를
          이용하고 있습니다.<br></br> 따라서, 전화번호와 이메일주소를 항상
          본인이 사용하고 있는 최신 정보로 유지해 주시기 바랍니다.
        </Font2>
        <Table>
          <Title>담당 간사님</Title>
          <Info> 최병호/김민정 간사님</Info>
        </Table>

        <Table>
          <Title>이름</Title>{" "}
          <Info> {userData ? userData.name : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>학번</Title>{" "}
          <Info> {userData ? userData.stuNum : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>이메일</Title>{" "}
          <Info>{userData ? userData.email : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>성별</Title>
          <Info>{userData ? userData.gender : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>학부</Title>{" "}
          <Info>{userData ? userData.major : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>전화번호</Title>{" "}
          <Info>
            {editMode ? (
              <div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handleFieldChange}
                  placeholder="ex) 01012345678"
                  autoFocus
                />
                <Button onClick={handleSave}>저장</Button>
                <span style={{ color: "red", fontSize: "12px" }}>{errorMessage}</span>
              </div>
            ) : userData ? (
              userData.phoneNumber ? (
                userData.phoneNumber
              ) : (
                "전화번호 없음"
              )
            ) : (
              "로딩 중..."
            )}
            {editMode ? null : <Button onClick={handleEdit}>수정</Button>}
          </Info>
        </Table>
        <Table>
          <Title>생년월일 </Title>
          <Info>{userData ? userData.birth : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>RC</Title>
          <Info> {userData && userData.rc ? userData.rc : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>팀</Title>{" "}
          <Info>
            {userData && userData.team ? userData.team : "로딩 중..."}
          </Info>
        </Table>
        <Table>
          <Title>인실</Title>{" "}
          <Info>{userData ? userData.roommateNum : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>기숙사 </Title>
          <Info>{userData ? userData.dorm : "로딩 중..."}</Info>
        </Table>
        <Table>
          <Title>방호수</Title> <Info>407호</Info>
        </Table>
      </Rect1>
    </Div>
  );
};

export default ClientMyPage;