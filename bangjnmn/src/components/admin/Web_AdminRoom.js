import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/AccountStatus";

const AdminRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(navigate);
  }, [navigate]);

  return (
    <div>
      <h1>AdminRoom</h1>
    </div>
  );
};

export default AdminRoom;
