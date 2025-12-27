export enum MinistrySearchSelectOption {
  //* Status
  Inactive = 'inactive',

  //* Ministry Type
  KidsMinistry = 'kids_ministry',
  YouthMinistry = 'youth_ministry',
  IntercessionMinistry = 'intercession_ministry',
  EvangelismMinistry = 'evangelism_ministry',
  TechnologyMinistry = 'technology_ministry',
  BiblicalTeachingMinistry = 'biblical_teaching_ministry',
  WorshipMinistry = 'worship_ministry',
}

export const MinistrySearchSelectOptionNames: Record<MinistrySearchSelectOption, string> = {
  [MinistrySearchSelectOption.Inactive]: 'Inactivo',

  [MinistrySearchSelectOption.KidsMinistry]: 'Ministerio de Niños',
  [MinistrySearchSelectOption.YouthMinistry]: 'Ministerio de Jóvenes',
  [MinistrySearchSelectOption.IntercessionMinistry]: 'Ministerio de Intercesión',
  [MinistrySearchSelectOption.EvangelismMinistry]: 'Ministerio de Evangelismo',
  [MinistrySearchSelectOption.TechnologyMinistry]: 'Ministerio Tecnología',
  [MinistrySearchSelectOption.BiblicalTeachingMinistry]: 'Ministerio de Enseñanza Bíblica',
  [MinistrySearchSelectOption.WorshipMinistry]: 'Ministerio de Alabanza',
};

//* Record Status
export enum MinistrySearchByRecordStatus {
  Inactive = 'inactive',
}

export const MinistrySearchNamesByRecordStatus: Record<MinistrySearchByRecordStatus, string> = {
  [MinistrySearchByRecordStatus.Inactive]: 'Inactivo',
};

//* Ministry Type
export enum MinistrySearchByMinistryType {
  KidsMinistry = 'kids_ministry',
  YouthMinistry = 'youth_ministry',
  IntercessionMinistry = 'intercession_ministry',
  EvangelismMinistry = 'evangelism_ministry',
  TechnologyMinistry = 'technology_ministry',
  BiblicalTeachingMinistry = 'biblical_teaching_ministry',
  WorshipMinistry = 'worship_ministry',
}

export const MinistrySearchNamesByMinistryType: Record<MinistrySearchByMinistryType, string> = {
  [MinistrySearchByMinistryType.KidsMinistry]: 'Ministerio de Niños',
  [MinistrySearchByMinistryType.YouthMinistry]: 'Ministerio de Jóvenes',
  [MinistrySearchByMinistryType.IntercessionMinistry]: 'Ministerio de Intercesión',
  [MinistrySearchByMinistryType.EvangelismMinistry]: 'Ministerio de Evangelismo',
  [MinistrySearchByMinistryType.TechnologyMinistry]: 'Ministerio Tecnología',
  [MinistrySearchByMinistryType.BiblicalTeachingMinistry]: 'Ministerio de Enseñanza Bíblica',
  [MinistrySearchByMinistryType.WorshipMinistry]: 'Ministerio de Alabanza',
};
