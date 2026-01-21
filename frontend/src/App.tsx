import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FormList from "./pages/FormList";
import FormEditor from "./pages/FormEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormList />} />
        <Route path="/forms/new" element={<FormEditor />} />
        <Route path="/forms/:id/edit" element={<FormEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
