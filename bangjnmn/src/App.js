import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import AdminHome from "./pages/admin/AdminHome";
import AdminMeet from "./pages/admin/AdminMeet";
import AdminRoom from "./pages/admin/AdminRoom";
import AdminSurvey from "./pages/admin/AdminSurvey";
import ClientHome from "./pages/client/ClientHome";
import ClientSurvey from "./pages/client/ClientSurvey";
import ClientMeet from "./pages/client/ClientMeet";
import ClientMyPage from "./components/client/Web_ClientMyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
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
      <Route path="/meet" element={<ClientMeet />} />
      <Route path="/mypage" element={<ClientMyPage />} />
    </Routes>
  );
}

export default App;
