import React from 'react';
import { CtpDailyTimetable } from '../types/timetable';
import './DailyTimetable.css';

interface DailyTimetableProps {
    timetable: CtpDailyTimetable;
    title: string;
}

const DailyTimetable: React.FC<DailyTimetableProps> = ({ timetable, title }) => {
    return (
        <div className="timetable-container">
            <h2>{title}</h2>
            <h3>{timetable.routeLongName}</h3>

            <div className="timetable-table">
                <div className="timetable-header">
                    <div className="timetable-content">
                        <div className="timetable-column">{timetable.inStopName}</div>
                        <div className="column-separator"></div>
                        <div className="timetable-column">{timetable.outStopName}</div>
                    </div>
                </div>

                <div className="timetable-content">
                    <div className="timetable-column">
                        <div className="timetable-times">
                            {timetable.inStopTimes.map((time, index) => (
                                <div key={index} className="time-item">
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="column-separator"></div>

                    <div className="timetable-column">
                        <div className="timetable-times">
                            {timetable.outStopTimes.map((time, index) => (
                                <div key={index} className="time-item">
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyTimetable;