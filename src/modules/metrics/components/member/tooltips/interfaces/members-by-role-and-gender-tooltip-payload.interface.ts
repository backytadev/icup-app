export interface MembersByRoleAndGenderPayload {
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
    role: string;
    men: number;
    women: number;
    totalPercentage: string;
    church: {
      isAnexe: boolean;
      abbreviatedChurchName: string;
    };
  };
  chartType?: string | undefined;
  hide: boolean;
}
