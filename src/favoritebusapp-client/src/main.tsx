import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyTimtable from "./pages/daily/DailyTimetable.tsx";
import "./index.css";
import WeeklyTimetable from "./pages/weekly/WeeklyTimetable.tsx";
import Home from "./pages/home/Home.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/t/*" element={<DailyTimtable />} />
        <Route path="/w/*" element={<WeeklyTimetable />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
