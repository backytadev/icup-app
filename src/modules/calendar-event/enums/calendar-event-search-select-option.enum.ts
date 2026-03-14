export enum CalendarEventSearchSelectOption {
  Active = 'active',
  Inactive = 'inactive',
}

export const CalendarEventSearchSelectOptionNames: Record<CalendarEventSearchSelectOption, string> =
  {
    [CalendarEventSearchSelectOption.Active]: 'Activo',
    [CalendarEventSearchSelectOption.Inactive]: 'Inactivo',
  };
