import { HelpCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { Button } from '@/shared/components/ui/button';

export const AlertUpdateRelationFamilyGroup = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                className='w-10 h-10 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
              >
                <HelpCircle className='w-6 h-6 text-blue-500' />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <p className='text-[13px] font-medium'>Ver detalles del proceso</p>
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent className='w-[90vw]'>
          <AlertDialogHeader className='h-full'>
            <AlertDialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-[24px] text-center md:text-[28px] flex flex-col leading-9'>
              ¿Deseas reasignar este G. Familiar a un Predicador de otra Zona?
            </AlertDialogTitle>

            <AlertDialogDescription>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] text-red-500 leading-relaxed'>
                ⚠ No es posible reasignar directamente un G. Familiar a un Predicador que pertenece
                a otra Zona. Sin embargo, puedes lograrlo siguiendo estos pasos:
              </span>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] leading-relaxed'>
                1️⃣ Primero, identifica al Predicador que deseas trasladar y actualiza su Supervisor
                desde la opción{' '}
                <a
                  target='_blank'
                  href='/preachers/update'
                  className='text-blue-600 hover:text-blue-800 underline font-semibold transition-colors'
                >
                  Actualizar Predicador
                </a>
                , de modo que pueda pertenecer a la misma Zona del G. Familiar que deseas cambiar.
              </span>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] leading-relaxed'>
                2️⃣ Una vez realizado este cambio, la nueva Zona y el nuevo Supervisor se propagarán
                automáticamente a toda la descendencia del Predicador (grupos familiares y
                discípulos).
              </span>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] leading-relaxed'>
                3️⃣ Ahora que el Predicador pertenece a la misma Zona y Supervisor del Grupo Familiar
                deseado, ya puedes hacer el intercambio desde la opción{' '}
                <a
                  target='_blank'
                  href='/family-groups/update'
                  className='text-blue-600 hover:text-blue-800 underline font-semibold transition-colors'
                >
                  Intercambiar Predicador
                </a>{' '}
                (busca y selecciona).
              </span>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] leading-relaxed'>
                4️⃣ Ten en cuenta que el otro Predicador involucrado también adoptará toda la
                descendencia que hayas transferido.
              </span>
              <span className='text-left inline-block mb-2 text-[13.5px] md:text-[15px] leading-relaxed'>
                5️⃣ Finalmente, asegúrate de reasignar al Predicador que resultó afectado por el
                intercambio, actualizando su Supervisor para que también pertenezca a la otra Zona.{' '}
                <a
                  target='_blank'
                  href='/preachers/update'
                  className='text-blue-600 hover:text-blue-800 underline font-semibold transition-colors'
                >
                  Actualizar Predicador
                </a>
                .
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className='text-[14px] -mt-2 md:mt-0 w-full border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'>
              Sí, Entiendo
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
