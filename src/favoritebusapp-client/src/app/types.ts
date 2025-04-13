export type CtpWeeklyTimetable = {
  routeName: string;
  routeLongName: string;
  dailyTimetables: DailyTimetable[];
};

export type DailyTimetable = {
  routeName: string;
  routeLongName: string;
  dayType: string;
  validFromDate: string;
  inStopName: string;
  outStopName: string;
  inStopTimes: string[];
  outStopTimes: string[];
};
