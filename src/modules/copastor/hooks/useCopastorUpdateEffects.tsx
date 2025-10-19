/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

interface Options {
  id: string;
  data: CopastorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
}

export const useCopastorUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  setMinistryBlocks,
  copastorUpdateForm,
}: Options): void => {
  const residenceDistrict = copastorUpdateForm.watch('residenceDistrict');

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
    copastorUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    copastorUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    copastorUpdateForm.setValue('gender', data?.member?.gender ?? '');
    copastorUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    copastorUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    copastorUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    copastorUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    copastorUpdateForm.setValue(
      'conversionDate',
      data?.member?.conversionDate && String(data.member.conversionDate) !== '1969-12-31'
        ? new Date(String(data.member.conversionDate).replace(/-/g, '/'))
        : undefined
    );
    copastorUpdateForm.setValue('email', data?.member?.email ?? '');
    copastorUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    copastorUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    copastorUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    copastorUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    copastorUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    copastorUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    copastorUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    copastorUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    copastorUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    copastorUpdateForm.setValue('relationType', data?.relationType ?? '');
    copastorUpdateForm.setValue('theirPastor', data?.theirPastor?.id);
    copastorUpdateForm.setValue('recordStatus', data?.recordStatus);

    setTimeout(() => {
      setIsLoadingData(false);
    }, 1000);
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    copastorUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/copastors/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
