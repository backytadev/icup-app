import { useEffect, useState } from 'react';

import { type z } from 'zod';

import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { useSupervisorUpdateEffects } from '@/modules/supervisor/hooks/useSupervisorUpdateEffects';
import { useSupervisorUpdateMutation } from '@/modules/supervisor/hooks/useSupervisorUpdateMutation';
import { useSupervisorPromoteButtonLogic } from '@/modules/supervisor/hooks/useSupervisorPromoteButtonLogic';
import { useSupervisorUpdateSubmitButtonLogic } from '@/modules/supervisor/hooks/useSupervisorUpdateSubmitButtonLogic';

import { supervisorFormSchema } from '@/modules/supervisor/validations/supervisor-form-schema';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { SupervisorFormSkeleton } from '@/modules/supervisor/components/cards/update/SupervisorFormSkeleton';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';

import { cn } from '@/shared/lib/utils';
import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionSupervisor } from '@/modules/supervisor/components/alerts/AlertPromotionSupervisor';
import { AlertUpdateRelationSupervisor } from '@/modules/supervisor/components/alerts/AlertUpdateRelationSupervisor';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { CopastorsSelect } from '@/shared/components/selects/CopastorsSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

interface SupervisorFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: SupervisorResponse | undefined;
}

export const SupervisorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: SupervisorFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirCopastorOpen, setIsInputTheirCopastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputTheirPastorRelationDirectOpen, setIsInputTheirPastorRelationDirectOpen] =
    useState<boolean>(false);
  const [isInputTheirPastorOnlyMinistryOpen, setIsInputTheirPastorOnlyMinistryOpen] =
    useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirCopastor?.id);
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
  const form = useForm<z.infer<typeof supervisorFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(supervisorFormSchema),
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
      roles: [MemberRole.Supervisor],
      relationType: '',
      recordStatus: '',
      theirCopastor: '',
      theirPastor: '',
      theirPastorRelationDirect: '',
      theirPastorOnlyMinistries: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const relationType = form.watch('relationType');
  const theirPastor = form.watch('theirPastor');
  const theirCopastor = form.watch('theirCopastor');
  const theirPastorOnlyMinistries = form.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = form.watch('theirPastorRelationDirect');
  const roles = form.watch('roles');

  //* Effects
  useEffect(() => {
    if (data && data?.theirCopastor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  useEffect(() => {
    if (relationType === RelationType.RelatedDirectToPastor) {
      form.setValue('theirCopastor', '');
      form.setValue('theirPastorOnlyMinistries', '');
    }
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      form.setValue('theirPastorOnlyMinistries', '');
      form.setValue('theirPastorRelationDirect', '');
    }
    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirCopastor', '');
      form.setValue('theirPastorRelationDirect', '');
    }
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      form.setValue('theirPastorOnlyMinistries', '');
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
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom Hooks
  useSupervisorUpdateEffects({
    id,
    data,
    setIsLoadingData,
    setMinistryBlocks,
    supervisorUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useSupervisorPromoteButtonLogic({
    data,
    supervisorUpdateForm: form,
    setIsPromoteButtonDisabled,
    ministryBlocks,
  });

  useSupervisorUpdateSubmitButtonLogic({
    supervisorUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    ministryBlocks,
  });

  const supervisorUpdateMutation = useSupervisorUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  const {
    addMinistryBlock,
    removeMinistryBlock,
    handleSelectChurch,
    toggleRoleInBlock,
    updateMinistryBlock,
  } = useMinistryBlocks({ setMinistryBlocks });

  //* Queries
  const copastorsQuery = useQuery({
    queryKey: ['copastors', id],
    queryFn: () => getSimpleCopastors({ isSimpleQuery: true }),
    retry: false,
  });

  const queryChurches = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const queryPastors = useQuery({
    queryKey: ['pastors'],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof supervisorFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    supervisorUpdateMutation.mutate({
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
  const currentBlockMinistryId = ministryBlocks.map((block) => block.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryId).size !== currentBlockMinistryId.length;

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Supervisor
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <SupervisorFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 md:pl-4'>
                Supervisor: {data?.member?.firstNames} {data?.member?.lastNames}
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
                    moduleName='Supervisor'
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
                      moduleName='supervisor'
                      showSubtitles={false}
                    />

                    {/* Relaciones  */}
                    {!isMessagePromoteDisabled && (
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px]'>
                        Relaciones
                      </legend>
                    )}

                    {!isMessagePromoteDisabled &&
                      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
                        relationType ===
                          RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                        <CopastorsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirCopastorOpen={isInputTheirCopastorOpen}
                          setIsInputTheirCopastorOpen={setIsInputTheirCopastorOpen}
                          queryCopastors={copastorsQuery}
                          setChangedId={setChangedId}
                          className='mt-0'
                        />
                      )}

                    {relationType === RelationType.OnlyRelatedMinistries &&
                      !isMessagePromoteDisabled && (
                        <PastorsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirPastorOpen={isInputTheirPastorOnlyMinistryOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorOnlyMinistryOpen}
                          queryPastors={queryPastors}
                          fieldName='theirPastorOnlyMinistries'
                          className='mt-0'
                        />
                      )}

                    {relationType === RelationType.RelatedDirectToPastor &&
                      !isMessagePromoteDisabled && (
                        <PastorsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirPastorOpen={isInputTheirPastorRelationDirectOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorRelationDirectOpen}
                          queryPastors={queryPastors}
                          fieldName='theirPastorRelationDirect'
                          className='mt-0'
                        />
                      )}

                    <AlertUpdateRelationSupervisor
                      data={data}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      copastorsQuery={copastorsQuery}
                      supervisorUpdateForm={form}
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
                          queryChurches={queryChurches}
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

                    {/* Raise level according case */}
                    {isMessagePromoteDisabled && (
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px] my-4'>
                        Nuevas Relaciones
                      </legend>
                    )}

                    {isMessagePromoteDisabled && (
                      <p className='text-[14px] md:text-[14px] dar:text-yellow-500 text-amber-500 font-bold text-center'>
                        !SE HA PROMOVIDO CORRECTAMENTE! <br />
                        <span className='text-[14px] md:text-[14px]'>
                          {form.getValues('roles').includes(MemberRole.Copastor) &&
                            !data?.member?.roles.includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Supervisor
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Co-Pastor
                                </span>
                              </div>
                            )}
                          {form.getValues('roles').includes(MemberRole.Copastor) &&
                            data?.member?.roles.includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Supervisor - Tesorero
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Co-Pastor
                                </span>
                              </div>
                            )}
                        </span>
                      </p>
                    )}

                    {/* Select new relations */}
                    {isPromoteButtonDisabled &&
                      isInputDisabled &&
                      roles.includes(MemberRole.Copastor) && (
                        <PastorsSelect
                          form={form as any}
                          isRelationSelectDisabled={isRelationSelectDisabled}
                          isInputTheirPastorOpen={isInputTheirPastorOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
                          queryPastors={queryPastors}
                          fieldName='theirPastor'
                          className='mt-0'
                        />
                      )}

                    {isPromoteButtonDisabled &&
                      !theirCopastor &&
                      !theirPastorOnlyMinistries &&
                      !theirPastorRelationDirect &&
                      !theirPastor &&
                      form.getValues('roles').includes(MemberRole.Copastor) &&
                      !data?.member?.roles.includes(MemberRole.Treasurer) && (
                        <span className='mt-0 text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                          Debes asignar la nueva relación antes de promover los roles
                        </span>
                      )}

                    {isPromoteButtonDisabled &&
                      !theirCopastor &&
                      !theirPastorOnlyMinistries &&
                      !theirPastorRelationDirect &&
                      theirPastor &&
                      form.getValues('roles').includes(MemberRole.Copastor) &&
                      !data?.member?.roles.includes(MemberRole.Treasurer) && (
                        <span className='mt-0 text-[12.5px] md:text-[13px] font-bold text-center text-green-500'>
                          Todo está listo, guarda los cambios para promover al Supervisor
                        </span>
                      )}

                    <AlertPromotionSupervisor
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      supervisorUpdateForm={form}
                    />

                    <div>
                      <p className='text-red-500 text-[13.5px] md:text-[14px] font-bold mb-2'>
                        Consideraciones
                      </p>
                      <p className='text-[12.5px] md:text-[13px] mb-2 font-medium '>
                        ❌ Mientras estés en modo de edición y los datos cambien no podrás promover
                        de cargo.{' '}
                      </p>
                      <p className='text-[12.5px] md:text-[13px] font-medium '>
                        ❌ Mientras el &#34;Estado&#34; sea{' '}
                        <span className='text-red-500 font-bold'>Inactivo</span> no podrás promover
                        de cargo.
                      </p>
                    </div>
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
                        supervisorUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputDisabled(true);
                            setIsRelationSelectDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {supervisorUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
