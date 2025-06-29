import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { DiscipleFieldNames } from '@/modules/disciple/enums/disciple-field-names.enum';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDisciplePromoteButtonLogic = ({
  discipleUpdateForm,
  setIsPromoteButtonDisabled,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<DiscipleFormData[]>([]);
  const [lastValues, setLastValues] = useState<DiscipleFormData[]>([]);

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
  const theirFamilyGroup = discipleUpdateForm.watch('theirFamilyGroup');

  //? Effects
  //* Set the fixed values in a new state
  useEffect(() => {
    const initialValues = discipleUpdateForm.getValues([...Object.values(DiscipleFieldNames)]);
    setFixedValues(initialValues);
  }, []);

  useEffect(() => {
    //* Assigns the previous values and the current values
    const previousValues: DiscipleFormData[] = lastValues;
    const currentValues: DiscipleFormData[] = discipleUpdateForm.getValues([
      ...Object.values(DiscipleFieldNames),
    ]);

    //* Validates and compares if it has the same initial information, sorts and activates the button
    if (
      previousValues.length !== 0 &&
      JSON.stringify(fixedValues) === JSON.stringify(previousValues)
    ) {
      setIsPromoteButtonDisabled(true);
    }

    //* Validates and compares if it has the same initial information, sorts and activates the button
    const arrayEqualsIgnoreOrder = (
      fixed: DiscipleFormData[],
      current: DiscipleFormData[]
    ): boolean => {
      const sortedA = Array.isArray(fixed[17]) && fixed[17]?.sort();
      const sortedB = Array.isArray(current[17]) && current[17]?.sort();

      return JSON.stringify(sortedA) === JSON.stringify(sortedB);
    };

    if (
      arrayEqualsIgnoreOrder(fixedValues, currentValues) &&
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
    theirFamilyGroup,
    recordStatus,
  ]);
};
