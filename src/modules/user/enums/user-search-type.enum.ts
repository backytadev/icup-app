export enum UserSearchType {
  FirstNames = 'first_names',
  LastNames = 'last_names',
  FullNames = 'full_names',
  Gender = 'gender',
  Roles = 'roles',
  RecordStatus = 'record_status',
}

export const UserSearchTypeNames: Record<UserSearchType, string> = {
  [UserSearchType.FirstNames]: 'Nombres',
  [UserSearchType.LastNames]: 'Apellidos',
  [UserSearchType.FullNames]: 'Nombres y Apellidos',
  [UserSearchType.Gender]: 'Género',
  [UserSearchType.Roles]: 'Roles',
  [UserSearchType.RecordStatus]: 'Estado de registro',
};
