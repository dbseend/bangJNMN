import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";

const AdminHome = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser);
  }, []);
  return (
    <div>
      <h1>AdminHome</h1>
    </div>
  );
};

export default AdminHome;
