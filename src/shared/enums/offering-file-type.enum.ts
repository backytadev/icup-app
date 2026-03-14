export enum FileFolder {
  Income = 'income',
  Expense = 'expense',
  CalendarEvent = 'calendar-events',
}

export const FileFolderNames: Record<FileFolder, string> = {
  [FileFolder.Income]: 'Ingreso',
  [FileFolder.Expense]: 'Gasto',
  [FileFolder.CalendarEvent]: 'Evento de Calendario',
};
