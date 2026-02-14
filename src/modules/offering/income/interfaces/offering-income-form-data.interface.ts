export interface OfferingIncomeFormData {
  churchId?: string | undefined;
  type: string;
  subType?: string | undefined;
  category?: string | undefined;
  isNewExternalDonor?: boolean | undefined;
  externalDonorId?: string | undefined;
  externalDonorFirstNames?: string | undefined;
  externalDonorLastNames?: string | undefined;
  externalDonorGender?: string | undefined;
  externalDonorBirthDate?: Date | undefined;
  externalDonorOriginCountry?: string | undefined;
  externalDonorResidenceCountry?: string | undefined;
  externalDonorEmail?: string | undefined;
  externalDonorPhoneNumber?: string | undefined;
  externalDonorResidenceCity?: string | undefined;
  externalDonorPostalCode?: string | undefined;
  shift?: string | undefined;
  amount: string;
  fileNames?: string[] | undefined;
  imageUrls?: string[] | undefined;
  date: Date;
  currency: string;
  comments?: string | undefined;
  memberType?: string | undefined;
  familyGroupId?: string | undefined;
  memberId?: string | undefined;
  zoneId?: string | undefined;
  recordStatus?: string | undefined;
  shouldOpenReceiptInBrowser?: 'yes' | 'no' | undefined;
}

export type OfferingIncomeFormDataKeys =
  | 'type'
  | 'subType'
  | 'category'
  | 'isNewExternalDonor'
  | 'externalDonorId'
  | 'externalDonorFirstNames'
  | 'externalDonorLastNames'
  | 'externalDonorGender'
  | 'externalDonorBirthDate'
  | 'externalDonorOriginCountry'
  | 'externalDonorResidenceCountry'
  | 'externalDonorEmail'
  | 'externalDonorPhoneNumber'
  | 'externalDonorResidenceCity'
  | 'externalDonorPostalCode'
  | 'memberType'
  | 'amount'
  | 'shift'
  | 'currency'
  | 'comments'
  | 'familyGroupId'
  | 'memberId'
  | 'fileNames'
  | 'imageUrls'
  | 'memberId'
  | 'zoneId'
  | 'churchId'
  | 'recordStatus'
  | 'shouldOpenReceiptInBrowser';
