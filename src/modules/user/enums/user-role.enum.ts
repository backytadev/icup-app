export enum UserRole {
  SuperUser = 'super-user',
  AdminUser = 'admin-user',
  TreasurerUser = 'treasurer-user',
  MinistryUser = 'ministry-user',
  User = 'user',
}

export const UserRoleNames: Record<UserRole, string> = {
  [UserRole.SuperUser]: 'Super Usuario',
  [UserRole.AdminUser]: 'Usuario Administrador',
  [UserRole.TreasurerUser]: 'Usuario Tesorero',
  [UserRole.MinistryUser]: 'Usuario Ministerio',
  [UserRole.User]: 'Usuario',
};
