import { useEffect, useState } from 'react';

import { type z } from 'zod';

import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';

import { usePreacherUpdateEffects } from '@/modules/preacher/hooks/usePreacherUpdateEffects';
import { usePreacherUpdateMutation } from '@/modules/preacher/hooks/usePreacherUpdateMutation';
import { usePreacherPromoteButtonLogic } from '@/modules/preacher/hooks/usePreacherPromoteButtonLogic';
import { usePreacherUpdateSubmitButtonLogic } from '@/modules/preacher/hooks/usePreacherUpdateSubmitButtonLogic';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';

import { preacherFormSchema } from '@/modules/preacher/validations/preacher-form-schema';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { PreacherFormSkeleton } from '@/modules/preacher/components/cards/update/PreacherFormSkeleton';

import { cn } from '@/shared/lib/utils';

import { MemberRole } from '@/shared/enums/member-role.enum';

import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionPreacher } from '@/modules/preacher/components/alerts/AlertPromotionPreacher';
import { AlertUpdateRelationPreacher } from '@/modules/preacher/components/alerts/AlertUpdateRelationPreacher';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';

import { CopastorsSelect } from '@/shared/components/selects/CopastorsSelect';
import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { SupervisorsSelect } from '@/shared/components/selects/SupervisorsSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

interface PreacherFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: PreacherResponse | undefined;
}

