import { collection, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { dbService } from "../../../api/fbase";
import { checkStatus } from "../../../utils/CheckStatus";
import Item from "./Web_Item";
import { components } from "react-select";

const Back = styled.div`
  background: #cecccc;
  margin-top: 7px;
  height: 100vh;
`;

const Head = styled.h3`
  color: #000;
  padding-top: 41px;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 80% */
  letter-spacing: 0.5px;
  text-decoration-line: underline;
  margin-bottom: 25px;
  padding-left: 85px;
  padding-right: 168px;
`

const SH = styled.p`
  color: #000;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  //line-height: 39px; /* 260% */
  letter-spacing: 0.5px;
  margin-bottom: 48px;
  padding-left: 85px;
  padding-right: 168px;
`

const Table = styled.table`
  border-collapse: separate; // 변경된 부분
  border-spacing: 0;
`;  

const TableContainer = styled.div`
  height: 700px; // 원하는 높이로 설정
  overflow: auto;
  margin-bottom: 50px;
  padding-left: 85px;
`;

const Divh = styled.th`
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  border-left: 1px solid #000;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 16px;
  width: 110px;
  text-align: left;
`;

const Divh1 = styled.th`
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 16px;
  width: 110px;
  text-align: left;
`;

const Divh2 = styled.th`
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  color: transparent;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 16px;
  width: 100px;
  text-align: left;
`;

const Divh3 = styled.th`
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 16px;
  width: 70px;
  text-align: left;
`;



const Div = styled.div`
    display: flex;
    flex-direction: column;
    //align-items: center;
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
  position: relative;
  width: 30%;
  margin-bottom: 10%;
  margin-left: 85px;
  width: 500px; 
  
`;

const SearchInput = styled.input`
  margin-left: 50px;
  width: 490px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #000; // 테두리 색상을 검정색으로 설정
  box-shadow: none; // 그림자를 제거
  padding-right: 40px; // 돋보기 아이콘을 위한 공간 확보
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px; // 아이콘의 위치 조정
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
`;



const Web_AdminSearch = () => {
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 새로운 상태 변수
  const [selectedOption, setSelectedOption] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [isClearClicked, setIsClearClicked] = useState(false);
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

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <button
            onClick={(event) => {
              //event.preventDefault();
              setIsClearClicked(true);
              setSelectedOption(null);
            }}
            style={{ border: "none", background: "none" }} // 스타일 추가
          >
            X
          </button>
        </components.DropdownIndicator>
      )
    );
  };

  const SelectContainer = styled.div`
    width: 500px;
  `;
  
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  return (
    <Back>
    <Div>
      <Head>학생 정보 조회</Head>
      <SH>학생의 정보를 검색할 수 있습니다.</SH>
      <Search onSubmit={handleSearchSubmit}>
        <SelectContainer>
          <Select
          options={options}
          value={options.find(option => option.value === selectedOption)}
          onChange={(option) => {
            if (isClearClicked) {
              setSelectedOption(null);
              setIsClearClicked(false);
            } else {
              setSelectedOption(option ? option.value : null);
            }
          }}
          placeholder="선택"
          components={{ DropdownIndicator }}
          styles={{ 
            //container: (base) => ({ ...base, width: "500px" }),
            control: (base) => ({ ...base, borderColor: '#000', boxShadow: 'none' }) // 테두리 스타일 설정
          }}
        />
        </SelectContainer>
        
        
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="검색어 입력"
        />
        <SearchButton type="submit">
          🔍
        </SearchButton>
      </Search>

      <TableContainer>
      {filteredData.length > 0 && (
        <Table>
            <thead>
                <Divh>이름</Divh>
                <Divh1>학번</Divh1>
                <Divh1>팀</Divh1>
                <Divh1>학부</Divh1>
                <Divh1>생년월일</Divh1>
                <Divh3>인실</Divh3>
                <Divh2>상세보기</Divh2>
            </thead>
          <tbody>
            {filteredData.map((user, idx) => {
              // change 'data' to 'filteredData'
              return <Item key={idx} data={user} />;
            })}
          </tbody>
        </Table>
      )}
      </TableContainer>
    </Div>
    </Back>
    
  );
};

export default Web_AdminSearch;