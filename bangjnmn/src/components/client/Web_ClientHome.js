import React, { useEffect } from "react";
import styled from "styled-components";
import { onReadUserData } from "../../utils/AccountStatus";
import { useNavigate } from "react-router-dom";

const ClientHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onReadUserData(navigate);
  }, [navigate]);

  return (
    <div>
      <h1>ClientHome</h1>
    </div>
  );
};

export default ClientHome;
