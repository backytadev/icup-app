import { cn } from '@/shared/lib/utils';

import { type Anexe } from '@/shared/interfaces';
import { getFullName } from '@/shared/helpers';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

// NOTE : Aqui problema con la data es de diferentes tipo Pastor Copastor,etc
interface PopoverDataProps {
  data: Anexe | any;
  title: string;
  firstValue: string;
  secondValue: string;
}

export const PopoverDataTabs = ({
  data,
  title,
  firstValue,
  secondValue,
}: PopoverDataProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=' px-2 py-0  text-[12px]' variant='outline'>
          Ver {title}...
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-auto',
          (title === 'Discípulos' || title === 'Casas' || title === 'Predicadores') &&
            'h-[15rem] overflow-y-scroll'
        )}
      >
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>{title}</h4>
            <p className='text-sm text-muted-foreground'>{title} que pertenecen a esta iglesia.</p>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {data?.map((element: any) => {
              if (title === 'Anexos' || title === 'Zonas' || title === 'Casas') {
                return <li key={element?.id}>{element?.[firstValue]}</li>;
              }

              return (
                <div key={element?.id}>
                  <li>
                    <span className='mr-2' key={element?.id}>
                      {getFullName({
                        firstNames: element?.[firstValue],
                        lastNames: element?.[secondValue],
                      })}
                    </span>
                  </li>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
