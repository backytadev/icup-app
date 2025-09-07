/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  id: string;
  data: PreacherResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
}

export const usePreacherUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  setMinistryBlocks,
  preacherUpdateForm,
}: Options): void => {
  const residenceDistrict = preacherUpdateForm.watch('residenceDistrict');
  const isDirectRelationToPastor = preacherUpdateForm.watch('isDirectRelationToPastor');

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
    preacherUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    preacherUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    preacherUpdateForm.setValue('gender', data?.member?.gender ?? '');
    preacherUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    preacherUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    preacherUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    preacherUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    preacherUpdateForm.setValue(
      'conversionDate',
      data?.member?.conversionDate && String(data.member.conversionDate) !== '1969-12-31'
        ? new Date(String(data.member.conversionDate).replace(/-/g, '/'))
        : undefined
    );
    preacherUpdateForm.setValue('email', data?.member?.email ?? '');
    preacherUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    preacherUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    preacherUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    preacherUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    preacherUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    preacherUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    preacherUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    preacherUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    preacherUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    preacherUpdateForm.setValue('theirSupervisor', data?.theirSupervisor?.id ?? '');
    preacherUpdateForm.setValue('recordStatus', data?.recordStatus);
    preacherUpdateForm.setValue('relationType', data?.relationType ?? '');
    if (data?.relationType && data?.relationType === RelationType.OnlyRelatedMinistries) {
      preacherUpdateForm.setValue('theirPastorOnlyMinistries', data?.theirPastor?.id ?? '');
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
    preacherUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Controller direct relation to pastor
  useEffect(() => {
    if (isDirectRelationToPastor) {
      preacherUpdateForm.resetField('theirCopastor', {
        keepError: true,
      });
      preacherUpdateForm.resetField('theirPastorOnlyMinistries', {
        keepError: true,
      });
    }

    if (!isDirectRelationToPastor) {
      preacherUpdateForm.resetField('theirPastorRelationDirect', {
        keepError: true,
      });
    }
  }, [isDirectRelationToPastor]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/preachers/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
