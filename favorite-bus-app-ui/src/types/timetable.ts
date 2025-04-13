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

export const DAY_TYPES = {
    Weekdays: 'Weekdays',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
};

