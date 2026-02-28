export interface FamilyGroupPreacherUpdateFormData {
  newTheirPreacher: string;
  newFamilyGroup?: string;
  currentFamilyGroup?: string;
  currentTheirPreacher?: string;
}

export type FamilyGroupPreacherUpdateFormDataKeys =
  | 'newTheirPreacher'
  | 'newFamilyGroup'
  | 'currentFamilyGroup'
  | 'currentTheirPreacher';
