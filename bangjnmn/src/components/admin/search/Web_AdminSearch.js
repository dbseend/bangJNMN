import { collection, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { dbService } from "../../../api/fbase";
import { checkStatus } from "../../../utils/CheckStatus";
import Item from "./Web_Item";

const Back = styled.div`
  background: #cecccc;
  margin-top: 7px;
  height: 100vh;
`;

const Table = styled.table`
  border-collapse: separate; // 변경된 부분
  border-spacing: 0;
`;  

const TableHeaderRow = styled.tr`
  border: none;
`;

const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100vh;
    max-width: 1000px; // 중앙 박스의 최대 너비 설정
    margin: 0 auto; // 중앙 정렬
    overflow: hidden;
    background-color: white;
  `;

const Search = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 30%;
  margin-bottom: 10%;
`;




const Web_AdminSearch = () => {
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 새로운 상태 변수
  const [selectedOption, setSelectedOption] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const userCollection = collection(dbService, "user");

  useEffect(() => {
    checkStatus(setUser);
    async function getUsers() {
      const data = await getDocs(userCollection);
      console.log(doc);
      setData(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    getUsers();
  }, [data.length]);

  const options = [
    { value: "name", label: "이름" },
    { value: "stuNum", label: "학번" },
    { value: "team", label: "팀" },
  ];

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (selectedOption && searchTerm) {
      let filteredUsers;

      filteredUsers = data.filter(
        (user) =>
          user[selectedOption] &&
          user[selectedOption].toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredData(filteredUsers);
    } else {
      // 선택된 옵션이 없거나 검색어가 없으면 필터링된 데이터를 초기화
      setFilteredData([]);
    }
  };

  return (
    <Back>
    <Div>
      <h1>학생 정보 조회</h1>
      <Search onSubmit={handleSearchSubmit}>
        <Select
          options={options}
          onChange={(option) => setSelectedOption(option.value)}
          placeholder="Select a search type"
        />

        <input
          style={{ marginLeft: "8px" }}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="검색어 입력"
        />
        <button
          type="submit"
          style={{ marginLeft: "8px" }}
        >
          🔍
        </button>
      </Search>

      <div>
      {filteredData.length > 0 && (
        <Table>
            <TableHeaderRow>
              <th>이름</th>
              <th>학번</th>
              <th>팀</th>
              <th>학부</th>
              <th>생년월일</th>
              <th>호실</th>
            </TableHeaderRow>
          
          <tbody>
            {filteredData.map((user, idx) => {
              // change 'data' to 'filteredData'
              return <Item key={idx} data={user} />;
            })}
          </tbody>
        </Table>
      )}
      </div>
    </Div>
    </Back>
    
  );
};

export default Web_AdminSearch;