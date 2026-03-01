import { useEffect } from 'react';

import { Toaster } from 'sonner';
import { FiUsers } from 'react-icons/fi';
import { BookOpenCheck } from 'lucide-react';

import { useCopastorForm } from '@/modules/copastor/hooks/forms';

import { cn } from '@/shared/lib/utils';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

import { RelationType } from '@/shared/enums/relation-type.enum';

import { PastorsSelect } from '@/shared/components/selects/PastorsSelect';
import { RoleMemberCheckBox } from '@/shared/components/selects/RoleMemberCheckBox';
import { RelationTypesSelect } from '@/shared/components/selects/RelationTypesSelect';
import { BasicMemberCreateForm } from '@/shared/components/forms/BasicMemberCreateForm';
import { MinistryMemberCreateForm } from '@/shared/components/forms/MinistryMemberCreateForm';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';

export const CopastorCreatePage = (): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isPending,
    isInputBirthDateOpen,
    setIsInputBirthDateOpen,
    isInputConvertionDateOpen,
    setIsInputConvertionDateOpen,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
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
    pastorsQuery,
    churchesQuery,
    handleSubmit,
  } = useCopastorForm({ mode: 'create' });

  useEffect(() => {
    document.title = 'Modulo Co-Pastor - IcupApp';
  }, []);

  const relationType = form.watch('relationType');

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nuevo Co-Pastor'
          description='Completa el formulario para crear un nuevo registro de co-pastor en el sistema.'
          titleColor='green'
          badge='Membresía'
          badgeColor='cyan'
          icon={FiUsers}
          accentColor='cyan'
        />

        <div className='w-full max-w-[1220px] mx-auto'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10 p-5 md:p-6'
              >
                {/* Basic Form */}
                <BasicMemberCreateForm
                  form={form as any}
                  isInputDisabled={isInputDisabled}
                  isInputBirthDateOpen={isInputBirthDateOpen}
                  setIsInputBirthDateOpen={setIsInputBirthDateOpen}
                  isInputConvertionDateOpen={isInputConvertionDateOpen}
                  setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
                  residenceDistrict={district}
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
                  <legend className='font-bold col-start-1 col-end-3 text-[16.5px] sm:text-[18px] mb-3'>
                    Relaciones
                  </legend>

                  <RelationTypesSelect
                    form={form as any}
                    isInputDisabled={isInputDisabled}
                    moduleName='copastor'
                  />

                  {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
                    relationType === RelationType.OnlyRelatedHierarchicalCover) && (
                      <PastorsSelect
                        form={form as any}
                        isInputDisabled={isInputDisabled}
                        isInputTheirPastorOpen={isInputTheirPastorOpen}
                        setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
                        queryPastors={pastorsQuery}
                        fieldName='theirPastor'
                      />
                    )}
                </div>

                {/* Ministries — styled section */}
                {relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover && (
                  <div className='w-full sm:col-start-1 sm:col-end-3 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/10 overflow-hidden'>
                    {/* Section header */}
                    <div className='flex items-center gap-3 px-4 py-3 border-b border-blue-200 dark:border-blue-800/50 bg-blue-100/60 dark:bg-blue-900/20'>
                      <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/15 dark:bg-blue-400/15'>
                        <BookOpenCheck className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <p className='text-[13.5px] font-bold text-blue-700 dark:text-blue-300'>
                          Asignación de Ministerios
                        </p>
                        <p className='text-[11px] text-blue-500 dark:text-blue-400 leading-tight'>
                          Selecciona tipo, iglesia, ministerio y rol para cada bloque.
                        </p>
                      </div>
                    </div>

                    {/* Form content */}
                    <div className='px-4 py-4'>
                      <MinistryMemberCreateForm
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
                <div className='md:mt-2 lg:mt-2 col-start-1 col-end-3 row-start-4 row-end-5 w-full md:w-[20rem] md:m-auto'>
                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full text-[14px]',
                      isPending &&
                      'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                    )}
                  >
                    {isPending ? 'Procesando...' : 'Registrar Co-Pastor'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Co-Pastor - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CopastorCreatePage;
