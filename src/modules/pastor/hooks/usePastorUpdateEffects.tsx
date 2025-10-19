/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

interface Options {
  id: string;
  data: PastorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
}

export const usePastorUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  pastorUpdateForm,
  setMinistryBlocks,
}: Options): void => {
  const residenceDistrict = pastorUpdateForm.watch('residenceDistrict');

  const fetchMinistriesByChurch = async (churchId: string) => {
    try {
      const respData = await getSimpleMinistries({ isSimpleQuery: true, churchId });
      return respData ?? [];
    } catch (error) {
      return [];
    }
  };

  //* Set ministry blocks
  useEffect(() => {
    const loadMinistryBlocks = async () => {
      if (data?.member.ministries && data.member.ministries.length > 0) {
        const blocks = await Promise.all(
          data.member.ministries.map(async (m) => {
            const ministriesList = await fetchMinistriesByChurch(m.churchMinistryId ?? '');
            return {
              churchPopoverOpen: false,
              ministryPopoverOpen: false,
              churchId: m.churchMinistryId ?? '',
              ministryId: m.id ?? '',
              ministryRoles: m.ministryRoles,
              ministries: ministriesList,
              ministryType: m.ministryType,
            };
          })
        );

        setMinistryBlocks(blocks);
      }
    };

    loadMinistryBlocks();
  }, [data]);

  //* Set data
  useEffect(() => {
    pastorUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    pastorUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    pastorUpdateForm.setValue('gender', data?.member?.gender ?? '');
    pastorUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    pastorUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    pastorUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    pastorUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    pastorUpdateForm.setValue(
      'conversionDate',
      data?.member?.conversionDate && String(data.member.conversionDate) !== '1969-12-31'
        ? new Date(String(data.member.conversionDate).replace(/-/g, '/'))
        : undefined
    );
    pastorUpdateForm.setValue('email', data?.member?.email ?? '');
    pastorUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    pastorUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    pastorUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    pastorUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    pastorUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    pastorUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    pastorUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    pastorUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    pastorUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    pastorUpdateForm.setValue('relationType', data?.relationType ?? '');
    pastorUpdateForm.setValue('theirChurch', data?.theirChurch?.id);
    pastorUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    pastorUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/pastors/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
