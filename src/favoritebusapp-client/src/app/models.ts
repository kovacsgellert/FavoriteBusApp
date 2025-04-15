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

export type TranzyVehicle = {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
  routeId: number;
  tripId: string;
  vehicleType: number;
  bikeAccessible: string;
  wheelchairAccessible: string;
};
