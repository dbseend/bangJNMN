import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStatus } from "../../utils/CheckStatus";

const ClientHome = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus(setUser);
  }, []);

  return (
    <div>
      <h1>ClientHome</h1>
    </div>
  );
};

export default ClientHome;
