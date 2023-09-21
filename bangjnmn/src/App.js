import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SelectMode from "./pages/SelectMode";
import AdminHome from "./pages/admin/AdminHome";
import ClientHome from "./pages/client/ClientHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectMode />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/client" element={<ClientHome />} />
      </Routes>
    </Router>
  );
}

export default App;
