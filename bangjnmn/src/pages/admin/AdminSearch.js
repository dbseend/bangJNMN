import React, { useState } from "react";

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
    const [isOpen, setIsOpen] = useState(false);
    const options = ['Option 1', 'Option 2', 'Option 3'];

    return (
        <Div>
            <h1>AdminSearch</h1>
            <div>
              <span>
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close menu' : 'Open menu'}
              </button>

              {isOpen && (
              <ul>
                {options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              )}
              </span>
              <div>
                테이블 띄우기
              </div>
              클릭시 모달창 띄우기
            </div>
            

        </Div>
    )
}

export default AdminSearch;
