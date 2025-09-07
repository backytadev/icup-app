import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { PreacherFieldNames } from '@/modules/preacher/enums/preacher-field-names.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';

import {
  rolesEqualIgnoreOrder,
  ministriesEqualIgnoreOrder,
} from '@/shared/helpers/normalize-compare-ministries';

interface Options {
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  ministryBlocks: MinistryMemberBlock[];
  data: PreacherResponse | undefined;
}

export const usePreacherPromoteButtonLogic = ({
  preacherUpdateForm,
  setIsPromoteButtonDisabled,
  ministryBlocks,
  data,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<PreacherFormData[]>([]);
  const [lastValues, setLastValues] = useState<PreacherFormData[]>([]);
  const [fixedMinistryBlocks, setFixedMinistryBlocks] = useState<any[]>([]);

  const fetchMinistriesByChurch = async (churchId: string) => {
    try {
      const respData = await getSimpleMinistries({ isSimpleQuery: true, churchId });
      return respData ?? [];
    } catch (error) {
      return [];
    }
  };

  //* Set fixed ministries blocks
  useEffect(() => {
    const loadMinistryBlocks = async () => {
      if (data?.member?.ministries && data?.member?.ministries?.length > 0) {
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

        setFixedMinistryBlocks(blocks);
      }
    };

    loadMinistryBlocks();
  }, []);

  //* Watchers
  const firstNames = preacherUpdateForm.watch('firstNames');
  const lastNames = preacherUpdateForm.watch('lastNames');
  const gender = preacherUpdateForm.watch('gender');
  const birthDate = preacherUpdateForm.watch('birthDate');
  const originCountry = preacherUpdateForm.watch('originCountry');
  const maritalStatus = preacherUpdateForm.watch('maritalStatus');
  const numberChildren = preacherUpdateForm.watch('numberChildren');
  const conversionDate = preacherUpdateForm.watch('conversionDate');
  const email = preacherUpdateForm.watch('email');
  const phoneNumber = preacherUpdateForm.watch('phoneNumber');
  const residenceCountry = preacherUpdateForm.watch('residenceCountry');
  const residenceDepartment = preacherUpdateForm.watch('residenceDepartment');
  const residenceProvince = preacherUpdateForm.watch('residenceProvince');
  const residenceDistrict = preacherUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = preacherUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = preacherUpdateForm.watch('residenceAddress');
  const referenceAddress = preacherUpdateForm.watch('referenceAddress');
  const roles = preacherUpdateForm.watch('roles');
  const recordStatus = preacherUpdateForm.watch('recordStatus');
  const theirPastorOnlyMinistries = preacherUpdateForm.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = preacherUpdateForm.watch('theirPastorRelationDirect');
  const relationType = preacherUpdateForm.watch('relationType');
  const theirSupervisor = preacherUpdateForm.watch('theirSupervisor');

  //? Effects
  useEffect(() => {
    const valuesFromForm = preacherUpdateForm.getValues([...Object.values(PreacherFieldNames)]);

    const formatMinistriesData = fixedMinistryBlocks.map((item) => ({
      ministryType: item.ministryType,
      ministryId: item.ministryId,
      churchId: item.churchId,
      ministryRoles: item.ministryRoles,
    }));

    const initialValues: PreacherFormData = {
      firstNames: valuesFromForm[0],
      lastNames: valuesFromForm[1],
      gender: valuesFromForm[2],
      originCountry: valuesFromForm[3],
      birthDate: valuesFromForm[4],
      maritalStatus: valuesFromForm[5],
      numberChildren: valuesFromForm[6],
      conversionDate: valuesFromForm[7],
      email: valuesFromForm[8],
      phoneNumber: valuesFromForm[9],
      residenceCountry: valuesFromForm[10],
      residenceDepartment: valuesFromForm[11],
      residenceProvince: valuesFromForm[12],
      residenceDistrict: valuesFromForm[13],
      residenceUrbanSector: valuesFromForm[14],
      residenceAddress: valuesFromForm[15],
      referenceAddress: valuesFromForm[16],
      roles: valuesFromForm[17],
      recordStatus: valuesFromForm[18],
      isDirectRelationToPastor: valuesFromForm[19],
      relationType: valuesFromForm[20],
      theirPastorRelationDirect: valuesFromForm[21],
      theirPastorOnlyMinistries: valuesFromForm[22],
      theirSupervisor: valuesFromForm[23],
      theirMinistries: formatMinistriesData,
    };

    setFixedValues(Object.values(initialValues) as PreacherFormData[]);
  }, [fixedMinistryBlocks]);

  //* Compares the last values with the current values to enable or disable the promote button
  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: PreacherFormData[] = lastValues;
    let currentValues: PreacherFormData[] | any[] = [];

    currentValues = preacherUpdateForm.getValues([...Object.values(PreacherFieldNames)]);

    const formatMinistriesData = ministryBlocks?.map((item) => ({
      ministryType: item.ministryType,
      ministryId: item.ministryId,
      churchId: item.churchId,
      ministryRoles: item.ministryRoles,
    }));

    currentValues = [
      currentValues[0],
      currentValues[1],
      currentValues[2],
      currentValues[3],
      currentValues[4],
      currentValues[5],
      currentValues[6],
      currentValues[7],
      currentValues[8],
      currentValues[9],
      currentValues[10],
      currentValues[11],
      currentValues[12],
      currentValues[13],
      currentValues[14],
      currentValues[15],
      currentValues[16],
      currentValues[17],
      currentValues[18],
      currentValues[19],
      currentValues[20],
      currentValues[21],
      currentValues[22],
      currentValues[23],
      formatMinistriesData,
    ];

    //* Validates and compares if it has the same initial information, sorts and activates the button
    if (
      previousValues.length !== 0 &&
      JSON.stringify(fixedValues) === JSON.stringify(previousValues)
    ) {
      setIsPromoteButtonDisabled(true);
    }

    //* Validates and compares if it has the same initial information, sorts and activates the button (roles)
    if (
      rolesEqualIgnoreOrder(fixedValues, currentValues) &&
      JSON.stringify(fixedValues) === JSON.stringify(currentValues) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    //* Validate if same array data ministries
    const fixedMinistries = fixedValues[24] ?? [];
    const currentMinistries = currentValues[24];

    const ministriesEqual = ministriesEqualIgnoreOrder(fixedMinistries as any, currentMinistries);

    if (
      ministriesEqual &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    if (
      ministriesEqual &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      !ministriesEqual &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      !ministriesEqual &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    if (
      data?.relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      data?.relationType === RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    if (
      fixedMinistryBlocks.length !== formatMinistriesData.length &&
      data?.relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      (JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) ||
        JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
          JSON.stringify({ ...currentValues.slice(0, -1) })) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      fixedMinistryBlocks.length === formatMinistriesData.length &&
      data?.relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      ministriesEqual &&
      (JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) ||
        JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
          JSON.stringify({ ...currentValues.slice(0, -1) })) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    //* If there are no matches, set the current value to lastValues
    setLastValues(currentValues);
  }, [
    firstNames,
    lastNames,
    gender,
    originCountry,
    maritalStatus,
    birthDate,
    numberChildren,
    conversionDate,
    email,
    phoneNumber,
    residenceCountry,
    residenceDepartment,
    residenceProvince,
    residenceUrbanSector,
    referenceAddress,
    residenceDistrict,
    residenceAddress,
    roles,
    theirSupervisor,
    recordStatus,
    relationType,
    theirPastorOnlyMinistries,
    theirPastorRelationDirect,
    ministryBlocks,
  ]);
};
