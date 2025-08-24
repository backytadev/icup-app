/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';

interface Options {
  id: string;
  data: DiscipleResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
}

export const useDiscipleUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  setMinistryBlocks,
  discipleUpdateForm,
}: Options): void => {
  const residenceDistrict = discipleUpdateForm.watch('residenceDistrict');

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
    discipleUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    discipleUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    discipleUpdateForm.setValue('gender', data?.member?.gender ?? '');
    discipleUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    discipleUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    discipleUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    discipleUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    discipleUpdateForm.setValue(
      'conversionDate',
      new Date(String(data?.member?.conversionDate).replace(/-/g, '/'))
    );
    discipleUpdateForm.setValue('email', data?.member?.email ?? '');
    discipleUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    discipleUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    discipleUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    discipleUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    discipleUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    discipleUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    discipleUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    discipleUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    discipleUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    discipleUpdateForm.setValue('theirFamilyGroup', data?.theirFamilyGroup?.id);
    discipleUpdateForm.setValue('recordStatus', data?.recordStatus);
    discipleUpdateForm.setValue('relationType', data?.relationType ?? '');
    if (data?.relationType && data?.relationType === RelationType.OnlyRelatedMinistries) {
      discipleUpdateForm.setValue('theirPastor', data?.theirPastor?.id ?? '');
    }

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    discipleUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/disciples/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
