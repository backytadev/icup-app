import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { PreacherFieldNames } from '@/modules/preacher/enums/preacher-field-names.enum';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePreacherPromoteButtonLogic = ({
  preacherUpdateForm,
  setIsPromoteButtonDisabled,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<PreacherFormData[]>([]);
  const [lastValues, setLastValues] = useState<PreacherFormData[]>([]);

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

  const theirSupervisor = preacherUpdateForm.watch('theirSupervisor');

  //? Effects
  //* Setea los valores fijos en un estado
  useEffect(() => {
    const initialValues = preacherUpdateForm.getValues([...Object.values(PreacherFieldNames)]);
    setFixedValues(initialValues);
  }, []);

  useEffect(() => {
    //* Asigna los previous values y los current values
    const previousValues: PreacherFormData[] = lastValues;
    const currentValues: PreacherFormData[] = preacherUpdateForm.getValues([
      ...Object.values(PreacherFieldNames),
    ]);

    //* Valida si hay algún cambio y coloca a true el promote button
    if (
      previousValues.length !== 0 &&
      JSON.stringify(fixedValues) === JSON.stringify(previousValues)
    ) {
      setIsPromoteButtonDisabled(true);
    }

    //* Valida y compara si tiene la misma información inicial, ordena y activa el botón
    const arrayEqualsIgnoreOrder = (
      fixed: PreacherFormData[],
      current: PreacherFormData[]
    ): boolean => {
      const sortedA = Array.isArray(fixed['17']) && fixed[17]?.sort();
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

    //* Si no hay coincidencias setea el current value al lastValues
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
  ]);
};
