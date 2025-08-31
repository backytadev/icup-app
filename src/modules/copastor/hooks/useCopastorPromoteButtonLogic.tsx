import { useEffect, useState } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { CopastorFieldNames } from '@/modules/copastor/enums/copastor-field-names.enum';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

import { rolesEqualIgnoreOrder } from '@/shared/helpers/normalize-compare-ministries';

interface Options {
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCopastorPromoteButtonLogic = ({
  copastorUpdateForm,
  setIsPromoteButtonDisabled,
}: Options): any => {
  //* States
  const [fixedValues, setFixedValues] = useState<CopastorFormData[]>([]);
  const [lastValues, setLastValues] = useState<CopastorFormData[]>([]);

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

  const theirPastor = copastorUpdateForm.watch('theirPastor');

  //? Effects
  useEffect(() => {
    //* Setea los valores fijos en un estado
    const initialValues = copastorUpdateForm.getValues([...Object.values(CopastorFieldNames)]);
    setFixedValues(initialValues);
  }, []);

  useEffect(() => {
    //* Asigna los previous values y los current values
    const previousValues: CopastorFormData[] = lastValues;
    const currentValues: CopastorFormData[] = copastorUpdateForm.getValues([
      ...Object.values(CopastorFieldNames),
    ]);

    //* Valida si hay algún cambio y coloca a true el promote button
    if (
      previousValues.length !== 0 &&
      JSON.stringify(fixedValues) === JSON.stringify(previousValues)
    ) {
      setIsPromoteButtonDisabled(true);
    }

    //* Valida y compara si tiene la misma información inicial, ordena y activa el botón
    if (
      rolesEqualIgnoreOrder(fixedValues, currentValues) &&
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
    theirPastor,
    recordStatus,
  ]);
};
