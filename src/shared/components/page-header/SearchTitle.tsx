/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { cn } from '@/shared/lib/utils';

interface PageTitleProps {
  children?: React.ReactNode;
  className?: string;
  titleName: string;
  isGeneralSearch?: boolean;
  isByTypeSearch?: boolean;
  isUpdateSearch?: boolean;
  isInactivateSearch?: boolean;
}

export const SearchTitle = (props: PageTitleProps): JSX.Element => {
  const {
    className,
    titleName,
    isGeneralSearch,
    isByTypeSearch,
    isUpdateSearch,
    isInactivateSearch,
  } = props;

  return (
    <>
      <div className='flex items-center justify-start'>
        <h2
          className={cn(
            'flex items-center text-left pl-4 pt-1 xl:pl-[2rem] 2xl:pt-2 2xl:pb-1 font-sans text-2xl sm:text-2xl font-bold text-sky-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.98rem] xl:text-[2.1rem] 2xl:text-4xl',
            className
          )}
        >
          Buscar {titleName}
        </h2>

        {isGeneralSearch && (
          <span className='ml-3 bg-sky-300 text-slate-600 border text-center text-[10px] mt-[0.5rem] py-[1px] pt-[2.5px] sm:mt-3 px-2 2xl:mt-6 rounded-full font-bold uppercase'>
            En general
          </span>
        )}

        {isByTypeSearch && (
          <span className='ml-3 bg-sky-300 text-slate-600 border text-center text-[10px] mt-[0.5rem] py-[1px] pt-[2.5px] sm:mt-3 px-2 2xl:mt-6 rounded-full font-bold uppercase'>
            Por Tipo
          </span>
        )}

        {isUpdateSearch && (
          <span className='ml-3 bg-orange-300 text-slate-600 border text-center text-[10px] mt-[0.5rem] py-[1px] pt-[2.5px] sm:mt-3 px-2 2xl:mt-6 rounded-full font-bold uppercase'>
            Actualizar
          </span>
        )}

        {isInactivateSearch && (
          <span className='ml-3 bg-red-300 text-slate-600 border text-center text-[10px] mt-[0.5rem] py-[1px] pt-[2.5px] sm:mt-3 px-2 2xl:mt-6 rounded-full font-bold uppercase'>
            Inactivar
          </span>
        )}
      </div>

      <p className='dark:text-slate-300 mt-1 text-left font-sans font-bold px-4 text-[13.5px] md:text-[15px] xl:text-base xl:px-[2rem]'>
        Explora, filtra y organiza los registros de {titleName} según tus necesidades.
      </p>
    </>
  );
};
