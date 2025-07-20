import { UseFormReturn } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

import { SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';
import { useSupervisorRolePromotionHandler } from '@/modules/supervisor/hooks/useSupervisorRolePromotionHandler';

export interface AlertPromotionSupervisorProps {
  isPromoteButtonDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessagePromoteDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
}

export const AlertPromotionSupervisor = ({
  isPromoteButtonDisabled,
  setIsInputDisabled,
  setIsPromoteButtonDisabled,
  setIsMessagePromoteDisabled,
  supervisorUpdateForm,
}: AlertPromotionSupervisorProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          disabled={isPromoteButtonDisabled}
          className='w-full text-[14px]  disabled:bg-slate-500 disabled:text-white bg-yellow-400 text-yellow-700 hover:text-white hover:bg-yellow-500'
        >
          Promover de cargo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90vw]'>
        <AlertDialogHeader className='h-auto'>
          <AlertDialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-xl text-center md:text-[25px] pb-3'>
            ¿Estás seguro de promover a este Supervisor?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className='w-full text-left text-blue-500 font-medium mb-3 inline-block text-[15px] md:text-[18px]'>
              Información importante antes de continuar:
            </span>
            <br />

            <span className='text-left inline-block mb-2 text-[14px] md:text-[15px] leading-relaxed'>
              ✅ Luego de confirmar esta promoción, deberás asignar una nueva relación. En este
              caso, deberás asignar un Pastor al nuevo Co-Pastor promovido.
            </span>

            <span className='text-left inline-block mb-2 text-[14px] md:text-[15px] leading-relaxed'>
              ✅ Una vez que guardes los cambios, el sistema eliminará automáticamente la relación
              que tenía el líder en su rol anterior con su zona y sus predicadores, grupos
              familiares y discípulos.
            </span>

            <span className='text-left inline-block mb-2 text-[14px] md:text-[15px] leading-relaxed'>
              ✅ Todos los que dependían de este líder quedarán sin cobertura hasta que se les
              asigne un nuevo líder en el cargo correspondiente.
            </span>

            <span className='text-left inline-block mb-2 text-[14px] md:text-[15px] leading-relaxed'>
              ✅ Una vez realizada la promoción y actualizadas las relaciones, este líder estará
              listo para desempeñar sus funciones dentro del nuevo cargo asignado.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='mt-3 text-[14px] w-full border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'>
            No, Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className='text-[14px] w-full border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
            onClick={() => {
              useSupervisorRolePromotionHandler({
                supervisorUpdateForm,
                setIsPromoteButtonDisabled,
                setIsInputDisabled,
              });

              setIsMessagePromoteDisabled(true);
            }}
          >
            Sí, Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
