import { Church, BookOpen } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface ChurchMinistrySelectorProps {
  isExpanded?: boolean;
  onSelect?: () => void;
}

export const ChurchMinistrySelector = ({
  isExpanded = true,
  onSelect,
}: ChurchMinistrySelectorProps): JSX.Element | null => {
  const user = useAuthStore((state) => state.user);

  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);
  const activeMinistryId = useChurchMinistryContextStore((s) => s.activeMinistryId);
  const availableChurches = useChurchMinistryContextStore((s) => s.availableChurches);
  const availableMinistries = useChurchMinistryContextStore((s) => s.availableMinistries);
  const setActiveChurch = useChurchMinistryContextStore((s) => s.setActiveChurch);
  const setActiveMinistry = useChurchMinistryContextStore((s) => s.setActiveMinistry);

  const isMinistryUser =
    user?.roles?.includes(UserRole.MinistryUser) &&
    !user?.roles?.includes(UserRole.SuperUser) &&
    !user?.roles?.includes(UserRole.AdminUser);

  // Ministries filtered by active church
  const ministriesForActiveChurch = activeChurchId
    ? availableMinistries.filter((m) => m.theirChurch?.id === activeChurchId)
    : availableMinistries;

  const activeChurch = availableChurches.find((c) => c.id === activeChurchId);
  const activeMinistry = availableMinistries.find((m) => m.id === activeMinistryId);

  if (availableChurches.length === 0) return null;

  const handleChurchChange = (churchId: string): void => {
    if (churchId === activeChurchId) return;
    setActiveChurch(churchId);
    onSelect?.();
    window.location.reload();
  };

  const handleMinistryChange = (ministryId: string): void => {
    if (ministryId === activeMinistryId) return;
    setActiveMinistry(ministryId);
    onSelect?.();
    window.location.reload();
  };

  // Show ministry selector if user is MinistryUser and has 2+ ministries
  const showMinistrySelector = isMinistryUser && availableMinistries.length > 1;
  const hasSingleChurch = availableChurches.length === 1;
  const hasSingleMinistry = ministriesForActiveChurch.length === 1;

  // Collapsed view (icon only)
  if (!isExpanded) {
    return (
      <div className='px-3 space-y-1'>
        {/* Church icon */}
        <div className='flex items-center justify-center p-2 rounded-lg bg-blue-600/10 border border-blue-500/20'>
          <Church className='w-5 h-5 text-blue-400' />
        </div>
        {/* Ministry icon (only if user has 2+ ministries) */}
        {showMinistrySelector && (
          <div className='flex items-center justify-center p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20'>
            <BookOpen className='w-5 h-5 text-emerald-400' />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='px-4 pb-2 space-y-2'>
      {/* Church Selector */}
      <div className='space-y-1'>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1'>
          Iglesia
        </span>
        {hasSingleChurch ? (
          <div className='flex items-center gap-2 p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20'>
            <Church className='w-4 h-4 text-blue-400 shrink-0' />
            <span className='text-sm font-medium text-blue-200 truncate'>
              {activeChurch?.abbreviatedChurchName ?? activeChurch?.churchName}
            </span>
          </div>
        ) : (
          <Select value={activeChurchId ?? ''} onValueChange={handleChurchChange}>
            <SelectTrigger
              className={cn(
                'w-full h-auto py-2.5 px-3 rounded-xl border-blue-500/20',
                'bg-blue-600/10 text-blue-200',
                'hover:bg-blue-600/15 hover:border-blue-500/30',
                'focus:ring-blue-500/30 focus:ring-offset-0',
                'transition-all duration-200'
              )}
            >
              <div className='flex items-center gap-2'>
                <Church className='w-4 h-4 text-blue-400 shrink-0' />
                <SelectValue placeholder='Seleccionar iglesia'>
                  <span className='text-sm font-medium truncate'>
                    {activeChurch?.abbreviatedChurchName ?? activeChurch?.churchName ?? 'Seleccionar'}
                  </span>
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent
              className='bg-slate-800 border-slate-700 rounded-xl'
              style={{ zIndex: 99999 }}
            >
              {availableChurches.map((church) => (
                <SelectItem
                  key={church.id}
                  value={church.id}
                  className={cn(
                    'text-slate-200 rounded-lg cursor-pointer',
                    'focus:bg-blue-600/20 focus:text-blue-200',
                    church.id === activeChurchId && 'bg-blue-600/10'
                  )}
                >
                  <span className='text-sm'>
                    {church.abbreviatedChurchName ?? church.churchName}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Ministry Selector (only for MinistryUser with 2+ ministries) */}
      {showMinistrySelector && (
        <div className='space-y-1'>
          <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1'>
            Ministerio
          </span>
          {hasSingleMinistry ? (
            <div className='flex items-center gap-2 p-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20'>
              <BookOpen className='w-4 h-4 text-emerald-400 shrink-0' />
              <span className='text-sm font-medium text-emerald-200 truncate'>
                {activeMinistry?.customMinistryName}
              </span>
            </div>
          ) : ministriesForActiveChurch.length === 0 ? (
            <div className='flex items-center gap-2 p-2.5 rounded-xl bg-amber-600/10 border border-amber-500/20'>
              <BookOpen className='w-4 h-4 text-amber-400 shrink-0' />
              <span className='text-xs font-medium text-amber-200 truncate'>
                Sin ministerios en esta iglesia
              </span>
            </div>
          ) : (
            <Select value={activeMinistryId ?? ''} onValueChange={handleMinistryChange}>
              <SelectTrigger
                className={cn(
                  'w-full h-auto py-2.5 px-3 rounded-xl border-emerald-500/20',
                  'bg-emerald-600/10 text-emerald-200',
                  'hover:bg-emerald-600/15 hover:border-emerald-500/30',
                  'focus:ring-emerald-500/30 focus:ring-offset-0',
                  'transition-all duration-200'
                )}
              >
                <div className='flex items-center gap-2'>
                  <BookOpen className='w-4 h-4 text-emerald-400 shrink-0' />
                  <SelectValue placeholder='Seleccionar ministerio'>
                    <span className='text-sm font-medium truncate'>
                      {activeMinistry?.customMinistryName ?? 'Seleccionar'}
                    </span>
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent
                className='bg-slate-800 border-slate-700 rounded-xl'
                style={{ zIndex: 99999 }}
              >
                {ministriesForActiveChurch.map((ministry) => (
                  <SelectItem
                    key={ministry.id}
                    value={ministry.id}
                    className={cn(
                      'text-slate-200 rounded-lg cursor-pointer',
                      'focus:bg-emerald-600/20 focus:text-emerald-200',
                      ministry.id === activeMinistryId && 'bg-emerald-600/10'
                    )}
                  >
                    <span className='text-sm'>{ministry.customMinistryName}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};
