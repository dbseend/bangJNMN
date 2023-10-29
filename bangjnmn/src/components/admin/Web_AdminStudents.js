import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";

const AdminStudents = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  return (
    <div>
      <h1>AdminStudents</h1>
    </div>
  );
};

export default AdminStudents;