export const PreacherUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: PreacherFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirCopastorOpen, setIsInputTheirCopastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOnlyMinistryOpen, setIsInputTheirPastorOnlyMinistryOpen] =
    useState<boolean>(false);
  const [isInputTheirPastorRelationDirectOpen, setIsInputTheirPastorRelationDirectOpen] =
    useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isCheckBoxDisabled, setIsCheckBoxDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [changedId, setChangedId] = useState(data?.theirSupervisor?.id);
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
  const form = useForm<z.infer<typeof preacherFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(preacherFormSchema),
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
      roles: [MemberRole.Preacher],
      recordStatus: '',
      theirCopastor: '',
      theirSupervisor: '',
      theirPastorOnlyMinistries: '',
      theirPastorRelationDirect: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirCopastor = form.watch('theirCopastor');
  const theirPastorRelationDirect = form.watch('theirPastorRelationDirect');
  const isDirectRelationToPastor = form.watch('isDirectRelationToPastor');
  const relationType = form.watch('relationType');
  const roles = form.watch('roles');

  //* Effects
  useEffect(() => {
    if (data && data?.theirSupervisor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      form.setValue('theirPastorOnlyMinistries', '');
    }
    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirSupervisor', '');
    }
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      form.setValue('theirPastorOnlyMinistries', '');
    }
  }, [relationType]);

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
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom Hooks
  usePreacherUpdateEffects({
    id,
    data,
    setIsLoadingData,
    setMinistryBlocks,
    preacherUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  usePreacherPromoteButtonLogic({
    data,
    preacherUpdateForm: form,
    setIsPromoteButtonDisabled,
    ministryBlocks,
  });

  usePreacherUpdateSubmitButtonLogic({
    preacherUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isRelationSelectDisabled,
    ministryBlocks,
  });

  const preacherUpdateMutation = usePreacherUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
    setIsCheckBoxDisabled,
  });

  const {
    addMinistryBlock,
    removeMinistryBlock,
    handleSelectChurch,
    toggleRoleInBlock,
    updateMinistryBlock,
  } = useMinistryBlocks({ setMinistryBlocks });

  //* Queries
  const supervisorsQuery = useQuery({
    queryKey: ['supervisors', id],
    queryFn: () => getSimpleSupervisors({ isNullZone: false, isSimpleQuery: true }),
    retry: false,
  });

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
  const handleSubmit = (formData: z.infer<typeof preacherFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    preacherUpdateMutation.mutate({
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
        Modificar información del Predicador
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <PreacherFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 pl-0 md:pl-4'>
                Predicador: {data?.member?.firstNames} {data?.member?.lastNames}
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
                    moduleName='Predicador'
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
                      moduleName='preacher'
                      showSubtitles={false}
                    />

                    {/* Relaciones  */}
                    {!isMessagePromoteDisabled && (
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] md:text-[16px]'>
                        Relaciones
                      </legend>
                    )}

                    {!isMessagePromoteDisabled &&
                      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
                        relationType ===
                          RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                        <SupervisorsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirSupervisorOpen={isInputTheirSupervisorOpen}
                          setIsInputTheirSupervisorOpen={setIsInputTheirSupervisorOpen}
                          querySupervisors={supervisorsQuery}
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

                    <AlertUpdateRelationPreacher
                      data={data}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      supervisorsQuery={supervisorsQuery}
                      preacherUpdateForm={form}
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

                    {/* Promotion message */}
                    {isMessagePromoteDisabled && (
                      <p className='text-[14px] md:text-[14px] dark:text-yellow-500 text-amber-500 font-bold text-center mx-auto'>
                        !SE HA PROMOVIDO CORRECTAMENTE! <br />
                        <span className='text-[14px] md:text-[14px]'>
                          {form.getValues('roles').includes(MemberRole.Supervisor) &&
                            !form.getValues('roles').includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Predicador
                                </span>
                                <br />
                                <span className='text-green-500  text-center inline-block'>
                                  Roles nuevos: Supervisor
                                </span>
                              </div>
                            )}

                          {form.getValues('roles').includes(MemberRole.Supervisor) &&
                            form.getValues('roles').includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500  text-center inline-block'>
                                  Roles anteriores: Predicador - Tesorero
                                </span>
                                <br />
                                <span className='text-green-500  text-center inline-block'>
                                  Roles nuevos: Supervisor - Tesorero
                                </span>
                              </div>
                            )}
                        </span>
                      </p>
                    )}

                    {/* Select new relations */}
                    {isPromoteButtonDisabled && isInputDisabled && isMessagePromoteDisabled && (
                      <FormField
                        control={form.control}
                        name='isDirectRelationToPastor'
                        render={({ field }) => (
                          <FormItem className='flex flex-row gap-2 items-center mt-2 px-1 py-3 h-[2.5rem]'>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Checkbox
                                className={cn(isCheckBoxDisabled && 'bg-slate-500')}
                                disabled={isCheckBoxDisabled}
                                checked={field?.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                }}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel className='text-[14px] cursor-pointer md:text-[14px]'>
                                ¿Este registro estará relacionado directamente con un pastor?
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    {isPromoteButtonDisabled &&
                      isInputDisabled &&
                      !isDirectRelationToPastor &&
                      roles.includes(MemberRole.Supervisor) && (
                        <CopastorsSelect
                          form={form}
                          isInputTheirCopastorOpen={isInputTheirCopastorOpen}
                          setIsInputTheirCopastorOpen={setIsInputTheirCopastorOpen}
                          isRelationSelectDisabled={isRelationSelectDisabled}
                          queryCopastors={copastorsQuery}
                        />
                      )}

                    {isPromoteButtonDisabled &&
                      isInputDisabled &&
                      isDirectRelationToPastor &&
                      roles.includes(MemberRole.Supervisor) && (
                        <PastorsSelect
                          form={form}
                          isInputTheirPastorOpen={isInputTheirPastorRelationDirectOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorRelationDirectOpen}
                          isRelationSelectDisabled={isRelationSelectDisabled}
                          queryPastors={queryPastors}
                          fieldName='theirPastorRelationDirect'
                        />
                      )}

                    {/* Alert messages ok - missing */}
                    {isPromoteButtonDisabled &&
                      ((isDirectRelationToPastor && !theirPastorRelationDirect) ||
                        (!isDirectRelationToPastor && !theirCopastor)) &&
                      form.getValues('roles').includes(MemberRole.Supervisor) && (
                        <p className='mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-red-500 w-full'>
                          Debes asignar la nueva relación antes de promover los roles
                        </p>
                      )}

                    {isPromoteButtonDisabled &&
                      ((isDirectRelationToPastor && theirPastorRelationDirect) ||
                        (!isDirectRelationToPastor && theirCopastor)) &&
                      form.getValues('roles').includes(MemberRole.Supervisor) && (
                        <p className='mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-green-500'>
                          Todo está listo, guarda los cambios para promover al Predicador
                        </p>
                      )}

                    <AlertPromotionPreacher
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      preacherUpdateForm={form}
                    />

                    {/* Considerations */}
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
                        preacherUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputDisabled(true);
                            setIsRelationSelectDisabled(true);
                            setIsCheckBoxDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {preacherUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
