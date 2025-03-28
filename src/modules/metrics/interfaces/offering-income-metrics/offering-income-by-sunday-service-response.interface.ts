export interface OfferingIncomeBySundayServiceResponse {
  date: string | Date;
  category: string;
  dayPEN: number;
  afternoonPEN: number;
  dayUSD: number;
  afternoonUSD: number;
  dayEUR: number;
  afternoonEUR: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
}
