export enum CalendarEventCategory {
  WorshipService = 'worship_service',
  Discipleship = 'discipleship',
  Prayer = 'prayer',
  Evangelism = 'evangelism',
  Ministry = 'ministry',
  Meetings = 'meetings',
  SpecialEvent = 'special_event',
  Fellowship = 'fellowship',
  Other = 'other',
}
export const CalendarEventCategoryNames: Record<CalendarEventCategory, string> = {
  [CalendarEventCategory.WorshipService]: 'Cultos y Servicios',
  [CalendarEventCategory.Discipleship]: 'Discipulado y Enseñanza',
  [CalendarEventCategory.Prayer]: 'Oración e Intercesión',
  [CalendarEventCategory.Evangelism]: 'Evangelismo y Misiones',
  [CalendarEventCategory.Ministry]: 'Ministerios',
  [CalendarEventCategory.Meetings]: 'Reuniones y Conferencias',
  [CalendarEventCategory.SpecialEvent]: 'Eventos Especiales',
  [CalendarEventCategory.Fellowship]: 'Confraternidad y Actividades',
  [CalendarEventCategory.Other]: 'Otro',
};
