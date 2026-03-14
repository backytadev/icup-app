export enum CalendarEventStatus {
  Draft = 'draft',
  Published = 'published',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export const CalendarEventStatusNames: Record<CalendarEventStatus, string> = {
  [CalendarEventStatus.Draft]: 'Borrador',
  [CalendarEventStatus.Published]: 'Publicado',
  [CalendarEventStatus.Cancelled]: 'Cancelado',
  [CalendarEventStatus.Completed]: 'Completado',
};
