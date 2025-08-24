export enum MinistrySearchSubType {
  MinistryByPastorFirstNames = 'ministry_by_pastor_first_names',
  MinistryByPastorLastNames = 'ministry_by_pastor_last_names',
  MinistryByPastorFullNames = 'ministry_by_pastor_full_names',
}

export const MinistrySearchSubTypeNames: Record<MinistrySearchSubType, string> = {
  [MinistrySearchSubType.MinistryByPastorFirstNames]: 'Por nombres de su pastor',
  [MinistrySearchSubType.MinistryByPastorLastNames]: 'Por apellidos de su pastor',
  [MinistrySearchSubType.MinistryByPastorFullNames]: 'Por nombres y apellidos de su pastor',
};

//* FirstNames
export enum SubTypeMinistrySearchByFirstNames {
  MinistryByPastorFirstNames = 'ministry_by_pastor_first_names',
}

export const SubTypeNamesMinistrySearchByFirstNames: Record<
  SubTypeMinistrySearchByFirstNames,
  string
> = {
  [SubTypeMinistrySearchByFirstNames.MinistryByPastorFirstNames]: 'Por nombres de su pastor',
};

//* LastNames
export enum SubTypeMinistrySearchByLastNames {
  MinistryByPastorLastNames = 'ministry_by_pastor_last_names',
}

export const SubTypeNamesMinistrySearchByLastNames: Record<
  SubTypeMinistrySearchByLastNames,
  string
> = {
  [SubTypeMinistrySearchByLastNames.MinistryByPastorLastNames]: 'Por apellidos de su pastor',
};

//* Full Name
export enum SubTypeMinistrySearchByFullNames {
  MinistryByPastorFullNames = 'ministry_by_pastor_full_names',
}

export const SubTypeNamesMinistrySearchByFullNames: Record<
  SubTypeMinistrySearchByFullNames,
  string
> = {
  [SubTypeMinistrySearchByFullNames.MinistryByPastorFullNames]:
    'Por nombres y apellidos de su pastor',
};
