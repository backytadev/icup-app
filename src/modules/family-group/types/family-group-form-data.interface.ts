export interface FamilyGroupFormData {
  familyGroupName: string;
  serviceTime: string;
  country: string;
  department: string;
  province: string;
  district: string;
  urbanSector: string;
  address: string;
  referenceAddress: string;
  theirPreacher?: string | undefined;
  theirZone?: string | undefined;
  recordStatus?: string | undefined;
}

export type FamilyGroupFormDataKeys =
  | 'familyGroupName'
  | 'serviceTime'
  | 'country'
  | 'department'
  | 'province'
  | 'district'
  | 'urbanSector'
  | 'address'
  | 'referenceAddress'
  | 'theirPreacher'
  | 'theirZone'
  | 'recordStatus';
