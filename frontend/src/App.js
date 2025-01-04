import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};
export default App;
