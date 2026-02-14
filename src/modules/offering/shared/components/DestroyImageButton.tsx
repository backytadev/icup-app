/* eslint-disable @typescript-eslint/no-misused-promises */

import { useState } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';
import { type OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { useImageDeletionMutation } from '@/modules/offering/shared/hooks/useImageDeletionMutation';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';

interface ButtonDestroyProps {
  fileType: OfferingFileType;
  secureUrl: string;
  isDeleteFileButtonDisabled: boolean;
  removeCloudFile: (name: any) => void;
}

export const DestroyImageButton = ({
  fileType,
  secureUrl,
  removeCloudFile,
  isDeleteFileButtonDisabled,
}: ButtonDestroyProps): JSX.Element => {
  //* States
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  //* Custom hooks
  const imageDeletionMutation = useImageDeletionMutation({
    setIsCardOpen,
    setIsButtonDisabled,
  });

  return (
    <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isDeleteFileButtonDisabled}
          onClick={() => {
            setIsButtonDisabled(false);
          }}
          className='border-none p-0 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 dark:hover:bg-slate-950 hover:bg-white mr-3 mt-2'
        >
          <TiDeleteOutline className='w-8 h-8 p-0  rounded-full fill-red-500 dark:hover:bg-white hover:bg-slate-200' />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[23rem] sm:w-[25rem] md:w-full'>
        <div className='h-auto'>
          <DialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-[24px] text-center md:text-[28px] pb-3 flex flex-col'>
            <span>¿Estas seguro de eliminar esta imagen?</span>
          </DialogTitle>
          <DialogDescription>
            <span className='text-green-500 font-bold mb-1 inline-block text-[15px] md:text-[17px]'>
              Recomendaciones
            </span>
            <br />
            <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
              ✅ Para mayor seguridad, descarga la imagen y guárdala como respaldo.
            </span>
            <span className='inline-block text-[14.5px] md:text-[15px]'>
              ✅ Consulta con el administrador del sistema antes de ejecutar esta acción.
            </span>

            <span className='text-red-500 font-bold mt-1 mb-1 inline-block text-[15px] md:text-[17px]'>
              Consideraciones
            </span>
            <br />
            <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
              ❌ Esta imagen se borrara del alojamiento en la nube y del registro de la ofrenda.
            </span>
            <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
              ❌ No se podrá recuperar esta imagen después de ejecutar esta acción.
            </span>

            <br />
            <span className='text-blue-500 font-bold inline-block mt-1 mb-1 text-[13.5px] md:text-[13.5px]'>
              NOTA: Al finalizar esta acción puedes seguir editando el formulario.
            </span>
          </DialogDescription>
        </div>

        <div className='flex justify-center md:justify-end gap-x-4'>
          <Button
            disabled={isButtonDisabled}
            className='m-auto text-[14px] w-full border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'
            onClick={() => {
              setIsCardOpen(false);
            }}
          >
            No, cancelar
          </Button>
          <Button
            // disabled={isButtonDisabled}
            disabled
            onClick={async () => {
              setIsButtonDisabled(true);
              await imageDeletionMutation.mutateAsync({
                publicId: extractPublicId(secureUrl),
                path: extractPath(secureUrl),
                fileType,
                secureUrl,
              });
              removeCloudFile(secureUrl);
            }}
            className={cn(
              'm-auto text-[14px] w-full border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900',
              imageDeletionMutation?.isPending &&
              'bg-emerald-500 disabled:opacity-100 disabled:md:text-[14.5px] text-white'
            )}
          >
            {imageDeletionMutation?.isPending ? 'Procesando...' : 'Sí, eliminar'}
          </Button>
        </div>
        <p className='text-center font-bold text-red-500 text-[14px]'>
          No puedes eliminar esta imagen, ya que es esencial para el registro de la ofrenda.
        </p>
      </DialogContent>
    </Dialog>
  );
};
