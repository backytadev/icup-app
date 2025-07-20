import { UseFormReturn } from 'react-hook-form';
import { UseQueryResult } from '@tanstack/react-query';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

export interface AlertUpdateRelationSupervisorProps {
  data: SupervisorResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  copastorsQuery: UseQueryResult<CopastorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
}

export const AlertUpdateRelationSupervisor = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  copastorsQuery,
  supervisorUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationSupervisorProps) => {
  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogContent className='w-[90vw]'>
        <AlertDialogHeader className='h-auto'>
          <AlertDialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-xl text-center md:text-[28px] pb-3 flex flex-col gap-2'>
            <p className='uppercase tracking-wide text-[20px] md:text-[26px] text-amber-600 dark:text-yellow-400'>
              Cambio de Relación Superior
            </p>

            <p className='text-[15px] md:text-[17px] font-medium text-gray-800 dark:text-gray-200 leading-5 md:leading-8'>
              Estás a punto de actualizar el Co-Pastor asignado al siguiente Supervisor:
            </p>

            <p className='text-[16px] md:text-[20px] text-blue-700 dark:text-blue-300 font-semibold'>
              {`${data?.member?.firstNames} ${data?.member?.lastNames}`}
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription className='space-y-3 md:space-y-5 mt-4 text-[14px] md:text-[16px] leading-relaxed text-left text-gray-800 dark:text-gray-200'>
            <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 px-4 py-3 rounded'>
              <p className='text-green-600 dark:text-green-400 mb-1 font-bold text-[15px] md:text-[16px]'>
                📌 Información actual
              </p>
              <div className='flex justify-between flex-wrap'>
                <p>
                  <span>Co-Pastor:</span>{' '}
                  <strong>
                    {getInitialFullNames({
                      firstNames: data?.theirCopastor?.firstNames ?? '',
                      lastNames: data?.theirCopastor?.lastNames ?? '',
                    })}
                  </strong>
                </p>
                <p>
                  <span>Pastor:</span>{' '}
                  <strong>
                    {getInitialFullNames({
                      firstNames: data?.theirPastor?.firstNames ?? '',
                      lastNames: data?.theirPastor?.lastNames ?? '',
                    })}
                  </strong>
                </p>
                <p>
                  <span>Iglesia:</span>{' '}
                  <strong className='font-medium'>
                    {data?.theirChurch?.abbreviatedChurchName}
                  </strong>
                </p>
              </div>
            </div>

            <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 px-4 py-3 rounded'>
              <p className='text-yellow-600 dark:text-yellow-400 mb-1 font-bold text-[15px] md:text-[16px]'>
                🔁 Nuevas relaciones seleccionadas
              </p>
              <div className='flex justify-between flex-wrap'>
                <p>
                  <span>Co-Pastor:</span>{' '}
                  <strong className='font-medium'>
                    {getInitialFullNames({
                      firstNames:
                        copastorsQuery?.data?.find((copastor) => copastor.id === changedId)?.member
                          ?.firstNames ?? '',
                      lastNames:
                        copastorsQuery?.data?.find((copastor) => copastor.id === changedId)?.member
                          ?.lastNames ?? '',
                    })}{' '}
                  </strong>
                </p>

                <p>
                  <span>Pastor:</span>{' '}
                  <strong className='font-medium'>
                    {getInitialFullNames({
                      firstNames:
                        copastorsQuery?.data?.find((copastor) => copastor.id === changedId)
                          ?.theirPastor?.member?.firstNames ?? '',
                      lastNames:
                        copastorsQuery?.data?.find((copastor) => copastor.id === changedId)
                          ?.theirPastor?.member?.lastNames ?? '',
                    })}
                  </strong>
                </p>

                <p>
                  <span>Iglesia:</span>{' '}
                  <strong className='font-medium'>
                    {
                      copastorsQuery?.data?.find((copastor) => copastor.id === changedId)
                        ?.theirChurch?.abbreviatedChurchName
                    }
                  </strong>
                </p>
              </div>
            </div>

            <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 px-4 py-3 rounded'>
              <p className='text-red-700 dark:text-red-400 font-bold mb-1 text-[14.5px] md:text-[16px]'>
                ⚠️ Advertencia: consecuencias del cambio
              </p>
              <p>
                Al realizar el cambio de Co-pastor para este Supervisor, se eliminarán sus
                relaciones anteriores y se establecerán las nuevas. Además, todo lo que estaban bajo
                su cobertura (zona, grupos familiares y discípulos) también serán reasignados con
                las nuevas relaciones.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='mt-3 text-[14px] w-full border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'
            onClick={() => {
              supervisorUpdateForm.setValue('theirCopastor', data?.theirCopastor?.id!);
              setChangedId(data?.theirCopastor?.id!);
            }}
          >
            No, Cancelar
          </AlertDialogCancel>
          <AlertDialogAction className='text-[14px] w-full border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'>
            Sí, Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
