import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onReadUserData } from "../../utils/AccountStatus";

const AdminRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onReadUserData(navigate);
  }, [navigate]);

  return (
    <div>
      <h1>AdminRoom</h1>
    </div>
  );
};

export default AdminRoom;
