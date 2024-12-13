export enum CopastorSearchType {
  FirstNames = 'first_names',
  LastNames = 'last_names',
  FullNames = 'full_names',
  BirthDate = 'birth_date', 
  BirthMonth = 'birth_month', 
  Gender = 'gender',
  MaritalStatus = 'marital_status',
  OriginCountry = 'origin_country' ,
  ResidenceCountry = 'residence_country' ,
  ResidenceDepartment = 'residence_department',
  ResidenceProvince = 'residence_province',
  ResidenceDistrict = 'residence_district',
  ResidenceUrbanSector = 'residence_urban_sector',
  ResidenceAddress = 'residence_address',
  RecordStatus = 'record_status',
}

export const CopastorSearchTypeNames: Record<CopastorSearchType, string> = {
  [CopastorSearchType.FirstNames]: 'Nombres',
  [CopastorSearchType.LastNames]: 'Apellidos',
  [CopastorSearchType.FullNames]: 'Nombres y Apellidos',
  [CopastorSearchType.BirthDate]: 'Fecha de nacimiento',
  [CopastorSearchType.BirthMonth]: 'Mes de nacimiento',
  [CopastorSearchType.Gender]: 'Género',
  [CopastorSearchType.MaritalStatus]: 'Estado civil',
  [CopastorSearchType.OriginCountry]: 'País (origen)',
  [CopastorSearchType.ResidenceCountry]: 'País (residencia)',
  [CopastorSearchType.ResidenceDepartment]: 'Departamento (residencia)',
  [CopastorSearchType.ResidenceProvince]: 'Provincia (residencia)',
  [CopastorSearchType.ResidenceDistrict]: 'Distrito (residencia)',
  [CopastorSearchType.ResidenceUrbanSector]: 'Sector Urbano (residencia)',
  [CopastorSearchType.ResidenceAddress]: 'Dirección (residencia)',
  [CopastorSearchType.RecordStatus]: 'Estado de registro',
};
