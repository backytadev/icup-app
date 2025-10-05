import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';
import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { pastorFormSchema } from '@/modules/pastor/validations/pastor-form-schema';

import { usePastorCreationMutation } from '@/modules/pastor/hooks/usePastorCreationMutation';
import { usePastorCreationSubmitButtonLogic } from '@/modules/pastor/hooks/usePastorCreationSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { PageSubTitle } from '@/shared/components/page-header/PageSubTitle';

import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { BasicMemberForm } from '@/shared/components/forms/BasicMemberForm';
import { MinistryMemberForm } from '@/shared/components/forms/MinistryMemberForm';

import { ChurchSelect } from '@/shared/components/selects/ChurchSelect';
import { RoleMemberCheckBox } from '@/shared/components/selects/RoleMemberCheckBox';
import { RelationTypeSelect } from '@/shared/components/selects/RelationTypeSelect';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';

export const PastorCreatePage = (): JSX.Element => {
  //* States
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [ministryBlocks, setMinistryBlocks] = useState<MinistryMemberBlock[]>([
    {
      churchId: null,
      ministryType: null,
      ministryId: null,
      ministryRoles: [],
      churchPopoverOpen: false,
      ministryPopoverOpen: false,
      ministries: [],
    },
  ]);

  //* Library hooks
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof pastorFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(pastorFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      conversionDate: undefined,
      numberChildren: '',
      maritalStatus: '',
      email: '',
      phoneNumber: '',
      residenceCountry: Country.Perú,
      residenceDepartment: Department.Lima,
      residenceProvince: Province.Lima,
      residenceDistrict: '',
      residenceAddress: '',
      referenceAddress: '',
      relationType: undefined,
      roles: [MemberRole.Disciple],
      theirChurch: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const relationType = form.watch('relationType');
  const residenceDistrict = form.watch('residenceDistrict');

  usePastorCreationSubmitButtonLogic({
    pastorCreationForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Effects
  useEffect(() => {
    form.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  useEffect(() => {
    document.title = 'Modulo Pastor - IcupApp';
  }, []);

  useEffect(() => {
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover ||
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
    ) {
      form.setValue('theirChurch', '');
    }
  }, [relationType]);

  useEffect(() => {
    if (
      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
        relationType === RelationType.RelatedDirectToPastor) &&
      ministryBlocks.length > 0
    ) {
      setMinistryBlocks([
        {
          churchId: null,
          ministryType: null,
          ministryId: null,
          ministryRoles: [],
          churchPopoverOpen: false,
          ministryPopoverOpen: false,
          ministries: [],
        },
      ]);
    }
  }, [relationType]);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);

  //* Custom hooks
  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  const pastorCreationMutation = usePastorCreationMutation({
    pastorCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  const {
    addMinistryBlock,
    removeMinistryBlock,
    handleSelectChurch,
    toggleRoleInBlock,
    updateMinistryBlock,
  } = useMinistryBlocks({ setMinistryBlocks });

  //* Queries
  const queryChurches = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof pastorFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    pastorCreationMutation.mutate({
      ...formData,
      theirMinistries: ministriesData.some(
        (item) => !item.ministryId || item.ministryRoles?.length === 0
      )
        ? []
        : ministriesData,
    });
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-pastor-color'>Modulo Pastor</PageTitle>

      <PageSubTitle
        subTitle='Crear un nuevo pastor'
        description='Por favor llena los siguientes datos para crear un nuevo pastor.'
      />

      <div className='flex min-h-screen flex-col items-center justify-between px-6 py-4 sm:px-8 sm:py-6 lg:py-6 xl:px-14 2xl:px-[5rem]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10'
          >
            {/* Basic Form */}
            <BasicMemberForm
              form={form as any}
              isInputDisabled={isInputDisabled}
              isInputBirthDateOpen={isInputBirthDateOpen}
              setIsInputBirthDateOpen={setIsInputBirthDateOpen}
              isInputConvertionDateOpen={isInputConvertionDateOpen}
              setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
              residenceDistrict={residenceDistrict}
              districtsValidation={districtsValidation}
              urbanSectorsValidation={urbanSectorsValidation}
            />

            {/* Roles */}
            <div className='sm:col-start-1 sm:col-end-2 sm:row-start-2 sm:row-end-3 h-auto'>
              <RoleMemberCheckBox
                form={form as any}
                isInputDisabled={isInputDisabled}
                disabledRoles={disabledRoles}
              />
            </div>

            {/* Relations */}
            <div className='sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3'>
              <legend className='font-bold col-start-1 col-end-3 text-[16.5px] sm:text-[18px]'>
                Relaciones
              </legend>

              <RelationTypeSelect
                form={form as any}
                isInputDisabled={isInputDisabled}
                moduleName='pastor'
              />

              {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
                relationType === RelationType.OnlyRelatedHierarchicalCover) && (
                <ChurchSelect
                  form={form as any}
                  isInputDisabled={isInputDisabled}
                  isInputTheirChurchOpen={isInputTheirChurchOpen}
                  setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
                  queryChurches={queryChurches}
                />
              )}
            </div>

            {/* Ministries */}
            {relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover && (
              <div className='w-full border-t border-gray-300 pt-4 flex flex-col space-y-6 sm:col-start-1 sm:col-end-3'>
                <MinistryMemberForm
                  isInputDisabled={isInputDisabled}
                  addMinistryBlock={addMinistryBlock}
                  ministryBlocks={ministryBlocks}
                  updateMinistryBlock={updateMinistryBlock}
                  queryChurches={queryChurches}
                  handleSelectChurch={handleSelectChurch}
                  toggleRoleInBlock={toggleRoleInBlock}
                  removeMinistryBlock={removeMinistryBlock}
                />
              </div>
            )}

            {/* Validation message */}
            {isMessageErrorDisabled ||
            (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
              ministryBlocks.some(
                (item) =>
                  !item.churchId ||
                  !item.ministryId ||
                  !item.ministryType ||
                  item.ministryRoles.length === 0
              )) ? (
              <p className='mt-0 -mb-4 md:-mt-5 md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-5 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='order-last -mt-3 md:-mt-6 md:col-start-1 md:col-end-3 md:row-start-5 md:row-end-6 mx-auto md:w-[70%] lg:w-[50%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente!
              </p>
            )}

            {/* Submit button */}
            <div className='md:mt-3 lg:mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  pastorCreationMutation?.isPending &&
                    'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[16px] text-white'
                )}
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsSubmitButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                {pastorCreationMutation?.isPending ? 'Procesando...' : 'Registrar Pastor'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PastorCreatePage;
