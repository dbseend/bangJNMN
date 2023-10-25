import React, { useState, useEffect } from "react";
import  styled  from "styled-components";
import Select from 'react-select';
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { auth, dbService } from "../../../api/fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Item from "./Web_Item";


const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
`;

const Search = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 30%;
  margin-bottom: 10%;
`



const Web_AdminSearch = () => {
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 새로운 상태 변수
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userCollection = collection(dbService, "user")

  useEffect(() => {
    async function getUsers() {
      const data = await getDocs(userCollection)
      console.log(data)
      setData(data.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    getUsers()
  }, [data.length])

  // useEffect(() => {
  //   if (selectedOption && searchTerm) {
  //     // 선택된 옵션과 검색어에 따라 데이터 필터링
  //     const filteredUsers = data.filter((user) =>
  //       user[selectedOption].includes(searchTerm)
  //     );
  //     setFilteredData(filteredUsers);
  //   } 
  //   //else {
  //   //   // 선택된 옵션이 없거나 검색어가 없으면 모든 데이터 표시
  //   //   setFilteredData(data);
  //   // }
  // }, [selectedOption, searchTerm]);

  const options = [
    { value: 'name', label: '이름' },
    { value: 'stuNum', label: '학번' },
    { value: 'team', label: '팀' }
  ];

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {

    if (selectedOption && searchTerm) {
      let filteredUsers;
    
      if (selectedOption === 'team') {
        // 'team'이 선택된 경우
        filteredUsers = data.filter((user) =>
          user[selectedOption].value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        // 'name'이나 'stuNum'이 선택된 경우
        filteredUsers = data.filter((user) =>
          user[selectedOption].toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredData(filteredUsers);
    } else {
      // 선택된 옵션이 없거나 검색어가 없으면 필터링된 데이터를 초기화
      setFilteredData([]);
    }
  };

  return (
    <Div> 
      <h1>AdminSearch</h1>
        <Search>
          <Select 
              options={options} 
              onChange={(option) => setSelectedOption(option.value)}
              placeholder="Select a search type"
          />
          
          <input
              style={{ marginLeft: '8px' }}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="검색어 입력"
          />
          <button type="submit" style={{ marginLeft: '8px' }} onClick={handleSearchSubmit}>
          🔍
          </button>
        </Search>

      <div>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>팀</th>
            <th>학부</th>
            <th>생년월일</th>
            <th>호실</th>
          </tr>
        </thead>
        <tbody>
        {filteredData.map((user, idx) => {   // change 'data' to 'filteredData'
                return <Item key={idx} data={user} />
              })}
        </tbody>
      </table>
    </div>
      
    </Div>

    
  );
};

export default Web_AdminSearch;
