import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";

const AdminRoom = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser);
  }, []);
  return (
    <div>
      <h1>AdminRoom</h1>
    </div>
  );
};

export default AdminRoom;
