export type CtpDailyTimetable = {
  routeName: string;
  routeLongName: string;
  dayType: string;
  validFromDate: string;
  inStopName: string;
  outStopName: string;
  inStopTimes: string[];
  outStopTimes: string[];
};
