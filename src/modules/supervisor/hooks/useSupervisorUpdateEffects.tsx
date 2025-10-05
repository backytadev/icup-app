/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { type MemberRole } from '@/shared/enums/member-role.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

interface Options {
  id: string;
  data: SupervisorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
}

export const useSupervisorUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  supervisorUpdateForm,
  setMinistryBlocks,
}: Options): void => {
  const residenceDistrict = supervisorUpdateForm.watch('residenceDistrict');

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
    supervisorUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    supervisorUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    supervisorUpdateForm.setValue('gender', data?.member?.gender ?? '');
    supervisorUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    supervisorUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    supervisorUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    supervisorUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    supervisorUpdateForm.setValue(
      'conversionDate',
      data?.member?.conversionDate && String(data.member.conversionDate) !== '1969-12-31'
        ? new Date(String(data.member.conversionDate).replace(/-/g, '/'))
        : undefined
    );
    supervisorUpdateForm.setValue('email', data?.member?.email ?? '');
    supervisorUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    supervisorUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    supervisorUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    supervisorUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    supervisorUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    supervisorUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    supervisorUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    supervisorUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    supervisorUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    supervisorUpdateForm.setValue('theirCopastor', data?.theirCopastor?.id ?? '');
    supervisorUpdateForm.setValue('recordStatus', data?.recordStatus);
    supervisorUpdateForm.setValue('relationType', data?.relationType ?? '');
    if (data?.relationType && data?.relationType === RelationType.OnlyRelatedMinistries) {
      supervisorUpdateForm.setValue('theirPastorOnlyMinistries', data?.theirPastor?.id ?? '');
    }
    if (data?.relationType && data?.relationType === RelationType.RelatedDirectToPastor) {
      supervisorUpdateForm.setValue('theirPastorRelationDirect', data?.theirPastor?.id ?? '');
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
    supervisorUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/supervisors/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
