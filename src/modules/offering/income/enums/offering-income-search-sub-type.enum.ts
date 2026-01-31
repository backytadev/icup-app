export enum OfferingIncomeSearchSubType {
  OfferingByDate = 'offering_by_date',

  // Sunday Service, school sunday
  OfferingByShift = 'offering_by_shift',
  OfferingByShiftDate = 'offering_by_shift_date',

  // Family House, Fasting Zonal, Vigil Zonal
  OfferingByZone = 'offering_by_zone',
  OfferingByZoneDate = 'offering_by_zone_date',

  // Offering Family House
  OfferingByGroupCode = 'offering_by_group_code',
  OfferingByGroupCodeDate = 'offering_by_group_code_date',
  OfferingByPreacherFirstNames = 'offering_by_preacher_first_names',
  OfferingByPreacherLastNames = 'offering_by_preacher_last_names',
  OfferingByPreacherFullNames = 'offering_by_preacher_full_names',

  // Offering Ayuno y Vigilia Zonal
  OfferingBySupervisorFirstNames = 'offering_by_supervisor_first_names',
  OfferingBySupervisorLastNames = 'offering_by_supervisor_last_names',
  OfferingBySupervisorFullNames = 'offering_by_supervisor_full_names',

  // Offering Ground Church and Special
  OfferingByContributorFirstNames = 'offering_by_contributor_first_names',
  OfferingByContributorLastNames = 'offering_by_contributor_last_names',
  OfferingByContributorFullNames = 'offering_by_contributor_full_names',
}

export const OfferingIncomeSearchSubTypeNames: Record<OfferingIncomeSearchSubType, string> = {
  [OfferingIncomeSearchSubType.OfferingByDate]: 'Por fecha',

  // Sunday service, youngs, school sunday
  [OfferingIncomeSearchSubType.OfferingByShift]: 'Por turno',
  [OfferingIncomeSearchSubType.OfferingByShiftDate]: 'Por fecha y turno',

  // Family House, Fasting Zonal, Vigil Zonal
  [OfferingIncomeSearchSubType.OfferingByZone]: 'Por zona',
  [OfferingIncomeSearchSubType.OfferingByZoneDate]: 'Por zona y fecha',

  // Family House
  [OfferingIncomeSearchSubType.OfferingByPreacherFirstNames]: 'Por nombres de su predicador',
  [OfferingIncomeSearchSubType.OfferingByPreacherLastNames]: 'Por apellidos de su predicador',
  [OfferingIncomeSearchSubType.OfferingByPreacherFullNames]:
    'Por nombres y apellidos de su predicador',
  [OfferingIncomeSearchSubType.OfferingByGroupCode]: 'Por código de grupo fam.',
  [OfferingIncomeSearchSubType.OfferingByGroupCodeDate]: 'Por código de grupo fam. y fecha',

  // Offering Ayuno Zonal y Vigilia Zonal
  [OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames]: 'Por nombres de su supervisor',
  [OfferingIncomeSearchSubType.OfferingBySupervisorLastNames]: 'Por apellidos de su supervisor',
  [OfferingIncomeSearchSubType.OfferingBySupervisorFullNames]:
    'Por nombres y apellidos de su supervisor',

  // Offering Ground Church and Special
  [OfferingIncomeSearchSubType.OfferingByContributorFirstNames]: 'Por nombres del aportante',
  [OfferingIncomeSearchSubType.OfferingByContributorLastNames]: 'Por apellidos del aportante',
  [OfferingIncomeSearchSubType.OfferingByContributorFullNames]:
    'Por nombres y apellidos del aportante',
};

//* Sunday Service
export enum SubTypeOfferingIncomeSearchBySundayService {
  OfferingByDate = 'offering_by_date',
  OfferingByShift = 'offering_by_shift',
  OfferingByShiftDate = 'offering_by_shift_date',
}

export const SubTypeNamesOfferingIncomeSearchBySundayService: Record<
  SubTypeOfferingIncomeSearchBySundayService,
  string
