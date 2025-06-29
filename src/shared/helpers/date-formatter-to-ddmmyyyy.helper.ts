import { format } from 'date-fns';

export const dateFormatterToDDMMYYYY = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

export const dateFormatterToDDMMYY = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

export const timeStampFormatterToDDMMYY = (timestampString: string): string => {
  const formattedDate = format(Number(timestampString), 'dd/MM/yyyy');
  return `${formattedDate ?? ''}`;
};
