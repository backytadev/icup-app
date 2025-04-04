interface Offering {
  offering: number;
  currency: string;
  date: Date;
}

//? Payload
export interface OfferingExpenseAdjustmentPayload {
  fill: string;
  radius: number;
  dataKey: string;
  unit?: string | undefined;
  formatter?: ((value: number) => string) | undefined;
  name: string;
  color: string;
  value: number;
  type?: string | undefined;
  payload: {
    date: Date;
    accumulatedOfferingPEN: number;
    accumulatedOfferingUSD: number;
    accumulatedOfferingEUR: number;
    church: {
      isAnexe: boolean;
      abbreviatedChurchName: string;
    };
    allOfferings: Offering[];
  };
  chartType?: string | undefined;
  hide: boolean;
}
