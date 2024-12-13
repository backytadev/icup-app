export enum DiscipleSearchType {
  FirstNames = 'first_names',
  LastNames = 'last_names',
  FullNames = 'full_names',
  BirthDate = 'birth_date', 
  BirthMonth = 'birth_month', 
  Gender = 'gender',
  MaritalStatus = 'marital_status',
  OriginCountry = 'origin_country' ,
  ZoneName = 'zone_name',
  FamilyGroupCode = 'family_group_code',
  FamilyGroupName = 'family_group_name',
  ResidenceCountry = 'residence_country',
  ResidenceDepartment = 'residence_department',
  ResidenceProvince = 'residence_province',
  ResidenceDistrict = 'residence_district',
  ResidenceUrbanSector = 'residence_urban_sector',
  ResidenceAddress = 'residence_address',
  RecordStatus = 'record_status',
}

export const DiscipleSearchTypeNames: Record<DiscipleSearchType, string> =  {
  [DiscipleSearchType.FirstNames]: 'Nombres',
  [DiscipleSearchType.LastNames]: 'Apellidos',
  [DiscipleSearchType.FullNames]: 'Nombres y Apellidos',
  [DiscipleSearchType.BirthDate]: 'Fecha de nacimiento',
  [DiscipleSearchType.BirthMonth]: 'Mes de nacimiento',
  [DiscipleSearchType.Gender]: 'Género',
  [DiscipleSearchType.MaritalStatus]: 'Estado civil',
  [DiscipleSearchType.ZoneName]: 'Nombre de Zona',
  [DiscipleSearchType.FamilyGroupCode]: 'Código de grupo familiar',
  [DiscipleSearchType.FamilyGroupName]: 'Nombre de grupo familiar',
  [DiscipleSearchType.OriginCountry]: 'País (origen)',
  [DiscipleSearchType.ResidenceCountry]: 'País (residencia)',
  [DiscipleSearchType.ResidenceDepartment]: 'Departamento (residencia)',
  [DiscipleSearchType.ResidenceProvince]: 'Provincia (residencia)',
  [DiscipleSearchType.ResidenceDistrict]: 'Distrito (residencia)',
  [DiscipleSearchType.ResidenceUrbanSector]: 'Sector Urbano (residencia)',
  [DiscipleSearchType.ResidenceAddress]: 'Dirección (residencia)',
  [DiscipleSearchType.RecordStatus]: 'Estado de registro (residencia)',
}
