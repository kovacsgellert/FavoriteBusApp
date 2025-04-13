import axios from 'axios';
import { CtpWeeklyTimeTable, DAY_TYPES } from '../types/timetable';

const API_BASE_URL = 'https://localhost:5001';

export const fetchWeeklyTimetable = async (lineNumber: string): Promise<CtpWeeklyTimeTable> => {
    try {
        const response = await axios.get<CtpWeeklyTimeTable>(`${API_BASE_URL}/api/timetable/weekly/${lineNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        throw error;
    }
};

export const getDayTypeOfToday = (): string => {
    const day = new Date().getDay();
    if (day === 0)
        return DAY_TYPES.Sunday;
    if (day === 6)
        return DAY_TYPES.Saturday;

    return DAY_TYPES.Weekdays;
}; 