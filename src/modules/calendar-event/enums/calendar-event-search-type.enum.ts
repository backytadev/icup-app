export enum CalendarEventSearchType {
  Title = 'title',
  Category = 'category',
  Date = 'date',
  TargetGroup = 'target_group',
  Status = 'status',
}

export const CalendarEventSearchTypeNames: Record<CalendarEventSearchType, string> = {
  [CalendarEventSearchType.Title]: 'Título del Evento',
  [CalendarEventSearchType.Category]: 'Categoría',
  [CalendarEventSearchType.Date]: 'Fecha',
  [CalendarEventSearchType.TargetGroup]: 'Grupo Objetivo',
  [CalendarEventSearchType.Status]: 'Estado',
};
