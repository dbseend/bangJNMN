import React, { useState } from "react";
import Web_AdminSearch from "../../components/admin/Web_AdminSearch";

import { styled } from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
`;

const AdminSearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Option 1", "Option 2", "Option 3"];

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Div>
      <h1>AdminSearch</h1>
      <div>
        <span>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Close menu" : "Open menu"}
          </button>

          {isOpen && (
            <ul>
              {options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          )}
        </span>
        <div>테이블 띄우기</div>
        {/* 버튼 */}
        <button onClick={handleButtonClick}>모달 열기</button>
        {/* 모달 */}
        <Web_AdminSearch isOpen={isModalOpen} onClose={handleCloseModal} />
        클릭시 모달창 띄우기
      </div>
    </Div>
  );
};

export default AdminSearch;
