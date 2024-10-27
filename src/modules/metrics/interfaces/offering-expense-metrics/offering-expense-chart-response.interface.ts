export interface OfferingExpenseChartResponse {
  subType: string;
  date: Date;
  accumulatedOfferingPEN: number;
  accumulatedOfferingUSD: number;
  accumulatedOfferingEUR: number;
  church:{
    isAnexe: boolean;
    abbreviatedChurchName: string;
  }
  allOfferings: Array<{ offering: number; currency: string; date: string | Date }>;
  totalAmount: number;
}

