export enum MinistrySearchType {
  FirstNames = 'first_names',
  LastNames = 'last_names',
  FullNames = 'full_names',
  MinistryType = 'ministry_type',
  MinistryCustomName = 'custom_ministry_name',
  FoundingDate = 'founding_date',
  Department = 'department',
  Province = 'province',
  District = 'district',
  UrbanSector = 'urban_sector',
  Address = 'address',
  RecordStatus = 'record_status',
}

export const MinistrySearchTypeNames: Record<MinistrySearchType, string> = {
  [MinistrySearchType.FirstNames]: 'Nombres',
  [MinistrySearchType.LastNames]: 'Apellidos',
  [MinistrySearchType.FullNames]: 'Nombres y Apellidos',
  [MinistrySearchType.MinistryType]: 'Tipo de ministerio',
  [MinistrySearchType.MinistryCustomName]: 'Nombre de ministerio',
  [MinistrySearchType.FoundingDate]: 'Fecha de Fundación',
  [MinistrySearchType.Department]: 'Departamento',
  [MinistrySearchType.Province]: 'Provincia',
  [MinistrySearchType.District]: 'Distrito',
  [MinistrySearchType.UrbanSector]: 'Sector Urbano',
  [MinistrySearchType.Address]: 'Dirección',
  [MinistrySearchType.RecordStatus]: 'Estado de registro',
};
