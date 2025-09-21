export enum CopastorSearchSubType {
  CopastorByPastorFirstNames = 'copastor_by_pastor_first_names',
  CopastorByPastorLastNames = 'copastor_by_pastor_last_names',
  CopastorByPastorFullNames = 'copastor_by_pastor_full_names',
  ByCopastorFirstNames = 'by_copastor_first_names',
  ByCopastorLastNames = 'by_copastor_last_names',
  ByCopastorFullNames = 'by_copastor_full_names',
}

export const CopastorSearchSubTypeNames: Record<CopastorSearchSubType, string> = {
  [CopastorSearchSubType.CopastorByPastorFirstNames]: 'Por nombres de su pastor',
  [CopastorSearchSubType.CopastorByPastorLastNames]: 'Por apellidos de su pastor',
  [CopastorSearchSubType.CopastorByPastorFullNames]: 'Por nombres y apellidos de su pastor',
  [CopastorSearchSubType.ByCopastorFirstNames]: 'Por sus nombres',
  [CopastorSearchSubType.ByCopastorLastNames]: 'Por sus apellidos',
  [CopastorSearchSubType.ByCopastorFullNames]: 'Por sus nombres y apellidos',
};

//* FirstNames
export enum SubTypeCopastorSearchByFirstNames {
  CopastorByPastorFirstNames = 'copastor_by_pastor_first_names',
  ByCopastorFirstNames = 'by_copastor_first_names',
}

export const SubTypeNamesCopastorSearchByFirstNames: Record<
  SubTypeCopastorSearchByFirstNames,
  string
> = {
  [SubTypeCopastorSearchByFirstNames.ByCopastorFirstNames]: 'Por sus nombres',
  [SubTypeCopastorSearchByFirstNames.CopastorByPastorFirstNames]: 'Por nombres de su pastor',
};

//* LastNames
export enum SubTypeCopastorSearchByLastNames {
  CopastorByPastorLastNames = 'copastor_by_pastor_last_names',
  ByCopastorLastNames = 'by_copastor_last_names',
}

export const SubTypeNamesCopastorSearchByLastNames: Record<
  SubTypeCopastorSearchByLastNames,
  string
> = {
  [SubTypeCopastorSearchByLastNames.ByCopastorLastNames]: 'Por sus apellidos',
  [SubTypeCopastorSearchByLastNames.CopastorByPastorLastNames]: 'Por apellidos de su pastor',
};

//* Full Name
export enum SubTypeCopastorSearchByFullNames {
  CopastorByPastorFullNames = 'copastor_by_pastor_full_names',
  ByCopastorFullNames = 'by_copastor_full_names',
}

export const SubTypeNamesCopastorSearchByFullNames: Record<
  SubTypeCopastorSearchByFullNames,
  string
> = {
  [SubTypeCopastorSearchByFullNames.ByCopastorFullNames]: 'Por sus nombres y apellidos',
  [SubTypeCopastorSearchByFullNames.CopastorByPastorFullNames]:
    'Por nombres y apellidos de su pastor',
};
