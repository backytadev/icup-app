import {
  ZoneModuleDistrictsAllowed,
  MemberModuleDistrictsAllowed,
  ChurchModuleDistrictsAllowed,
  FamilyGroupModuleDistrictsAllowed,
} from '@/shared/helpers/allowed-districts-by-module.helper';
import { DistrictNames } from '@/shared/enums/district.enum';

export interface DisabledDistrictsResult {
  districtsDataResult: string[];
}

export const validateDistrictsAllowedByModule = (
  path: string
): DisabledDistrictsResult | undefined => {
  //* Disabled Districts
  if (
    path === '/churches/create' ||
    path === '/churches/search' ||
    path === '/disciples/create' ||
    path === '/disciples/update' ||
    path === '/pastors/create' ||
    path === '/pastors/update' ||
    path === '/copastors/create' ||
    path === '/copastors/update' ||
    path === '/supervisors/create' ||
    path === '/supervisors/update' ||
    path === '/preachers/create' ||
    path === '/preachers/update'
  ) {
    return {
      districtsDataResult: [
        ...Object.values(DistrictNames).filter(
          (value) => !MemberModuleDistrictsAllowed.includes(value)
        ),
      ],
    };
  }

  if (path === '/churches/create' || path === '/churches/search') {
    return {
      districtsDataResult: [
        ...Object.values(DistrictNames).filter(
          (value) => !ChurchModuleDistrictsAllowed.includes(value)
        ),
      ],
    };
  }

  if (path === '/family-groups/create' || path === '/family-groups/update') {
    return {
      districtsDataResult: [
        ...Object.values(DistrictNames).filter(
          (value) => !FamilyGroupModuleDistrictsAllowed.includes(value)
        ),
      ],
    };
  }

  if (path === '/zones/create' || path === '/zones/update') {
    return {
      districtsDataResult: [
        ...Object.values(DistrictNames).filter(
          (value) => !ZoneModuleDistrictsAllowed.includes(value)
        ),
      ],
    };
  }
};
