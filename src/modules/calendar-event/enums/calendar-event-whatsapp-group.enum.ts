export enum CalendarEventWhatsAppGroup {
  General = 'general',
  Leaders = 'leaders',
  Youth = 'youth',
  Children = 'children',
  Women = 'women',
  Men = 'men',
  Intercession = 'intercession',
  Deacons = 'deacons',
}

export const CalendarEventWhatsAppGroupNames: Record<CalendarEventWhatsAppGroup, string> = {
  [CalendarEventWhatsAppGroup.General]: 'Grupo General',
  [CalendarEventWhatsAppGroup.Leaders]: 'Grupo de Líderes',
  [CalendarEventWhatsAppGroup.Youth]: 'Grupo de Jóvenes',
  [CalendarEventWhatsAppGroup.Children]: 'Grupo de Niños',
  [CalendarEventWhatsAppGroup.Women]: 'Grupo de Mujeres',
  [CalendarEventWhatsAppGroup.Men]: 'Grupo de Hombres',
  [CalendarEventWhatsAppGroup.Intercession]: 'Grupo de Intercesión',
  [CalendarEventWhatsAppGroup.Deacons]: 'Grupo de Diáconos',
};
