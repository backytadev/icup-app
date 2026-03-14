export enum CalendarEventTargetGroup {
  General = 'general',
  Youth = 'youth',
  Teenagers = 'teenagers',
  Leaders = 'leaders',
  Intercession = 'intercession',
  Evangelism = 'evangelism',
}

export const CalendarEventTargetGroupNames: Record<CalendarEventTargetGroup, string> = {
  [CalendarEventTargetGroup.General]: 'Grupo General',
  [CalendarEventTargetGroup.Youth]: 'Jóvenes',
  [CalendarEventTargetGroup.Teenagers]: 'Adolescentes',
  [CalendarEventTargetGroup.Leaders]: 'Líderes',
  [CalendarEventTargetGroup.Intercession]: 'Intercesión',
  [CalendarEventTargetGroup.Evangelism]: 'Evangelismo',
};
