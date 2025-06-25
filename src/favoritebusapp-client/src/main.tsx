import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DailyTimtable from "./pages/daily/DailyTimetable.tsx";
import "./index.css";
import WeeklyTimetable from "./pages/weekly/WeeklyTimetable.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/t/25" replace />} />
        <Route path="/t/*" element={<DailyTimtable />} />
        <Route path="/w/*" element={<WeeklyTimetable />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
