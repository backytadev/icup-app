import { toZonedTime, format } from 'date-fns-tz';

export const formatDateToLimaDayMonthYear = (dateString: Date): string => {
  const timeZone = 'America/Lima';
  const date = new Date(dateString);

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
