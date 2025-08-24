export enum MinistryServiceTime {
  Time0900 = '09:00',
  Time1000 = '10:00',
  Time1600 = '16:00',
  Time1700 = '17:00',
  Time1800 = '18:00',
  Time1900 = '19:00',
  Time2000 = '20:00',
}

export const MinistryServiceTimeNames: Record<MinistryServiceTime, string> = {
  [MinistryServiceTime.Time0900]: '9:00 AM',
  [MinistryServiceTime.Time1000]: '10:00 AM',
  [MinistryServiceTime.Time1600]: '4:00 PM',
  [MinistryServiceTime.Time1700]: '5:00 PM',
  [MinistryServiceTime.Time1800]: '6:00 PM',
  [MinistryServiceTime.Time1900]: '7:00 PM',
  [MinistryServiceTime.Time2000]: '8:00 PM',
};
