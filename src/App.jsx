import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewGame from "./pages/NewGame";
import Home from "./pages/Home";
import Results from "./pages/Results";

function App() {
  return (
    <div className="main">
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/felvetel" element={<NewGame />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
