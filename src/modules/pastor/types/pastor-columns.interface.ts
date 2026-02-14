import {
  type CreatedBy,
  type UpdatedBy,
  type Copastor,
  type Supervisor,
  type Zone,
  type Preacher,
  type FamilyGroup,
  type Disciple,
  type TheirChurch,
} from '@/shared/interfaces/relations-response.interface';

export interface PastorColumns {
  id: string;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  maritalStatus?: string;
  numberChildren?: number;
  conversionDate?: Date;
  email?: string;
  phoneNumber?: string;
  residenceCountry?: string;
  residenceDepartment?: string;
  residenceProvince?: string;
  residenceDistrict?: string;
  residenceUrbanSector?: string;
  residenceAddress?: string;
  referenceAddress?: string;
  roles?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  copastors?: Copastor[];
  supervisors?: Supervisor[];
  zones?: Zone[];
  preachers?: Preacher[];
  familyHouses?: FamilyGroup[];
  disciples?: Disciple[];
  recordStatus?: string;
  theirChurch?: TheirChurch | null;
}
