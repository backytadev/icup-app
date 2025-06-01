import { toZonedTime, format } from 'date-fns-tz';

export const formatDateToLimaDayMonthYear = (dateString: Date): string => {
  const date = new Date(dateString);
  const isOnlyDate = typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  const timeZone = isOnlyDate ? 'UTC' : 'America/Lima';

  const zonedDate = toZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, 'dd/MM/yyyy', { timeZone });

  return formattedDate;
};

export const formatDateToLimaTime = (dateString: Date): string => {
  const timeZone = 'America/Lima';
  const date = new Date(dateString);
  const zonedDate = toZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, 'HH:mm:ss a', { timeZone });

  return formattedDate;
};
