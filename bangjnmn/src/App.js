import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SelectMode from "./pages/SelectMode";
import AdminHome from "./pages/admin/AdminHome";
import AdminMeet from "./pages/admin/AdminMeet";
import AdminRoom from "./pages/admin/AdminRoom";
import AdminSurvey from "./pages/admin/AdminSurvey";
import ClientHome from "./pages/client/ClientHome";
import ClientSurvey from "./pages/client/ClientSurvey";
import ClientMeet from "./pages/client/ClientMeet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectMode />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/client/*" element={<ClientRoutes />} />
      </Routes>
    </Router>
  );
}

// 관리자 페이지
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="survey" element={<AdminSurvey />} />
      <Route path="meet" element={<AdminMeet />} />
      <Route path="room" element={<AdminRoom />} />
    </Routes>
  );
}

// 학생 페이지
function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientHome />} />
      <Route path="survey" element={<ClientSurvey />} />
      <Route path="meet" element={<ClientMeet />} />
    </Routes>
  );
}

export default App;
