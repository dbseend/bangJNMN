import React, { useState } from "react";

const Web_AdminSearch = ({ isOpen, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        {/* 모달 내용 */}
        <h2>모달 제목</h2>
        <p>모달 내용...</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Web_AdminSearch;