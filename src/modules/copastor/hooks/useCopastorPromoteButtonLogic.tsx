import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { CopastorFieldNames } from '@/modules/copastor/enums/copastor-field-names.enum';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

import {
  rolesEqualIgnoreOrder,
  ministriesEqualIgnoreOrder,
} from '@/shared/helpers/normalize-compare-ministries';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';

interface Options {
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  ministryBlocks: MinistryMemberBlock[];
  data: CopastorResponse | undefined;
}

export const useCopastorPromoteButtonLogic = ({
  copastorUpdateForm,
  setIsPromoteButtonDisabled,
  ministryBlocks,
  data,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<CopastorFormData[]>([]);
  const [lastValues, setLastValues] = useState<CopastorFormData[]>([]);
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
  const firstNames = copastorUpdateForm.watch('firstNames');
  const lastNames = copastorUpdateForm.watch('lastNames');
  const gender = copastorUpdateForm.watch('gender');
  const birthDate = copastorUpdateForm.watch('birthDate');
  const originCountry = copastorUpdateForm.watch('originCountry');
  const maritalStatus = copastorUpdateForm.watch('maritalStatus');
  const numberChildren = copastorUpdateForm.watch('numberChildren');
  const conversionDate = copastorUpdateForm.watch('conversionDate');
  const email = copastorUpdateForm.watch('email');
  const phoneNumber = copastorUpdateForm.watch('phoneNumber');
  const residenceCountry = copastorUpdateForm.watch('residenceCountry');
  const residenceDepartment = copastorUpdateForm.watch('residenceDepartment');
  const residenceProvince = copastorUpdateForm.watch('residenceProvince');
  const residenceDistrict = copastorUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = copastorUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = copastorUpdateForm.watch('residenceAddress');
  const referenceAddress = copastorUpdateForm.watch('referenceAddress');
  const roles = copastorUpdateForm.watch('roles');
  const recordStatus = copastorUpdateForm.watch('recordStatus');
  const relationType = copastorUpdateForm.watch('relationType');
  const theirPastor = copastorUpdateForm.watch('theirPastor');

  //? Effects
  //* Set the fixed values in a new state
  useEffect(() => {
    const valuesFromForm = copastorUpdateForm.getValues([...Object.values(CopastorFieldNames)]);

    const formatMinistriesData = fixedMinistryBlocks.map((item) => ({
      ministryType: item.ministryType,
      ministryId: item.ministryId,
      churchId: item.churchId,
      ministryRoles: item.ministryRoles,
    }));

    const initialValues: CopastorFormData = {
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
      relationType: valuesFromForm[19],
      theirPastor: valuesFromForm[20] ?? '',
      theirMinistries: formatMinistriesData,
    };

    setFixedValues(Object.values(initialValues) as CopastorFormData[]);
  }, [fixedMinistryBlocks]);

  //* Compares the last values with the current values to enable or disable the promote button
  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: CopastorFormData[] = lastValues;
    let currentValues: CopastorFormData[] | any[] = [];

    currentValues = copastorUpdateForm.getValues([...Object.values(CopastorFieldNames)]);

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
      currentValues[20] ?? '',
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
    const fixedMinistries = fixedValues[21] ?? [];
    const currentMinistries = currentValues[21];

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

    //* Conditions for Only related cover with ministries
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
      relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    if (
      fixedMinistryBlocks.length !== formatMinistriesData.length &&
      relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      fixedMinistryBlocks.length === formatMinistriesData.length &&
      relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      ministriesEqual &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
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
    theirPastor,
    recordStatus,
    ministryBlocks,
  ]);
};
