export enum SupervisorSearchType {
  FirstNames = 'first_names',
  LastNames = 'last_names',
  FullNames = 'full_names',
  BirthDate = 'birth_date',
  BirthMonth = 'birth_month',
  Gender = 'gender',
  MaritalStatus = 'marital_status',
  OriginCountry = 'origin_country',
  ZoneName = 'zone_name',
  ResidenceCountry = 'residence_country',
  ResidenceDepartment = 'residence_department',
  ResidenceProvince = 'residence_province',
  ResidenceDistrict = 'residence_district',
  ResidenceUrbanSector = 'residence_urban_sector',
  ResidenceAddress = 'residence_address',
  RecordStatus = 'record_status',
  CopastorId = 'copastor_id',
}

export const SupervisorSearchTypeNames: Partial<Record<SupervisorSearchType, string>> = {
  [SupervisorSearchType.FirstNames]: 'Nombres',
  [SupervisorSearchType.LastNames]: 'Apellidos',
  [SupervisorSearchType.FullNames]: 'Nombres y Apellidos',
  [SupervisorSearchType.BirthDate]: 'Fecha de nacimiento',
  [SupervisorSearchType.BirthMonth]: 'Mes de nacimiento',
  [SupervisorSearchType.Gender]: 'Género',
  [SupervisorSearchType.MaritalStatus]: 'Estado civil',
  [SupervisorSearchType.ZoneName]: 'Nombre de Zona',
  [SupervisorSearchType.OriginCountry]: 'País (origen)',
  [SupervisorSearchType.ResidenceCountry]: 'País (residencia)',
  [SupervisorSearchType.ResidenceDepartment]: 'Departamento (residencia)',
  [SupervisorSearchType.ResidenceProvince]: 'Provincia (residencia)',
  [SupervisorSearchType.ResidenceDistrict]: 'Distrito (residencia)',
  [SupervisorSearchType.ResidenceUrbanSector]: 'Sector Urbano (residencia)',
  [SupervisorSearchType.ResidenceAddress]: 'Dirección (residencia)',
  [SupervisorSearchType.RecordStatus]: 'Estado de registro',
};
