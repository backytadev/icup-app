import { FcDeleteDatabase, FcSearch, FcDocument, FcLineChart, FcBusinessman } from 'react-icons/fc';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

type EmptyStateVariant = 'default' | 'search' | 'document' | 'chart' | 'member';

interface EmptyStateProps {
  title?: string;
  description?: string;
  variant?: EmptyStateVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const iconMap: Record<EmptyStateVariant, React.ElementType> = {
  default: FcDeleteDatabase,
  search: FcSearch,
  document: FcDocument,
  chart: FcLineChart,
  member: FcBusinessman,
};

const defaultMessages: Record<EmptyStateVariant, { title: string; description: string }> = {
  default: {
    title: 'Sin datos disponibles',
    description: 'No hay información para mostrar en este momento.',
  },
  search: {
    title: 'Sin resultados',
    description: 'No se encontraron resultados para tu búsqueda.',
  },
  document: {
    title: 'Sin documentos',
    description: 'No hay documentos disponibles.',
  },
  chart: {
    title: 'Sin datos para graficar',
    description: 'No hay suficientes datos para generar el gráfico.',
  },
  member: {
    title: 'Sin miembros',
    description: 'No hay miembros registrados en este momento.',
  },
};

export const EmptyState = ({
  title,
  description,
  variant = 'default',
  action,
  className,
}: EmptyStateProps): JSX.Element => {
  const Icon = iconMap[variant];
  const defaultMessage = defaultMessages[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4',
        'text-center',
        className
      )}
    >
      {/* Icon container with subtle animation */}
      <div className='relative mb-4'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-amber-500/10 rounded-full blur-xl' />
        <div className='relative bg-white dark:bg-slate-800 rounded-full p-4 shadow-sm'>
          <Icon className='w-16 h-16 md:w-20 md:h-20' />
        </div>
      </div>

      {/* Title */}
      <h3 className='text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2 font-outfit'>
        {title ?? defaultMessage.title}
      </h3>

      {/* Description */}
      <p className='text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-sm font-inter'>
        {description ?? defaultMessage.description}
      </p>

      {/* Action button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant='outline'
          className='mt-6 font-inter'
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
