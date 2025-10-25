import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertTriangle } from 'lucide-react';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { copastorFormSchema } from '@/modules/copastor/validations/copastor-form-schema';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { CopastorFormSkeleton } from '@/modules/copastor/components/cards/update/CopastorFormSkeleton';

import { useCopastorUpdateEffects } from '@/modules/copastor/hooks/useCopastorUpdateEffects';
import { useCopastorUpdateMutation } from '@/modules/copastor/hooks/useCopastorUpdateMutation';
import { useCopastorPromoteButtonLogic } from '@/modules/copastor/hooks/useCopastorPromoteButtonLogic';
import { useCopastorUpdateSubmitButtonLogic } from '@/modules/copastor/hooks/useCopastorUpdateSubmitButtonLogic';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { cn } from '@/shared/lib/utils';
import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionCopastor } from '@/modules/copastor/components/alerts/AlertPromotionCopastor';
import { AlertUpdateRelationCopastor } from '@/modules/copastor/components/alerts/AlertUpdateRelationCopastor';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { ChurchesSelect } from '@/shared/components/selects/ChurchesSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

interface CopastorFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: CopastorResponse | undefined;
}

export const CopastorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: CopastorFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirPastor?.id);
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
  const form = useForm<z.infer<typeof copastorFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(copastorFormSchema),
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
      roles: [MemberRole.Copastor],
      recordStatus: '',
      theirPastor: '',
      theirChurch: '',
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirChurch = form.watch('theirChurch');
  const theirPastor = form.watch('theirPastor');
  const relationType = form.watch('relationType');
  const roles = form.watch('roles');

  //* Effects
  useEffect(() => {
    if (data && data?.theirPastor?.id !== changedId) {
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
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom Hooks

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useCopastorUpdateEffects({
    id,
    data,
    setIsLoadingData,
    copastorUpdateForm: form,
    setMinistryBlocks,
  });

  useCopastorPromoteButtonLogic({
    copastorUpdateForm: form,
    setIsPromoteButtonDisabled,
    ministryBlocks,
    data,
  });

  useCopastorUpdateSubmitButtonLogic({
    copastorUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isRelationSelectDisabled,
    ministryBlocks,
  });

  const copastorUpdateMutation = useCopastorUpdateMutation({
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
  const pastorsQuery = useQuery({
    queryKey: ['pastors', id],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches', id],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof copastorFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    copastorUpdateMutation.mutate({
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
        Modificar información del Co-Pastor
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <CopastorFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] pl-0 mb-4 md:pl-4'>
                Co-Pastor: {data?.member?.firstNames} {data?.member?.lastNames}
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
                    moduleName='Co-Pastor'
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
                      moduleName='copastor'
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
                        <PastorsSelect
                          form={form as any}
                          isInputTheirPastorOpen={isInputTheirPastorOpen}
                          setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
                          isInputDisabled={isInputDisabled}
                          queryPastors={pastorsQuery}
                          fieldName={'theirPastor'}
                          className={'mt-0'}
                          setChangedId={setChangedId}
                        />
                      )}

                    <AlertUpdateRelationCopastor
                      data={data}
                      changedId={changedId}
                      setChangedId={setChangedId}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      copastorUpdateForm={form}
                      pastorsQuery={pastorsQuery}
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
                          {form.getValues('roles').includes(MemberRole.Pastor) &&
                            !form.getValues('roles').includes(MemberRole.Presbyter) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Co-Pastor
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Pastor
                                </span>
                              </div>
                            )}
                          {form.getValues('roles').includes(MemberRole.Pastor) &&
                            form.getValues('roles').includes(MemberRole.Presbyter) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Co-Pastor - Presbítero
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Pastor - Presbítero
                                </span>
                              </div>
                            )}
                        </span>
                      </span>
                    )}

                    {/* Select new relations  */}
                    {isPromoteButtonDisabled &&
                      isInputDisabled &&
                      !theirPastor &&
                      roles.includes(MemberRole.Pastor) && (
                        <ChurchesSelect
                          form={form}
                          isRelationSelectDisabled={isRelationSelectDisabled}
                          isInputTheirChurchOpen={isInputTheirChurchOpen}
                          setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
                          queryChurches={churchesQuery}
                          className='mt-0'
                        />
                      )}

                    {/* Alert messages ok - missing */}
                    {isPromoteButtonDisabled &&
                      !theirChurch &&
                      form.getValues('roles').includes(MemberRole.Pastor) && (
                        <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                          Debes asignar la nueva relación antes de promover los roles
                        </span>
                      )}

                    {isPromoteButtonDisabled &&
                      theirChurch &&
                      form.getValues('roles').includes(MemberRole.Pastor) && (
                        <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-green-500'>
                          Todo está listo, guarda los cambios para promover al Co-Pastor
                        </span>
                      )}

                    <AlertPromotionCopastor
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      copastorUpdateForm={form}
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
                        copastorUpdateMutation?.isPending &&
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
                      {copastorUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