> = {
  [SubTypeOfferingIncomeSearchBySundayService.OfferingByDate]: 'Por fecha',
  [SubTypeOfferingIncomeSearchBySundayService.OfferingByShift]: 'Por turno',
  [SubTypeOfferingIncomeSearchBySundayService.OfferingByShiftDate]: 'Por fecha y turno',
};

//* Sunday School
export enum SubTypeOfferingIncomeSearchBySundaySchool {
  OfferingByDate = 'offering_by_date',
  OfferingByShift = 'offering_by_shift',
  OfferingByShiftDate = 'offering_by_shift_date',
  OfferingByContributorFirstNames = 'offering_by_contributor_first_names',
  OfferingByContributorLastNames = 'offering_by_contributor_last_names',
  OfferingByContributorFullNames = 'offering_by_contributor_full_names',
}

export const SubTypeNamesOfferingIncomeSearchBySundaySchool: Record<
  SubTypeOfferingIncomeSearchBySundaySchool,
  string
> = {
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByDate]: 'Por fecha',
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByShift]: 'Por turno',
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByShiftDate]: 'Por fecha y turno',
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByContributorFirstNames]:
    'Por nombres del aportante',
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByContributorLastNames]:
    'Por apellidos del aportante',
  [SubTypeOfferingIncomeSearchBySundaySchool.OfferingByContributorFullNames]:
    'Por nombres y apellidos del aportante',
};

//* Offering (Family House)
export enum SubTypeOfferingIncomeSearchByFamilyGroup {
  OfferingByZone = 'offering_by_zone',
  OfferingByDate = 'offering_by_date',
  OfferingByZoneDate = 'offering_by_zone_date',
  OfferingByGroupCode = 'offering_by_group_code',
  OfferingByGroupCodeDate = 'offering_by_group_code_date',
  OfferingByPreacherFirstNames = 'offering_by_preacher_first_names',
  OfferingByPreacherLastNames = 'offering_by_preacher_last_names',
  OfferingByPreacherFullNames = 'offering_by_preacher_full_names',
}

export const SubTypeNamesOfferingIncomeSearchByFamilyGroup: Record<
  SubTypeOfferingIncomeSearchByFamilyGroup,
  string
> = {
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByDate]: 'Por fecha',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByZone]: 'Por zona',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByZoneDate]: 'Por zona y fecha',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByGroupCode]: 'Por código de grupo familiar',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByGroupCodeDate]:
    'Por código de grupo familiar y fecha',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByPreacherFirstNames]:
    'Por nombres de su predicador',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByPreacherLastNames]:
    'Por apellidos de su predicador',
  [SubTypeOfferingIncomeSearchByFamilyGroup.OfferingByPreacherFullNames]:
    'Por nombres y apellidos de su predicador',
};

//* Offering (Fasting General, Vigil General)
export enum SubTypeOfferingIncomeSearchByFastingAndVigilGeneral {
  OfferingByDate = 'offering_by_date',
}

export const SubTypeNamesOfferingIncomeSearchByFastingAndVigilGeneralAndGeneralEvangelism: Record<
  SubTypeOfferingIncomeSearchByFastingAndVigilGeneral,
  string
> = {
  [SubTypeOfferingIncomeSearchByFastingAndVigilGeneral.OfferingByDate]: 'Por fecha',
};

//* Offering (Fasting Zonal, Vigil Zonal)
export enum SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism {
  OfferingByDate = 'offering_by_date',
  OfferingByZone = 'offering_by_zone',
  OfferingByZoneDate = 'offering_by_zone_date',
  OfferingBySupervisorFirstNames = 'offering_by_supervisor_first_names',
  OfferingBySupervisorLastNames = 'offering_by_supervisor_last_names',
  OfferingBySupervisorFullNames = 'offering_by_supervisor_full_names',
}

export const SubTypeNamesOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelism: Record<
  SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism,
  string
