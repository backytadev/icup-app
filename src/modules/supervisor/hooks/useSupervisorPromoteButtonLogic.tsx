import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { SupervisorFieldNames } from '@/modules/supervisor/enums/supervisor-field-names.enum';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

import { rolesEqualIgnoreOrder } from '@/shared/helpers/normalize-compare-ministries';

interface Options {
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSupervisorPromoteButtonLogic = ({
  supervisorUpdateForm,
  setIsPromoteButtonDisabled,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<SupervisorFormData[]>([]);
  const [lastValues, setLastValues] = useState<SupervisorFormData[]>([]);

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
  const isDirectRelationToPastor = supervisorUpdateForm.watch('isDirectRelationToPastor');
  const recordStatus = supervisorUpdateForm.watch('recordStatus');
  const theirCopastor = supervisorUpdateForm.watch('theirCopastor');
  const theirPastor = supervisorUpdateForm.watch('theirPastor');

  //? Effects
  //* Set the fixed values in a state
  useEffect(() => {
    const initialValues = supervisorUpdateForm.getValues([...Object.values(SupervisorFieldNames)]);
    setFixedValues(initialValues);
  }, []);

  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: SupervisorFormData[] = lastValues;
    const currentValues: SupervisorFormData[] = supervisorUpdateForm.getValues([
      ...Object.values(SupervisorFieldNames),
    ]);

    //* Si se coloca el co-pastor inicial que tenia, se setea su mismo pastor (para guardar referencia)
    if (fixedValues[20] === currentValues[20]) {
      currentValues[21] = fixedValues[21];
      supervisorUpdateForm.setValue('theirPastor', String(currentValues[21]));
    }

    //* Validates if there is any change and sets the promote button to true
    if (
      previousValues.length !== 0 &&
      JSON.stringify(fixedValues) === JSON.stringify(previousValues)
    ) {
      setIsPromoteButtonDisabled(true);
    }

    //* Validates and compares if it has the same initial information, sorts and activates the button
    if (
      rolesEqualIgnoreOrder(fixedValues, currentValues) &&
      JSON.stringify(fixedValues) === JSON.stringify(currentValues) &&
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
    isDirectRelationToPastor,
    theirCopastor,
    theirPastor,
    recordStatus,
  ]);
};
