import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { DiscipleFieldNames } from '@/modules/disciple/enums/disciple-field-names.enum';

import {
  rolesEqualIgnoreOrder,
  ministriesEqualIgnoreOrder,
} from '@/shared/helpers/normalize-compare-ministries';

interface Options {
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  ministryBlocks: MinistryMemberBlock[];
  data: DiscipleResponse | undefined;
}

export const useDisciplePromoteButtonLogic = ({
  discipleUpdateForm,
  setIsPromoteButtonDisabled,
  ministryBlocks,
  data,
}: Options) => {
  //* States
  const [fixedValues, setFixedValues] = useState<DiscipleFormData[]>([]);
  const [lastValues, setLastValues] = useState<DiscipleFormData[]>([]);
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
  const firstNames = discipleUpdateForm.watch('firstNames');
  const lastNames = discipleUpdateForm.watch('lastNames');
  const gender = discipleUpdateForm.watch('gender');
  const birthDate = discipleUpdateForm.watch('birthDate');
  const originCountry = discipleUpdateForm.watch('originCountry');
  const maritalStatus = discipleUpdateForm.watch('maritalStatus');
  const numberChildren = discipleUpdateForm.watch('numberChildren');
  const conversionDate = discipleUpdateForm.watch('conversionDate');
  const email = discipleUpdateForm.watch('email');
  const phoneNumber = discipleUpdateForm.watch('phoneNumber');
  const residenceCountry = discipleUpdateForm.watch('residenceCountry');
  const residenceDepartment = discipleUpdateForm.watch('residenceDepartment');
  const residenceProvince = discipleUpdateForm.watch('residenceProvince');
  const residenceDistrict = discipleUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = discipleUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = discipleUpdateForm.watch('residenceAddress');
  const referenceAddress = discipleUpdateForm.watch('referenceAddress');
  const roles = discipleUpdateForm.watch('roles');
  const recordStatus = discipleUpdateForm.watch('recordStatus');
  const theirPastor = discipleUpdateForm.watch('theirPastor');
  const theirFamilyGroup = discipleUpdateForm.watch('theirFamilyGroup');
  const relationType = discipleUpdateForm.watch('relationType');

  //? Effects
  //* Set the fixed values in a new state
  useEffect(() => {
    const valuesFromForm = discipleUpdateForm.getValues([...Object.values(DiscipleFieldNames)]);

    const formatMinistriesData = fixedMinistryBlocks.map((item) => ({
      ministryType: item.ministryType,
      ministryId: item.ministryId,
      churchId: item.churchId,
      ministryRoles: item.ministryRoles,
    }));

    const initialValues: DiscipleFormData = {
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
      theirPastor: valuesFromForm[20],
      theirFamilyGroup: valuesFromForm[21],
      theirSupervisor: valuesFromForm[22],
      theirMinistries: formatMinistriesData,
    };

    setFixedValues(Object.values(initialValues) as DiscipleFormData[]);
  }, [fixedMinistryBlocks]);

  //* Compares the last values with the current values to enable or disable the promote button
  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: DiscipleFormData[] = lastValues;
    let currentValues: DiscipleFormData[] | any[] = [];

    currentValues = discipleUpdateForm.getValues([...Object.values(DiscipleFieldNames)]);

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
    const fixedMinistries = fixedValues[23] ?? [];
    const currentMinistries = currentValues[23];

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
    theirFamilyGroup,
    recordStatus,
    relationType,
    theirPastor,
    ministryBlocks,
  ]);
};
