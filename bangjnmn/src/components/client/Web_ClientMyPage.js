import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onReadUserData } from "../../utils/AccountStatus";

const ClientMyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onReadUserData(navigate);
  }, [navigate]);

  return (
    <div>
      <h1>ClientMyPage</h1>
    </div>
  );
};

export default ClientMyPage;
