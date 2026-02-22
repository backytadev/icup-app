export enum UserRole {
  SuperUser = 'super-user',
  AdminUser = 'admin-user',
  MembershipUser = 'membership-user',
  TreasurerUser = 'treasurer-user',
  MinistryUser = 'ministry-user',
  User = 'user',
}

export const UserRoleNames: Record<UserRole, string> = {
  [UserRole.SuperUser]: 'Super Usuario',
  [UserRole.AdminUser]: 'Administrador Usuario',
  [UserRole.MembershipUser]: 'Usuario Membresía',
  [UserRole.TreasurerUser]: 'Usuario Tesorero',
  [UserRole.MinistryUser]: 'Usuario Ministerio',
  [UserRole.User]: 'Usuario',
};
