export interface CtpDailyTimetable {
    routeName: string;
    routeLongName: string;
    validFromDate: Date;
    inStopName: string;
    outStopName: string;
    inStopTimes: string[];
    outStopTimes: string[];
}

export interface CtpWeeklyTimeTable {
    routeName: string;
    routeLongName: string;
    weekDays: CtpDailyTimetable;
    saturday: CtpDailyTimetable;
    sunday: CtpDailyTimetable;
}

export const TIMETABLE_TYPES = {
    WEEKDAY: 'WEEKDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY',
};

