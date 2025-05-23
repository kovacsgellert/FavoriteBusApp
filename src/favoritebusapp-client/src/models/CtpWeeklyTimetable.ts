import { CtpDailyTimetable } from "./CtpDailyTimetable";

export type CtpWeeklyTimetable = {
  routeName: string;
  routeLongName: string;
  dailyTimetables: CtpDailyTimetable[];
};
