import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { MemberRole } from '@/shared/enums/member-role.enum';

import { pastorFormSchema } from '@/modules/pastor/validations/pastor-form-schema';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { PastorFormSkeleton } from '@/modules/pastor/components/cards/update/PastorFormSkeleton';

import { usePastorUpdateEffects } from '@/modules/pastor/hooks/usePastorUpdateEffects';
import { usePastorUpdateMutation } from '@/modules/pastor/hooks/usePastorUpdateMutation';
import { usePastorUpdateSubmitButtonLogic } from '@/modules/pastor/hooks/usePastorUpdateSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertUpdateRelationPastor } from '@/modules/pastor/components/alerts/AlertUpdateRelationPastor';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

import { ChurchesSelect } from '@/shared/components/selects/ChurchesSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

interface PastorFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: PastorResponse | undefined;
}

export const PastorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: PastorFormUpdateProps): JSX.Element => {
  //* States
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirChurch?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
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

  //* Hooks (external libraries)
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
      maritalStatus: '',
      numberChildren: '',
      conversionDate: undefined,
      email: '',
      phoneNumber: '',
      residenceCountry: '',
      residenceDepartment: '',
      residenceProvince: '',
      residenceDistrict: '',
      residenceUrbanSector: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [MemberRole.Pastor],
      recordStatus: '',
      theirChurch: '',
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const relationType = form.watch('relationType');

  //* Effects
  useEffect(() => {
    if (data && data?.theirChurch?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover && ministryBlocks.length > 0) {
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

  //* Custom Hooks
  usePastorUpdateEffects({
    id,
    data,
    setIsLoadingData,
    pastorUpdateForm: form,
    setMinistryBlocks,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  usePastorUpdateSubmitButtonLogic({
    pastorUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    ministryBlocks,
  });

  const pastorUpdateMutation = usePastorUpdateMutation({
    dialogClose,
    scrollToTop,
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
  const churchesQuery = useQuery({
    queryKey: ['churches', id],
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

    pastorUpdateMutation.mutate({
      id: id,
      formData: {
        ...formData,
        theirMinistries: ministriesData.some(
          (item) => !item.ministryId || item.ministryRoles?.length === 0
        )
          ? []
          : ministriesData,
      },
    });
  };

  //* Validation if there are duplicate ministries in the ministry blocks
  const currentBlockMinistryIds = ministryBlocks.map((block) => block.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryIds).size !== currentBlockMinistryIds.length;

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Pastor
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <PastorFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] pl-0 mb-4 md:pl-4'>
                Pastor: {data?.member?.firstNames} {data?.member?.lastNames}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  {/* First Block adn Second block */}
                  <BasicMemberUpdateForm
                    form={form}
                    isInputDisabled={isInputDisabled}
                    isInputBirthDateOpen={isInputBirthDateOpen}
                    setIsInputBirthDateOpen={setIsInputBirthDateOpen}
                    isInputConvertionDateOpen={isInputConvertionDateOpen}
                    setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
                    residenceDistrict={residenceDistrict}
                    districtsValidation={districtsValidation}
                    urbanSectorsValidation={urbanSectorsValidation}
                    disabledRoles={disabledRoles}
                    moduleName='Pastor'
                  />

                  {/* Third Block */}
                  <div className='sm:col-start-3 sm:col-end-4 flex flex-col gap-4'>
                    <span className='font-bold text-[15px] sm:text-[16px]'>
                      Roles / Ministerios
                    </span>

                    {/* Select relation type */}
                    <RelationTypesSelect
                      form={form as any}
                      isInputDisabled={isInputDisabled}
                      moduleName='pastor'
                      showSubtitles={false}
                    />

                    {/* Relations */}
                    <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px]'>
                      Relaciones
                    </legend>

                    {(relationType === RelationType.OnlyRelatedHierarchicalCover ||
                      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                      <ChurchesSelect
                        form={form}
                        isInputDisabled={isInputDisabled}
                        isInputTheirChurchOpen={isInputTheirChurchOpen}
                        setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
                        queryChurches={churchesQuery}
                        setChangedId={setChangedId}
                        className={'mt-0'}
                      />
                    )}

                    <AlertUpdateRelationPastor
                      data={data}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      churchesQuery={churchesQuery}
                      pastorUpdateForm={form}
                      setChangedId={setChangedId}
                      changedId={changedId}
                    />

                    {/* Ministries of member */}
                    {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
                      relationType === RelationType.OnlyRelatedMinistries) && (
                      <div className='w-full border-t border-gray-300 pt-4 flex flex-col space-y-6'>
                        <MinistryMemberUpdateForm
                          isInputDisabled={isInputDisabled}
                          addMinistryBlock={addMinistryBlock}
                          ministryBlocks={ministryBlocks}
                          updateMinistryBlock={updateMinistryBlock}
                          queryChurches={churchesQuery}
                          handleSelectChurch={handleSelectChurch}
                          toggleRoleInBlock={toggleRoleInBlock}
                          removeMinistryBlock={removeMinistryBlock}
                        />
                      </div>
                    )}

                    {/*  Alerta de duplicidad de ministerios */}
                    {hasDuplicates && (
                      <Alert
                        variant='destructive'
                        className='mt-2 bg-red-600 text-white border-red-700'
                      >
                        <AlertTriangle className='h-5 w-5' color='white' />
                        <AlertTitle>Ministerios duplicados detectados</AlertTitle>
                        <AlertDescription>
                          Cada miembro solo puede pertenecer a un ministerio. Los duplicados no se
                          guardarán.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Validation message */}
                  {isMessageErrorDisabled ? (
                    <p className='-mb-4 md:-mb-3 md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-3 mx-auto md:w-full text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-3 md:row-start-3 md:row-end-4 md:col-start-2 md:col-end-3 mx-auto md:w-full text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  {/* Submit button */}
                  <div className='sm:col-start-2 w-full'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        pastorUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
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
                      {pastorUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
