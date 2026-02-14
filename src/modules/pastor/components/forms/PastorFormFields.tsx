import { memo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';

import type * as z from 'zod';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { type pastorFormSchema } from '@/modules/pastor/schemas/pastor-form-schema';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { AlertUpdateRelationPastor } from '@/modules/pastor/components/alerts/AlertUpdateRelationPastor';

import { type ChurchResponse } from '@/modules/church/types';

import { type MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';

import { cn } from '@/shared/lib/utils';

import { BasicMemberCreateForm } from '@/shared/components/forms/BasicMemberCreateForm';
import { BasicMemberUpdateForm } from '@/shared/components/forms/BasicMemberUpdateForm';
import { MinistryMemberCreateForm } from '@/shared/components/forms/MinistryMemberCreateForm';
import { MinistryMemberUpdateForm } from '@/shared/components/forms/MinistryMemberUpdateForm';

import { ChurchesSelect } from '@/shared/components/selects/ChurchesSelect';
import { RoleMemberCheckBox } from '@/shared/components/selects/RoleMemberCheckBox';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { Form } from '@/shared/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';

type PastorFormData = z.infer<typeof pastorFormSchema>;
type FormMode = 'create' | 'update';

//* Hoisted static JSX - prevents recreation on every render
const FormDivider = memo(() => (
  <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />
));
FormDivider.displayName = 'FormDivider';

interface PastorFormFieldsProps {
  mode: FormMode;
  form: UseFormReturn<PastorFormData>;
  data?: PastorResponse;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isMessageErrorDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirChurchOpen: boolean;
  setIsInputTheirChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputBirthDateOpen: boolean;
  setIsInputBirthDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputConvertionDateOpen: boolean;
  setIsInputConvertionDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relationType: string | undefined;
  residenceDistrict: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  disabledRoles?: MemberRole[];
  ministryBlocks: MinistryMemberBlock[];
  ministryBlockActions: ReturnType<typeof useMinistryBlocks>;
  queryChurches: UseQueryResult<ChurchResponse[], Error>;
  isPending: boolean;
  handleSubmit: (formData: PastorFormData) => void;
  //* Update mode specific props
  changedId?: string | undefined;
  setChangedId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen?: boolean;
  setIsAlertDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const formConfig = {
  create: {
    submitButtonText: 'Registrar Pastor',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes registrar el pastor.',
    errorMessage: 'Datos incompletos. Completa todos los campos requeridos.',
    buttonGradient: 'from-emerald-500 to-teal-500',
    buttonHoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
    buttonShadow: 'hover:shadow-emerald-500/20',
    pendingGradient: 'from-emerald-600 to-teal-600',
  },
  update: {
    submitButtonText: 'Guardar cambios',
    submitButtonPendingText: 'Procesando...',
    successMessage: '¡Campos completados correctamente!',
    errorMessage: '❌ Datos incompletos, revisa todos los campos.',
    buttonColor: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
    buttonShadow: 'hover:shadow-orange-500/20',
  },
};

export const PastorFormFields = ({
  mode,
  form,
  data,
  isInputDisabled,
  isSubmitButtonDisabled,
  isMessageErrorDisabled,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  isInputTheirChurchOpen,
  setIsInputTheirChurchOpen,
  isInputBirthDateOpen,
  setIsInputBirthDateOpen,
  isInputConvertionDateOpen,
  setIsInputConvertionDateOpen,
  relationType,
  residenceDistrict,
  districtsValidation,
  urbanSectorsValidation,
  disabledRoles = [],
  ministryBlocks,
  ministryBlockActions,
  queryChurches,
  isPending,
  handleSubmit,
  //* Update mode props
  changedId,
  setChangedId,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
}: PastorFormFieldsProps): JSX.Element => {
  const config = formConfig[mode];

  //* Validation if there are duplicate ministries in the ministry blocks (update mode)
  const currentBlockMinistryIds = ministryBlocks.map((block) => block.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryIds).size !== currentBlockMinistryIds.length;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          'w-full flex flex-col gap-y-6',
          mode === 'create' && 'md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10 p-5 md:p-6',
          mode === 'update' && 'md:grid md:grid-cols-3 gap-x-10 gap-y-7'
        )}
      >
        {/* Basic Member Form - Create mode: 2 columns internal, Update mode: 2 columns span */}
        {mode === 'create' ? (
          <>
            {/* BasicMemberCreateForm ya tiene internamente 2 columnas:
                - Primera columna: Datos Generales
                - Segunda columna: Contacto / Vivienda */}
            <BasicMemberCreateForm
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

            {/* Roles de Membresía - Debajo de Datos Generales (columna 1) */}
            <div className='sm:col-start-1 sm:col-end-2 sm:row-start-2 sm:row-end-3 h-auto'>
              <RoleMemberCheckBox
                form={form as any}
                isInputDisabled={isInputDisabled}
                disabledRoles={disabledRoles}
              />
            </div>

            {/* Relaciones - Debajo de Contacto/Vivienda (columna 2) */}
            <div className='sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3'>
              <legend className='font-bold col-start-1 col-end-3 text-[16.5px] sm:text-[18px] mb-4 text-slate-800 dark:text-slate-200'>
                Relaciones
              </legend>

              <RelationTypesSelect
                form={form as any}
                isInputDisabled={isInputDisabled}
                moduleName='pastor'
              />

              {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
                relationType === RelationType.OnlyRelatedHierarchicalCover) && (
                <ChurchesSelect
                  form={form as any}
                  isInputDisabled={isInputDisabled}
                  isInputTheirChurchOpen={isInputTheirChurchOpen}
                  setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
                  queryChurches={queryChurches}
                />
              )}
            </div>

            {/* Ministerios - Ancho completo debajo de todo */}
            {relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover && (
              <div className='w-full border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col space-y-6 sm:col-start-1 sm:col-end-3'>
                <MinistryMemberCreateForm
                  isInputDisabled={isInputDisabled}
                  addMinistryBlock={ministryBlockActions.addMinistryBlock}
                  ministryBlocks={ministryBlocks}
                  updateMinistryBlock={ministryBlockActions.updateMinistryBlock}
                  queryChurches={queryChurches}
                  handleSelectChurch={ministryBlockActions.handleSelectChurch}
                  toggleRoleInBlock={ministryBlockActions.toggleRoleInBlock}
                  removeMinistryBlock={ministryBlockActions.removeMinistryBlock}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Update Mode - 3 columns layout */}
            {/* BasicMemberUpdateForm - 2 columns span (includes roles) */}
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

            {/* Side Content: Relations and Ministries - 1 column */}
            <div className='sm:col-start-3 sm:col-end-4 flex flex-col gap-6'>
              <div className='space-y-4'>
                <h3 className='font-bold text-slate-800 dark:text-slate-200 text-[15px] sm:text-[16px] border-b border-slate-100 dark:border-slate-800 pb-2'>
                  Roles y Ministerios
                </h3>

                <RelationTypesSelect
                  form={form as any}
                  isInputDisabled={isInputDisabled}
                  moduleName='pastor'
                  showSubtitles={false}
                />
              </div>

              <div className='space-y-4'>
                <h3 className='font-bold text-slate-800 dark:text-slate-200 text-[15px] sm:text-[16px] border-b border-slate-100 dark:border-slate-800 pb-2'>
                  Relaciones
                </h3>

                {(relationType === RelationType.OnlyRelatedHierarchicalCover ||
                  relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                  <ChurchesSelect
                    form={form}
                    isInputDisabled={isInputDisabled}
                    isInputTheirChurchOpen={isInputTheirChurchOpen}
                    setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
                    queryChurches={queryChurches}
                    setChangedId={setChangedId}
                    className='mt-0'
                  />
                )}

                {mode === 'update' && setIsAlertDialogOpen && setChangedId && (
                  <AlertUpdateRelationPastor
                    data={data}
                    isAlertDialogOpen={isAlertDialogOpen ?? false}
                    setIsAlertDialogOpen={setIsAlertDialogOpen}
                    churchesQuery={queryChurches}
                    pastorUpdateForm={form}
                    setChangedId={setChangedId}
                    changedId={changedId}
                  />
                )}
              </div>

              {/* Ministries */}
              {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
                relationType === RelationType.OnlyRelatedMinistries) && (
                <div className='w-full border-t border-slate-100 dark:border-slate-800 pt-5 flex flex-col space-y-6'>
                  <MinistryMemberUpdateForm
                    isInputDisabled={isInputDisabled}
                    addMinistryBlock={ministryBlockActions.addMinistryBlock}
                    ministryBlocks={ministryBlocks}
                    updateMinistryBlock={ministryBlockActions.updateMinistryBlock}
                    queryChurches={queryChurches}
                    handleSelectChurch={ministryBlockActions.handleSelectChurch}
                    toggleRoleInBlock={ministryBlockActions.toggleRoleInBlock}
                    removeMinistryBlock={ministryBlockActions.removeMinistryBlock}
                  />
                </div>
              )}

              {/* Duplicate Ministries Alert */}
              {mode === 'update' && hasDuplicates && (
                <Alert
                  variant='destructive'
                  className='mt-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                >
                  <AlertTriangle className='h-4 w-4' />
                  <AlertTitle className='font-bold'>Duplicados</AlertTitle>
                  <AlertDescription className='text-xs'>
                    Los ministerios duplicados no se guardarán.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}

        {/* Validation message and Submit button */}
        <div
          className={cn(
            'flex flex-col items-center gap-4',
            mode === 'create' && 'md:col-span-2 -mb-4',
            mode === 'update' && 'md:col-span-3 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800'
          )}
        >
          {mode === 'create' ? (
            <>
              {(isMessageErrorDisabled ||
                (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
                  ministryBlocks.some(
                    (item) =>
                      !item.churchId ||
                      !item.ministryId ||
                      !item.ministryType ||
                      item.ministryRoles.length === 0
                  ))) ? (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                  {config.errorMessage}
                </p>
              ) : (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
                  {config.successMessage}
                </p>
              )}
            </>
          ) : (
            <>
              {isMessageErrorDisabled ? (
                <p className='text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                  {config.errorMessage}
                </p>
              ) : (
                <p className='text-center text-emerald-500 text-[12.5px] md:text-[13px] font-bold animate-pulse'>
                  {config.successMessage}
                </p>
              )}
            </>
          )}

          <Button
            disabled={isSubmitButtonDisabled}
            type='submit'
            className={cn(
              'text-[13px] md:text-[14px] font-semibold font-inter transition-all duration-200',
              mode === 'create' &&
                `w-full md:w-[280px] bg-gradient-to-r ${formConfig.create.buttonGradient} text-white ${formConfig.create.buttonHoverGradient} shadow-sm hover:shadow-md ${formConfig.create.buttonShadow}`,
              mode === 'update' &&
                `w-full md:w-[22rem] h-11 text-[15px] shadow-md ${formConfig.update.buttonColor} text-white ${formConfig.update.buttonShadow}`,
              isPending && 'opacity-70 cursor-not-allowed'
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
            {isPending ? (
              mode === 'create' ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  {config.submitButtonPendingText}
                </span>
              ) : (
                config.submitButtonPendingText
              )
            ) : (
              config.submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
