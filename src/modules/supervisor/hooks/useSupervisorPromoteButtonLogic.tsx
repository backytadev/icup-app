import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { SupervisorFieldNames } from '@/modules/supervisor/enums/supervisor-field-names.enum';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

import {
  rolesEqualIgnoreOrder,
  ministriesEqualIgnoreOrder,
} from '@/shared/helpers/normalize-compare-ministries';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

interface Options {
  data: SupervisorResponse | undefined;
  ministryBlocks: MinistryMemberBlock[];
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSupervisorPromoteButtonLogic = ({
  data,
  ministryBlocks,
  supervisorUpdateForm,
  setIsPromoteButtonDisabled,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<SupervisorFormData[]>([]);
  const [lastValues, setLastValues] = useState<SupervisorFormData[]>([]);
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
  const firstNames = supervisorUpdateForm.watch('firstNames');
  const lastNames = supervisorUpdateForm.watch('lastNames');
  const gender = supervisorUpdateForm.watch('gender');
  const birthDate = supervisorUpdateForm.watch('birthDate');
  const originCountry = supervisorUpdateForm.watch('originCountry');
  const maritalStatus = supervisorUpdateForm.watch('maritalStatus');
  const numberChildren = supervisorUpdateForm.watch('numberChildren');
  const conversionDate = supervisorUpdateForm.watch('conversionDate');
  const email = supervisorUpdateForm.watch('email');
  const phoneNumber = supervisorUpdateForm.watch('phoneNumber');
  const residenceCountry = supervisorUpdateForm.watch('residenceCountry');
  const residenceDepartment = supervisorUpdateForm.watch('residenceDepartment');
  const residenceProvince = supervisorUpdateForm.watch('residenceProvince');
  const residenceDistrict = supervisorUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = supervisorUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = supervisorUpdateForm.watch('residenceAddress');
  const referenceAddress = supervisorUpdateForm.watch('referenceAddress');
  const roles = supervisorUpdateForm.watch('roles');
  const recordStatus = supervisorUpdateForm.watch('recordStatus');
  const theirCopastor = supervisorUpdateForm.watch('theirCopastor');
  const theirPastorOnlyMinistries = supervisorUpdateForm.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = supervisorUpdateForm.watch('theirPastorRelationDirect');
  const relationType = supervisorUpdateForm.watch('relationType');

  //? Effects
  useEffect(() => {
    const valuesFromForm = supervisorUpdateForm.getValues([...Object.values(SupervisorFieldNames)]);

    const formatMinistriesData = fixedMinistryBlocks.map((item) => ({
      ministryType: item.ministryType,
      ministryId: item.ministryId,
      churchId: item.churchId,
      ministryRoles: item.ministryRoles,
    }));

    const initialValues: SupervisorFormData = {
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
      theirPastorRelationDirect: valuesFromForm[20],
      theirPastorOnlyMinistries: valuesFromForm[21],
      theirCopastor: valuesFromForm[22],
      theirMinistries: formatMinistriesData,
    };

    setFixedValues(Object.values(initialValues) as SupervisorFormData[]);
  }, [fixedMinistryBlocks]);

  //* Compares the last values with the current values to enable or disable the promote button
  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: SupervisorFormData[] = lastValues;
    let currentValues: SupervisorFormData[] | any[] = [];

    currentValues = supervisorUpdateForm.getValues([...Object.values(SupervisorFieldNames)]);

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

    //*  Conditions for related direct to pastor
    if (
      !ministriesEqual &&
      relationType === RelationType.RelatedDirectToPastor &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      !ministriesEqual &&
      relationType === RelationType.RelatedDirectToPastor &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    if (
      data?.relationType !== RelationType.RelatedDirectToPastor &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) !==
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      data?.relationType === RelationType.RelatedDirectToPastor &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(false);
    }

    //* Conditions for other types (OnlyMinistries and BothMinistryAndCover)
    if (
      fixedMinistryBlocks.length !== formatMinistriesData.length &&
      data?.relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      data?.relationType !== RelationType.RelatedDirectToPastor &&
      JSON.stringify({ ...fixedValues.slice(0, -1) }) ===
        JSON.stringify({ ...currentValues.slice(0, -1) }) &&
      recordStatus === 'active'
    ) {
      setIsPromoteButtonDisabled(true);
    }

    if (
      fixedMinistryBlocks.length === formatMinistriesData.length &&
      data?.relationType !== RelationType.OnlyRelatedHierarchicalCover &&
      data?.relationType !== RelationType.RelatedDirectToPastor &&
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
    theirCopastor,
    recordStatus,
    relationType,
    theirPastorOnlyMinistries,
    theirPastorRelationDirect,
    ministryBlocks,
  ]);
};