> = {
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingByDate]:
    'Por fecha',
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingByZone]:
    'Por zona',
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingByZoneDate]:
    'Por zona y fecha',
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingBySupervisorFirstNames]:
    'Por nombres de su supervisor',
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingBySupervisorLastNames]:
    'Por apellidos de su supervisor',
  [SubTypeOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelismAndZonalEvangelism.OfferingBySupervisorFullNames]:
    'Por nombres y apellidos de su supervisor',
};

//* Offering (Young Service)
export enum SubTypeOfferingIncomeSearchByYoungService {
  OfferingByDate = 'offering_by_date',
  OfferingByContributorFirstNames = 'offering_by_contributor_first_names',
  OfferingByContributorLastNames = 'offering_by_contributor_last_names',
  OfferingByContributorFullNames = 'offering_by_contributor_full_names',
}

export const SubTypeNamesOfferingIncomeSearchByYoungService: Record<
  SubTypeOfferingIncomeSearchByYoungService,
  string
> = {
  [SubTypeOfferingIncomeSearchByYoungService.OfferingByDate]: 'Por fecha',
  [SubTypeOfferingIncomeSearchByYoungService.OfferingByContributorFirstNames]:
    'Por nombres del aportante',
  [SubTypeOfferingIncomeSearchByYoungService.OfferingByContributorLastNames]:
    'Por apellidos del aportante',
  [SubTypeOfferingIncomeSearchByYoungService.OfferingByContributorFullNames]:
    'Por nombres y apellidos del aportante',
};

//* Offering (Service United)
export enum SubTypeOfferingIncomeSearchByUnitedService {
  OfferingByDate = 'offering_by_date',
}

export const SubTypeNamesOfferingIncomeSearchByUnitedService: Record<
  SubTypeOfferingIncomeSearchByUnitedService,
  string
> = {
  [SubTypeOfferingIncomeSearchByUnitedService.OfferingByDate]: 'Por fecha',
};

//* Offering (Income Adjustment)
export enum SubTypeOfferingIncomeSearchByActivities {
  OfferingByDate = 'offering_by_date',
}

export const SubTypeNamesOfferingIncomeSearchByActivities: Record<
  SubTypeOfferingIncomeSearchByActivities,
  string
> = {
  [SubTypeOfferingIncomeSearchByActivities.OfferingByDate]: 'Por fecha',
};

//* Offering (Activities)
export enum SubTypeOfferingIncomeSearchByIncomeAdjustment {
  OfferingByDate = 'offering_by_date',
}

export const SubTypeNamesOfferingIncomeSearchByIncomeAdjustment: Record<
  SubTypeOfferingIncomeSearchByIncomeAdjustment,
  string
> = {
  [SubTypeOfferingIncomeSearchByIncomeAdjustment.OfferingByDate]: 'Por fecha',
};

//* Offering (Ground Church, Special)
export enum SubTypeOfferingIncomeSearchByChurchGroundAndSpecial {
  OfferingByDate = 'offering_by_date',
  OfferingByContributorFirstNames = 'offering_by_contributor_first_names',
  OfferingByContributorLastNames = 'offering_by_contributor_last_names',
  OfferingByContributorFullNames = 'offering_by_contributor_full_names',
}

export const SubTypeNamesOfferingIncomeSearchByChurchGroundAndSpecial: Record<
  SubTypeOfferingIncomeSearchByChurchGroundAndSpecial,
  string
> = {
  [SubTypeOfferingIncomeSearchByChurchGroundAndSpecial.OfferingByDate]: 'Por fecha',
  [SubTypeOfferingIncomeSearchByChurchGroundAndSpecial.OfferingByContributorFirstNames]:
    'Por nombres del aportante',
  [SubTypeOfferingIncomeSearchByChurchGroundAndSpecial.OfferingByContributorLastNames]:
    'Por apellidos del aportante',
  [SubTypeOfferingIncomeSearchByChurchGroundAndSpecial.OfferingByContributorFullNames]:
    'Por nombres y apellidos del aportante',
};
