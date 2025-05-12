// ...existing code from models.ts...
export type CtpWeeklyTimetable = {
  routeName: string;
  routeLongName: string;
  dailyTimetables: CtpDailyTimetable[];
};

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

export type TranzyVehicle = {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
  route_id: number;
  trip_id: string;
  vehicle_type: number;
  bike_accessible: string;
  wheelchair_accessible: string;
};
// ...existing code from models.ts...
