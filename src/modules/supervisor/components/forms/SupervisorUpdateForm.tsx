import { AlertTriangle, ArrowUpCircle, BookOpenCheck, Info } from 'lucide-react';

import { useSupervisorForm } from '@/modules/supervisor/hooks/forms';
import { type SupervisorResponse } from '@/modules/supervisor/types/supervisor-response.interface';
import { SupervisorFormSkeleton } from '@/modules/supervisor/components/SupervisorFormSkeleton';
import { AlertPromotionSupervisor } from '@/modules/supervisor/components/alerts/AlertPromotionSupervisor';
import { AlertUpdateRelationSupervisor } from '@/modules/supervisor/components/alerts/AlertUpdateRelationSupervisor';

import { cn } from '@/shared/lib/utils';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { CopastorsSelect } from '@/shared/components/selects/CopastorsSelect';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';
import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

interface SupervisorUpdateFormProps {
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
}: SupervisorUpdateFormProps): JSX.Element => {
  const {
    form,
    isLoadingData,
    isInputDisabled,
    setIsInputDisabled,
    isRelationSelectDisabled,
    setIsRelationSelectDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    isPromoteButtonDisabled,
    isMessagePromoteDisabled,
    setIsMessagePromoteDisabled,
    isInputBirthDateOpen,
    setIsInputBirthDateOpen,
    isInputConvertionDateOpen,
    setIsInputConvertionDateOpen,
    isInputTheirCopastorOpen,
    setIsInputTheirCopastorOpen,
    isInputTheirPastorRelationDirectOpen,
    setIsInputTheirPastorRelationDirectOpen,
    isInputTheirPastorOnlyMinistriesOpen,
    setIsInputTheirPastorOnlyMinistriesOpen,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    changedId,
    setChangedId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    district,
    districtsValidation,
    urbanSectorsValidation,
    disabledRoles,
    ministryBlocks,
    addMinistryBlock,
    removeMinistryBlock,
    updateMinistryBlock,
    toggleRoleInBlock,
    handleSelectChurch,
    copastorsQuery,
    pastorsQuery,
    churchesQuery,
    isPending,
    hasDuplicates,
    handleSubmit,
    handleRolePromotion,
  } = useSupervisorForm({ mode: 'update', id, data, dialogClose, scrollToTop });

  const relationType = form.watch('relationType');
  const theirPastor = form.watch('theirPastor');
  const roles = form.watch('roles');

  const isPromoted = roles.includes(MemberRole.Copastor);

  const showMinistryBlocks =
    relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
    relationType === RelationType.OnlyRelatedMinistries;

  const handlePromote = (): void => {
    handleRolePromotion();
    setIsMessagePromoteDisabled(true);
  };

  return (
    <div className='w-full max-w-[1100px] mx-auto -mt-2'>
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 px-6 py-5'>
        <div className='absolute inset-0 overflow-hidden text-white/10'>
          <div className='absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-current opacity-20' />
          <div className='absolute bottom-0 left-0 w-24 h-24 -ml-6 -mb-6 rounded-full bg-current opacity-10' />
        </div>
        <div className='relative z-10 flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter uppercase tracking-wider'>
              Actualización
            </span>
            <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter uppercase tracking-wider'>
              Supervisor
            </span>
          </div>
          <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
            Modificar información del Supervisor
          </h2>
          <p className='text-white/90 text-[13px] md:text-[14px] font-inter font-medium'>
            {data?.member?.firstNames} {data?.member?.lastNames}
          </p>
        </div>
      </div>

      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl px-4 py-8 sm:px-10'>
        {isLoadingData && <SupervisorFormSkeleton />}

        {!isLoadingData && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-5'
            >
              <BasicMemberUpdateForm
                form={form}
                isInputDisabled={isInputDisabled}
                isInputBirthDateOpen={isInputBirthDateOpen}
                setIsInputBirthDateOpen={setIsInputBirthDateOpen}
                isInputConvertionDateOpen={isInputConvertionDateOpen}
                setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
                residenceDistrict={district}
                districtsValidation={districtsValidation}
                urbanSectorsValidation={urbanSectorsValidation}
                disabledRoles={disabledRoles}
                moduleName='Supervisor'
              />

              <div className='sm:col-start-3 sm:col-end-4 flex flex-col gap-4'>

                {/* Section header */}
                <div className='pb-2 border-b border-slate-200 dark:border-slate-700'>
                  <p className='font-bold text-[15px] sm:text-[16px] text-slate-800 dark:text-slate-100'>
                    Roles y Relaciones
                  </p>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>
                    Configura el tipo de relación y los ministerios asignados.
                  </p>
                </div>

                {/* Relation type */}
                <div className='flex flex-col gap-1.5'>
                  <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                    Tipo de relación
                  </p>
                  <RelationTypesSelect
                    form={form as any}
                    isInputDisabled={isInputDisabled}
                    moduleName='supervisor'
                    showSubtitles={false}
                  />
                </div>

                {/* RelatedDirectToPastor */}
                {relationType === RelationType.RelatedDirectToPastor && !isMessagePromoteDisabled && (
                  <PastorsSelect
                    form={form as any}
                    isInputTheirPastorOpen={isInputTheirPastorRelationDirectOpen}
                    setIsInputTheirPastorOpen={setIsInputTheirPastorRelationDirectOpen}
                    isInputDisabled={isInputDisabled}
                    queryPastors={pastorsQuery}
                    fieldName='theirPastorRelationDirect'
                    className='mt-0'
                  />
                )}

                {/* OnlyRelatedHierarchicalCover */}
                {relationType === RelationType.OnlyRelatedHierarchicalCover &&
                  !isMessagePromoteDisabled && (
                    <CopastorsSelect
                      form={form as any}
                      isInputTheirCopastorOpen={isInputTheirCopastorOpen}
                      setIsInputTheirCopastorOpen={setIsInputTheirCopastorOpen}
                      isInputDisabled={isInputDisabled}
                      queryCopastors={copastorsQuery}
                      className='mt-0'
                      setChangedId={setChangedId}
                    />
                  )}

                {/* OnlyRelatedMinistries */}
                {relationType === RelationType.OnlyRelatedMinistries && !isMessagePromoteDisabled && (
                  <PastorsSelect
                    form={form as any}
                    isInputTheirPastorOpen={isInputTheirPastorOnlyMinistriesOpen}
                    setIsInputTheirPastorOpen={setIsInputTheirPastorOnlyMinistriesOpen}
                    isInputDisabled={isInputDisabled}
                    queryPastors={pastorsQuery}
                    fieldName='theirPastorOnlyMinistries'
                    className='mt-0'
                  />
                )}

                {/* RelatedBothMinistriesAndHierarchicalCover */}
                {relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
                  !isMessagePromoteDisabled && (
                    <CopastorsSelect
                      form={form as any}
                      isInputTheirCopastorOpen={isInputTheirCopastorOpen}
                      setIsInputTheirCopastorOpen={setIsInputTheirCopastorOpen}
                      isInputDisabled={isInputDisabled}
                      queryCopastors={copastorsQuery}
                      className='mt-0'
                      setChangedId={setChangedId}
                    />
                  )}

                {/* Alert: copastor change confirmation */}
                <AlertUpdateRelationSupervisor
                  data={data}
                  changedId={changedId}
                  setChangedId={setChangedId}
                  isAlertDialogOpen={isAlertDialogOpen}
                  setIsAlertDialogOpen={setIsAlertDialogOpen}
                  copastorsQuery={copastorsQuery}
                  supervisorUpdateForm={form}
                />

                {/* Ministry blocks */}
                {showMinistryBlocks && (
                  <div className='flex flex-col gap-3 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/10 overflow-hidden'>
                    <div className='flex items-center gap-2 px-3 pt-3 pb-2 border-b border-blue-200/70 dark:border-blue-800/40'>
                      <BookOpenCheck className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
                        Ministerios asignados
                      </p>
                    </div>
                    <div className='px-3 pb-3'>
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
                  </div>
                )}

                {/* Duplicate ministry warning */}
                {hasDuplicates && (
                  <Alert variant='destructive' className='bg-red-600 text-white border-red-700'>
                    <AlertTriangle className='h-5 w-5' color='white' />
                    <AlertTitle>Ministerios duplicados</AlertTitle>
                    <AlertDescription>
                      Cada miembro solo puede pertenecer a un ministerio. Los duplicados no se
                      guardarán.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Promover de cargo */}
                <div className='flex flex-col gap-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/10 p-3'>
                  <div className='flex items-center gap-2'>
                    <ArrowUpCircle className='w-3.5 h-3.5 text-amber-600 dark:text-amber-400' />
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400'>
                      Promover de cargo
                    </p>
                  </div>

                  {/* Post-promotion confirmation */}
                  {isMessagePromoteDisabled && (
                    <div className='rounded-md bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 p-3 text-center'>
                      <p className='text-[12.5px] font-bold text-amber-700 dark:text-amber-400 mb-1.5'>
                        ✅ ¡Promoción confirmada!
                      </p>
                      {isPromoted && (
                        <div className='flex items-center justify-center gap-2 text-[12px]'>
                          <span className='px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-medium'>
                            Supervisor
                          </span>
                          <span className='text-slate-400'>→</span>
                          <span className='px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 font-medium'>
                            Co-Pastor
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pastor selector after promotion */}
                  {isPromoteButtonDisabled && isInputDisabled && !theirPastor && isPromoted && (
                    <div className='flex flex-col gap-1.5'>
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
                        Nuevo Pastor
                      </p>
                      <PastorsSelect
                        form={form as any}
                        isInputTheirPastorOpen={isInputTheirPastorOpen}
                        setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
                        isInputDisabled={isRelationSelectDisabled}
                        queryPastors={pastorsQuery}
                        fieldName='theirPastor'
                        className='mt-0'
                      />
                    </div>
                  )}

                  {/* Feedback messages */}
                  {isPromoteButtonDisabled && !theirPastor && isPromoted && (
                    <p className='text-[11.5px] font-bold text-center text-red-500'>
                      ⚠️ Debes asignar un Pastor al nuevo Co-Pastor antes de guardar.
                    </p>
                  )}
                  {isPromoteButtonDisabled && theirPastor && isPromoted && (
                    <p className='text-[11.5px] font-bold text-center text-green-500'>
                      ✅ Pastor asignado. Guarda los cambios para completar la promoción.
                    </p>
                  )}

                  {/* Promote button */}
                  <AlertPromotionSupervisor
                    isPromoteButtonDisabled={isPromoteButtonDisabled}
                    isInputDisabled={isInputDisabled}
                    onPromote={handlePromote}
                  />
                </div>

                {/* Consideraciones */}
                <div className='flex flex-col gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3'>
                  <div className='flex items-center gap-2'>
                    <Info className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400' />
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                      Consideraciones
                    </p>
                  </div>
                  <ul className='flex flex-col gap-1.5'>
                    <li className='text-[11.5px] text-slate-600 dark:text-slate-300 font-medium leading-snug'>
                      ❌ Si los datos han cambiado, no podrás promover de cargo hasta restaurarlos.
                    </li>
                    <li className='text-[11.5px] text-slate-600 dark:text-slate-300 font-medium leading-snug'>
                      ❌ No puedes promover si el estado del registro es{' '}
                      <span className='text-red-500 font-bold'>Inactivo</span>.
                    </li>
                  </ul>
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
                    isPending &&
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
                  {isPending ? 'Procesando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
