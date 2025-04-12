import React, { useEffect, useState } from 'react';
import './App.css';
import { CtpWeeklyTimeTable, DAY_TYPES as DAY_TYPES } from './types/timetable';
import { fetchWeeklyTimetable, getDayTypeOfToday as getDayTypeOfToday } from './services/timetableService';
import DailyTimetable from './components/DailyTimetable';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [weeklyTimetable, setWeeklyTimetable] = useState<CtpWeeklyTimeTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTimetableData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeeklyTimetable('25');
        setWeeklyTimetable(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch timetable data:', err);
        setError('Failed to load timetable data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTimetableData();
  }, []);

  const todayType = getDayTypeOfToday();

  return (
    <ThemeProvider>
      <div className="App">
        <ThemeToggle />
        <main className="App-content">
          {loading && <div className="loading">Loading timetable data...</div>}

          {error && <div className="error">{error}</div>}

          {weeklyTimetable && todayType === DAY_TYPES.WEEKDAY && (
            <div className="timetables-container">
              <DailyTimetable
                timetable={weeklyTimetable.weekDays}
                title="Weekdays Timetable"
              />
            </div>
          )}

          {weeklyTimetable && todayType === DAY_TYPES.SATURDAY && (
            <div className="timetables-container">
              <DailyTimetable
                timetable={weeklyTimetable.saturday}
                title="Saturday Timetable"
              />
            </div>
          )}

          {weeklyTimetable && todayType === DAY_TYPES.SUNDAY && (
            <div className="timetables-container">
              <DailyTimetable
                timetable={weeklyTimetable.sunday}
                title="Sunday Timetable"
              />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
