import {
  UrbanSectorsComasAllowed,
  UrbanSectorsLosOlivosAllowed,
  UrbanSectorsCarabaylloAllowed,
  UrbanSectorsPuentePiedraAllowed,
  UrbanSectorsIndependenciaAllowed,
} from '@/shared/helpers/allowed-urban-sectors-by-district.helper';

import { District } from '@/shared/enums/district.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';

export interface DisabledUrbanSectorsResult {
  urbanSectorsDataResult: string[];
}

export const validateUrbanSectorsAllowedByDistrict = (
  district: string
): DisabledUrbanSectorsResult | undefined => {
  //* Disabled Urban Sectors
  if (district === District.Independencia) {
    return {
      urbanSectorsDataResult: [
        ...Object.values(UrbanSectorNames).filter(
          (value) => !UrbanSectorsIndependenciaAllowed.includes(value)
        ),
      ],
    };
  }

  if (district === District.PuentePiedra) {
    return {
      urbanSectorsDataResult: [
        ...Object.values(UrbanSectorNames).filter(
          (value) => !UrbanSectorsPuentePiedraAllowed.includes(value)
        ),
      ],
    };
  }

  if (district === District.Comas) {
    return {
      urbanSectorsDataResult: [
        ...Object.values(UrbanSectorNames).filter(
          (value) => !UrbanSectorsComasAllowed.includes(value)
        ),
      ],
    };
  }

  if (district === District.LosOlivos) {
    return {
      urbanSectorsDataResult: [
        ...Object.values(UrbanSectorNames).filter(
          (value) => !UrbanSectorsLosOlivosAllowed.includes(value)
        ),
      ],
    };
  }

  if (district === District.Carabayllo) {
    return {
      urbanSectorsDataResult: [
        ...Object.values(UrbanSectorNames).filter(
          (value) => !UrbanSectorsCarabaylloAllowed.includes(value)
        ),
      ],
    };
  }
};
