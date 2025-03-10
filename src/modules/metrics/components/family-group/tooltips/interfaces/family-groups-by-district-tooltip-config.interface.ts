export interface FamilyGroupsByDistrictPayload {
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
    urbanSectorName: string;
    familyGroupsCount: number;
    district: string;
    church: {
      isAnexe: boolean;
      abbreviatedChurchName: string;
    };
    totalPercentage: string;
  };
  chartType?: string | undefined;
  hide: boolean;
}
