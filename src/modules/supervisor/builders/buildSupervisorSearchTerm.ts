import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';
import { SupervisorQueryParams } from '@/modules/supervisor/interfaces/supervisor-query-params.interface';

export const buildSupervisorSearchTerm = (params: SupervisorQueryParams): string | undefined => {
  const {
    searchType,
    inputTerm,
    dateTerm,
    selectTerm,
    firstNamesTerm,
    lastNamesTerm,
    copastorTerm,
    churchTerm,
  } = params;

  const mapping: Partial<Record<SupervisorSearchType, string | undefined>> = {
    [SupervisorSearchType.BirthDate]: dateTerm,
    [SupervisorSearchType.BirthMonth]: selectTerm,
    [SupervisorSearchType.Gender]: selectTerm,
    [SupervisorSearchType.MaritalStatus]: selectTerm,
    [SupervisorSearchType.ZoneName]: inputTerm,
    [SupervisorSearchType.AvailableSupervisorsByCopastor]: copastorTerm,
    [SupervisorSearchType.AvailableSupervisorsByChurch]: churchTerm,
    [SupervisorSearchType.OriginCountry]: inputTerm,
    [SupervisorSearchType.ResidenceCountry]: inputTerm,
    [SupervisorSearchType.ResidenceDepartment]: inputTerm,
    [SupervisorSearchType.ResidenceProvince]: inputTerm,
    [SupervisorSearchType.ResidenceDistrict]: inputTerm,
    [SupervisorSearchType.ResidenceUrbanSector]: inputTerm,
    [SupervisorSearchType.ResidenceAddress]: inputTerm,
    [SupervisorSearchType.RecordStatus]: selectTerm,
    [SupervisorSearchType.FirstNames]: firstNamesTerm,
    [SupervisorSearchType.LastNames]: lastNamesTerm,
    [SupervisorSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as SupervisorSearchType];
};
