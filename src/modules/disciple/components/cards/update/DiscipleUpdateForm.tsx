import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertTriangle } from 'lucide-react';

import { useDiscipleUpdateEffects } from '@/modules/disciple/hooks/useDiscipleUpdateEffects';
import { useDiscipleUpdateMutation } from '@/modules/disciple/hooks/useDiscipleUpdateMutation';
import { useDisciplePromoteButtonLogic } from '@/modules/disciple/hooks/useDisciplePromoteButtonLogic';
import { useDiscipleUpdateSubmitButtonLogic } from '@/modules/disciple/hooks/useDiscipleUpdateSubmitButtonLogic';

import { discipleFormSchema } from '@/modules/disciple/validations/disciple-form-schema';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { DiscipleFormSkeleton } from '@/modules/disciple/components/cards/update/DiscipleFormSkeleton';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { cn } from '@/shared/lib/utils';

import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionDisciple } from '@/modules/disciple/components/alerts/AlertPromotionDisciple';
import { AlertUpdateRelationDisciple } from '@/modules/disciple/components/alerts/AlertUpdateRelationDisciple';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { SupervisorsSelect } from '@/shared/components/selects/SupervisorsSelect';
import { FamilyGroupsSelect } from '@/shared/components/selects/FamilyGroupsSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

interface DiscipleFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: DiscipleResponse | undefined;
}

export const DiscipleUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: DiscipleFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirFamilyGroupOpen, setIsInputTheirFamilyGroupOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirFamilyGroup?.id);
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
  const form = useForm<z.infer<typeof discipleFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(discipleFormSchema),
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
      roles: [MemberRole.Disciple],
      recordStatus: '',
      theirFamilyGroup: '',
      theirSupervisor: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirSupervisor = form.watch('theirSupervisor');
  const theirFamilyGroup = form.watch('theirFamilyGroup');
  const relationType = form.watch('relationType');

  //* Effects
  useEffect(() => {
    if (data && data?.theirFamilyGroup?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      form.setValue('theirPastor', '');
    }
    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirFamilyGroup', '');
    }
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      form.setValue('theirPastor', '');
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
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);

  //* Custom Hooks
  useDiscipleUpdateEffects({
    id,
    data,
    setIsLoadingData,
    setMinistryBlocks,
    discipleUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useDisciplePromoteButtonLogic({
    data,
    ministryBlocks,
    discipleUpdateForm: form,
    setIsPromoteButtonDisabled,
  });

  useDiscipleUpdateSubmitButtonLogic({
    discipleUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    ministryBlocks,
  });

  const discipleUpdateMutation = useDiscipleUpdateMutation({
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
  const familyGroupsQuery = useQuery({
    queryKey: ['family-groups', id],
    queryFn: async () => await getSimpleFamilyGroups({ isSimpleQuery: false }),
    retry: false,
  });

  const supervisorsQuery = useQuery({
    queryKey: ['supervisors', id],
    queryFn: async () => await getSimpleSupervisors({ isNullZone: false, isSimpleQuery: true }),
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
  const handleSubmit = (formData: z.infer<typeof discipleFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    discipleUpdateMutation.mutate({
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
        Modificar información del Discípulo
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <DiscipleFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[17px] md:text-[18px] mb-4 ml-0 md:pl-4'>
                Discípulo: {data?.member?.firstNames} {data?.member?.lastNames}
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
                      moduleName='disciple'
                      showSubtitles={false}
                    />

                    {/* Relations */}

                    {!isMessagePromoteDisabled && (
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px]'>
                        Relaciones
                      </legend>
                    )}

                    {!isMessagePromoteDisabled &&
                      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
                        relationType ===
                          RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                        <FamilyGroupsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirFamilyGroupOpen={isInputTheirFamilyGroupOpen}
                          setIsInputTheirFamilyGroupOpen={setIsInputTheirFamilyGroupOpen}
                          queryFamilyGroups={familyGroupsQuery}
                          setChangedId={setChangedId}
                        />
                      )}

                    <AlertUpdateRelationDisciple
                      data={data}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      familyGroupsQuery={familyGroupsQuery}
                      discipleUpdateForm={form}
                      setChangedId={setChangedId}
                      changedId={changedId}
                    />

                    {relationType === RelationType.OnlyRelatedMinistries &&
                      !isMessagePromoteDisabled && (
                        <PastorsSelect
                          form={form as any}
                          isInputDisabled={isInputDisabled}
                          isInputTheirPastorOpen={isInputTheirPastorOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
                          queryPastors={queryPastors}
                          fieldName='theirPastor'
                        />
                      )}

                    {/*  Ministry Blocks */}
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

                    {/* New Relations Promote */}
                    {isMessagePromoteDisabled && (
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px]'>
                        Nuevas Relaciones
                      </legend>
                    )}

                    {/* Promotion message */}
                    {isMessagePromoteDisabled && (
                      <span className='text-[14px] md:text-[14px] dark:text-yellow-500 text-amber-500 font-bold text-center'>
                        !SE HA PROMOVIDO CORRECTAMENTE! <br />
                        <span className='text-[14px] md:text-[14px]'>
                          <div>
                            <span className='text-red-500 text-center inline-block'>
                              Roles anteriores: Discípulo
                            </span>
                            <br />
                            <span className='text-green-500 text-center inline-block'>
                              Roles nuevos: Predicador
                            </span>
                          </div>
                        </span>
                      </span>
                    )}

                    {/* Selects if direct relation or not */}
                    {isPromoteButtonDisabled &&
                      isInputDisabled &&
                      !theirFamilyGroup &&
                      relationType !== RelationType.OnlyRelatedMinistries && (
                        <SupervisorsSelect
                          form={form as any}
                          isRelationSelectDisabled={isRelationSelectDisabled}
                          isInputTheirSupervisorOpen={isInputTheirSupervisorOpen}
                          setIsInputTheirSupervisorOpen={setIsInputTheirSupervisorOpen}
                          querySupervisors={supervisorsQuery}
                        />
                      )}

                    {/* Alert messages ok - missing */}
                    {isPromoteButtonDisabled &&
                      !theirSupervisor &&
                      form.getValues('roles').includes(MemberRole.Preacher) && (
                        <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                          Debes asignar la nueva relación antes de promover los roles
                        </span>
                      )}

                    {isPromoteButtonDisabled &&
                      theirSupervisor &&
                      form.getValues('roles').includes(MemberRole.Preacher) && (
                        <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-green-500'>
                          Todo está listo, guarda los cambios para promover al Discípulo
                        </span>
                      )}

                    <AlertPromotionDisciple
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      discipleUpdateForm={form}
                      isInputDisabled={isInputDisabled}
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
                        discipleUpdateMutation?.isPending &&
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
                      {discipleUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
