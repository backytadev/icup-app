export interface UserPasswordUpdateFormData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm?: string;
}

export type UserPasswordUpdateFormDataKeys =
  | 'currentPassword'
  | 'newPassword'
  | 'newPasswordConfirm';
