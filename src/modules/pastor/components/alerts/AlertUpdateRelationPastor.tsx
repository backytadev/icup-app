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

import { PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

export interface AlertUpdateRelationPastorProps {
  data: PastorResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
}

export const AlertUpdateRelationPastor = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  churchesQuery,
  pastorUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationPastorProps) => {
  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogContent className='w-[90vw]'>
        <AlertDialogHeader className='h-auto'>
          <AlertDialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-xl text-center md:text-[28px] pb-3 flex flex-col gap-2'>
            <p className='uppercase tracking-wide text-[20px] md:text-[26px] text-amber-600 dark:text-yellow-400'>
              Cambio de Relación Superior
            </p>

            <p className='text-[15px] md:text-[17px] font-medium text-gray-800 dark:text-gray-200 leading-5 md:leading-8'>
              Estás a punto de actualizar la Iglesia asignada al siguiente Pastor:
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
              <p>
                <span>Iglesia:</span>{' '}
                <strong className='font-medium'>{data?.theirChurch?.abbreviatedChurchName}</strong>
              </p>
            </div>

            <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 px-4 py-3 rounded'>
              <p className='text-yellow-600 dark:text-yellow-400 mb-1 font-bold text-[15px] md:text-[16px]'>
                🔁 Nuevas relaciones seleccionadas
              </p>
              <p>
                <span>Iglesia:</span>{' '}
                <strong className='font-medium'>
                  {
                    churchesQuery?.data?.find((church) => church.id === changedId)
                      ?.abbreviatedChurchName
                  }
                </strong>
              </p>
            </div>

            <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 px-4 py-3 rounded'>
              <p className='text-red-700 dark:text-red-400 font-bold mb-1 text-[14.5px] md:text-[16px]'>
                ⚠️ Advertencia: consecuencias del cambio
              </p>
              <p>
                Al realizar el cambio de Iglesia para este Pastor, se eliminarán sus relaciones
                anteriores y se establecerán las nuevas. Además, todo lo que estaban bajo su
                cobertura (co-pastores, supervisores, grupos familiares, zonas y discípulos) también
                serán reasignados con las nuevas relaciones.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='mt-3 text-[14px] w-full border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'
            onClick={() => {
              pastorUpdateForm.setValue('theirChurch', data?.theirChurch?.id!);
              setChangedId(data?.theirChurch?.id!);
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
