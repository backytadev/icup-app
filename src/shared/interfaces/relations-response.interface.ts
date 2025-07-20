export interface Anexe {
  id: string;
  churchName: string;
  abbreviatedChurchName: string;
  district: string;
  urbanSector: string;
}

export interface Pastor {
  id: string;
  firstNames: string;
  lastNames: string;
}

export interface Copastor {
  id: string;
  firstNames: string;
  lastNames: string;
}

export interface Supervisor {
  id: string;
  firstNames: string;
  lastNames: string;
}

export interface Zone {
  id: string;
  zoneName: string;
  district: string;
  supervisorFirstNames: string;
  supervisorLastNames: string;
}

export interface Preacher {
  id: string;
  firstNames: string;
  lastNames: string;
}

export interface FamilyGroup {
  id: string;
  familyGroupName: string;
  familyGroupCode: string;
  district: string;
  urbanSector: string;
  preacherFirstNames: string;
  preacherLastNames: string;
}

export interface Disciple {
  id: string;
  firstNames: string;
  lastNames: string;
}

export interface ExternalDonor {
  id: string;
  firstNames: string;
  lastNames: string;
  gender: string;
  birthDate: Date;
  email: string;
  phoneNumber: string;
  originCountry: string;
  residenceCountry: string;
  residenceCity: string;
  postalCode: string;
}

export interface Member {
  id: string;
  firstNames: string;
  lastNames: string;
  gender: string;
  originCountry: string;
  age: number;
  birthDate: Date;
  maritalStatus: string;
  numberChildren: number;
  conversionDate: Date;
  email: string;
  phoneNumber: string;
  residenceCountry: string;
  residenceDepartment: string;
  residenceProvince: string;
  residenceDistrict: string;
  residenceUrbanSector: string;
  residenceAddress: string;
  referenceAddress: string;
  roles: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
}

export interface CreatedBy {
  id: string;
  firstNames: string;
  lastNames: string;
  email: string;
  roles: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface UpdatedBy {
  id: string;
  firstNames: string;
  lastNames: string;
  email: string;
  roles: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface MainChurch {
  id: string;
  churchName?: string;
  abbreviatedChurchName?: string;
  isAnexe?: boolean;
  serviceTimes?: string[];
  foundingDate?: Date;
  email?: string;
  phoneNumber?: string;
  country?: string;
  department?: string;
  province?: string;
  district?: string;
  urbanSector?: string;
  address?: string;
  referenceAddress?: string;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export type TheirChurch = MainChurch;

export interface TheirPastor {
  id: string;
  member?: Member;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  age?: number;
  maritalStatus?: string;
  numberChildren?: number;
  conversionDate?: Date;
  email?: string;
  phoneNumber?: string;
  country?: string;
  department?: string;
  province?: string;
  district?: string;
  urbanSector?: string;
  address?: string;
  referenceAddress?: string;
  roles?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface TheirCopastor {
  id: string;
  member?: Member;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  age?: number;
  maritalStatus?: string;
  numberChildren?: number;
  conversionDate?: Date;
  email?: string;
  phoneNumber?: string;
  country?: string;
  department?: string;
  province?: string;
  district?: string;
  urbanSector?: string;
  address?: string;
  referenceAddress?: string;
  roles?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface TheirSupervisor {
  id: string;
  member?: Member;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  age?: number;
  maritalStatus?: string;
  numberChildren?: number;
  conversionDate?: Date;
  email?: string;
  phoneNumber?: string;
  country?: string;
  department?: string;
  province?: string;
  district?: string;
  urbanSector?: string;
  address?: string;
  referenceAddress?: string;
  isDirectRelationToPastor?: boolean;
  roles?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
export interface TheirPreacher {
  id: string;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  age?: number;
  maritalStatus?: string;
  numberChildren?: number;
  conversionDate?: Date;
  email?: string;
  phoneNumber?: string;
  country?: string;
  department?: string;
  province?: string;
  district?: string;
  urbanSector?: string;
  address?: string;
  referenceAddress?: string;
  roles?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface TheirZone {
  id: string;
  zoneName?: string;
  department?: string;
  province?: string;
  district?: string;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}

export interface TheirFamilyGroup {
  id: string;
  familyGroupName: string;
  familyGroupCode: string;
  district: string;
  urbanSector: string;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
