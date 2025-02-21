interface Offering {
  offering: number;
  currency: string;
  date: Date;
}

//? Payload
export interface OfferingIncomePayloadByFamilyGroup {
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
    category: string;
    accumulatedOfferingPEN: number;
    accumulatedOfferingUSD: number;
    accumulatedOfferingEUR: number;
    familyGroup: {
      id: string;
      familyGroupName: string;
      familyGroupCode: string;
    };
    preacher: {
      id: string;
      firstNames: string;
      lastNames: string;
    };
    supervisor: {
      id: string;
      firstNames: string;
      lastNames: string;
    };
    church: {
      isAnexe: boolean;
      abbreviatedChurchName: string;
    };
    disciples: number;
    allOfferings: Offering[];
  };
  chartType?: string | undefined;
  hide: boolean;
}
