import React, { useState, useEffect } from "react";
import  styled  from "styled-components";
import Select from 'react-select';
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { auth, dbService } from "../../api/fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";





const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
   /* 배경색 및 투명도 설정 */
  background-color: rgba(0, 0, 0, .5);

   /* 중앙 정령 */
  display: flex;
  align-items: center;
  justify-content:center;
`

const ModalContent = styled.div`
  background-color:white; 
  padding :20px;
`

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
  margin-bottom: 30%;
`

function DataList() {
  const [data, setData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          const dataCollection = await dbService.collection('collectionName').get();
          setData(dataCollection.docs.map(doc => doc.data()));
      };
      fetchData();
  }, []);

  return (
    <ul>
        {data.map((item, index) => (
            <li key={index}>
                {item.fieldName}
            </li>
        ))}
    </ul>
);
}


const Web_AdminSearch = () => {
  
  const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = await dbService.collection('collectionName').get();
            setData(dataCollection.docs.map(doc => doc.data()));
        };
        fetchData();
    }, []);

  const options = [
    { value: 'name', label: 'Name' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'team', label: 'Team' }
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const options = ["Option 1", "Option 2", "Option 3"];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    
    // 전달된 콜백 함수 호출하여 실제로 검색 작업 수행
    //onSearch(searchTerm);
    
    // 필요한 로직 추가

    // 예시: 폼 제출 후에는 입력값 초기화
    setSearchTerm('');
  };

  return (
    <Div> 
      <h1>AdminSearch</h1>
        <Search>
          <Select 
              options={options} 
              onChange={setSelectedOption}
              placeholder="Select a search type"
          />
          <input
              style={{ marginLeft: '8px' }}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="검색어 입력"
          />
          <button type="submit" style={{ marginLeft: '8px' }}>
          🔍
          </button>
        </Search>

        {/* Data list */}
        <ul>
                {data.map((item,index) => (
                    <li key={index}>
                        {"이름"}
                        {item.name}
                    </li>
                ))}
            </ul>
      
        {/* <div>테이블 띄우기</div>
          
        <div>
          <button onClick={handleButtonClick}>모달 열기</button>
          {isModalOpen && (
            <ModalContainer onClick={handleCloseModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>모달 제목</h2>
            <p>모달 내용...</p>
            <button onClick={handleCloseModal}>닫기</button>
            </ModalContent>
            </ModalContainer>
          )}
        </div> */}
      
      </Div>

    
  );
};

export default Web_AdminSearch;
