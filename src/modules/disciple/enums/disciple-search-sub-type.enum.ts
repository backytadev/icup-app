export enum DiscipleSearchSubType {
  DiscipleByPastorFirstNames = 'disciple_by_pastor_first_names',
  DiscipleByPastorLastNames = 'disciple_by_pastor_last_names',
  DiscipleByPastorFullNames = 'disciple_by_pastor_full_names',
  DiscipleByCopastorFirstNames = 'disciple_by_copastor_first_names',
  DiscipleByCopastorLastNames = 'disciple_by_copastor_last_names',
  DiscipleByCopastorFullNames = 'disciple_by_copastor_full_names',
  DiscipleBySupervisorFirstNames = 'disciple_by_supervisor_first_names',
  DiscipleBySupervisorLastNames = 'disciple_by_supervisor_last_names',
  DiscipleBySupervisorFullNames = 'disciple_by_supervisor_full_names',
  DiscipleByPreacherFirstNames = 'disciple_by_preacher_first_names',
  DiscipleByPreacherLastNames = 'disciple_by_preacher_last_names',
  DiscipleByPreacherFullNames = 'disciple_by_preacher_full_names',
  ByDiscipleFirstNames = 'by_disciple_first_names',
  ByDiscipleLastNames = 'by_disciple_last_names',
  ByDiscipleFullNames = 'by_disciple_full_names',
}

export const DiscipleSearchSubTypeNames: Record<DiscipleSearchSubType, string> = {
  [DiscipleSearchSubType.DiscipleByPastorFirstNames]: 'Por nombres de su pastor',
  [DiscipleSearchSubType.DiscipleByPastorLastNames]: 'Por apellidos de su pastor',
  [DiscipleSearchSubType.DiscipleByPastorFullNames]: 'Por nombres y apellidos de su pastor',
  [DiscipleSearchSubType.DiscipleByCopastorFirstNames]: 'Por nombres de su co-pastor',
  [DiscipleSearchSubType.DiscipleByCopastorLastNames]: 'Por apellidos de su co-pastor',
  [DiscipleSearchSubType.DiscipleByCopastorFullNames]: 'Por nombres y apellidos de su co-pastor',
  [DiscipleSearchSubType.DiscipleBySupervisorFirstNames]: 'Por nombres de su supervisor',
  [DiscipleSearchSubType.DiscipleBySupervisorLastNames]: 'Por apellidos de su supervisor',
  [DiscipleSearchSubType.DiscipleBySupervisorFullNames]: 'Por nombres y apellidos de su supervisor',
  [DiscipleSearchSubType.DiscipleByPreacherFirstNames]: 'Por nombres de su predicador',
  [DiscipleSearchSubType.DiscipleByPreacherLastNames]: 'Por apellidos de su predicador',
  [DiscipleSearchSubType.DiscipleByPreacherFullNames]: 'Por nombres y apellidos de su predicador',
  [DiscipleSearchSubType.ByDiscipleFirstNames]: 'Por sus nombres',
  [DiscipleSearchSubType.ByDiscipleLastNames]: 'Por sus apellidos',
  [DiscipleSearchSubType.ByDiscipleFullNames]: 'Por sus nombres y apellidos',
};

//* FirstNames
export enum SubTypeDiscipleSearchByFirstNames {
  DiscipleByPastorFirstNames = 'disciple_by_pastor_first_names',
  DiscipleByCopastorFirstNames = 'disciple_by_copastor_first_names',
  DiscipleBySupervisorFirstNames = 'disciple_by_supervisor_first_names',
  DiscipleByPreacherFirstNames = 'disciple_by_preacher_first_names',
  ByDiscipleFirstNames = 'by_disciple_first_names',
}

export const SubTypeNamesDiscipleSearchByFirstNames: Record<
  SubTypeDiscipleSearchByFirstNames,
  string
> = {
  [SubTypeDiscipleSearchByFirstNames.ByDiscipleFirstNames]: 'Por sus nombres',
  [SubTypeDiscipleSearchByFirstNames.DiscipleByPreacherFirstNames]: 'Por nombres de su predicador',
  [SubTypeDiscipleSearchByFirstNames.DiscipleBySupervisorFirstNames]:
    'Por nombres de su supervisor',
  [SubTypeDiscipleSearchByFirstNames.DiscipleByCopastorFirstNames]: 'Por nombres de su co-pastor',
  [SubTypeDiscipleSearchByFirstNames.DiscipleByPastorFirstNames]: 'Por nombres de su pastor',
};

//* LastNames
export enum SubTypeDiscipleSearchByLastNames {
  DiscipleByPastorLastNames = 'disciple_by_pastor_last_names',
  DiscipleByCopastorLastNames = 'disciple_by_copastor_last_names',
  DiscipleBySupervisorLastNames = 'disciple_by_supervisor_last_names',
  DiscipleByPreacherLastNames = 'disciple_by_preacher_last_names',
  ByDiscipleLastNames = 'by_disciple_last_names',
}

export const SubTypeNamesDiscipleSearchByLastNames: Record<
  SubTypeDiscipleSearchByLastNames,
  string
> = {
  [SubTypeDiscipleSearchByLastNames.ByDiscipleLastNames]: 'Por sus apellidos',
  [SubTypeDiscipleSearchByLastNames.DiscipleByPreacherLastNames]: 'Por apellidos de su predicador',
  [SubTypeDiscipleSearchByLastNames.DiscipleBySupervisorLastNames]:
    'Por apellidos de su supervisor',
  [SubTypeDiscipleSearchByLastNames.DiscipleByCopastorLastNames]: 'Por apellidos de su co-pastor',
  [SubTypeDiscipleSearchByLastNames.DiscipleByPastorLastNames]: 'Por apellidos de su pastor',
};

//* Full Name
export enum SubTypeDiscipleSearchByFullNames {
  DiscipleByPastorFullNames = 'disciple_by_pastor_full_names',
  DiscipleByCopastorFullNames = 'disciple_by_copastor_full_names',
  DiscipleBySupervisorFullNames = 'disciple_by_supervisor_full_names',
  DiscipleByPreacherFullNames = 'disciple_by_preacher_full_names',
  ByDiscipleFullNames = 'by_disciple_full_names',
}

export const SubTypeNamesDiscipleSearchByFullNames: Record<
  SubTypeDiscipleSearchByFullNames,
  string
> = {
  [SubTypeDiscipleSearchByFullNames.ByDiscipleFullNames]: 'Por sus nombres y apellidos',
  [SubTypeDiscipleSearchByFullNames.DiscipleByPreacherFullNames]:
    'Por nombres y apellidos de su predicador',
  [SubTypeDiscipleSearchByFullNames.DiscipleBySupervisorFullNames]:
    'Por nombres y apellidos de su supervisor',
  [SubTypeDiscipleSearchByFullNames.DiscipleByCopastorFullNames]:
    'Por nombres y apellidos de su co-pastor',
  [SubTypeDiscipleSearchByFullNames.DiscipleByPastorFullNames]:
    'Por nombres y apellidos de su pastor',
};
