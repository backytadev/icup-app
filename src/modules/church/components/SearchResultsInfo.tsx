import { cn } from '@/shared/lib/utils';

interface SearchResultsInfoProps {
  searchType: string;
  totalRecords: number;
  className?: string;
}

export const SearchResultsInfo = ({
  searchType,
  totalRecords,
  className,
}: SearchResultsInfoProps): JSX.Element => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl',
        'bg-slate-50/80 dark:bg-slate-800/50',
        'border border-slate-200/60 dark:border-slate-700/40',
        'opacity-0 animate-slide-in-up',
        className
      )}
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      <div className='flex items-center gap-2'>
        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-inter'>
          Búsqueda actual
        </span>
        <span className='text-sm font-medium text-slate-600 dark:text-slate-300 font-inter'>
          {searchType}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-inter'>
          Registros encontrados
        </span>
        <span className='text-sm font-medium text-slate-600 dark:text-slate-300 font-inter'>
          {totalRecords} registro{totalRecords !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
