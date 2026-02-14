import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';
import { type User } from '@/modules/user/interfaces/user-form-data.interface';
import { UserRole } from '@/modules/user/enums/user-role.enum';

interface ChurchMinistryContextState {
  activeChurchId: string | null;
  activeMinistryId: string | null;
  availableChurches: ChurchResponse[];
  availableMinistries: MinistryResponse[];
}

interface ChurchMinistryContextActions {
  setActiveChurch: (churchId: string) => void;
  setActiveMinistry: (ministryId: string | null) => void;
  initialize: (user: User) => void;
  reset: () => void;
}

type ChurchMinistryContextStore = ChurchMinistryContextState & ChurchMinistryContextActions;

const initialState: ChurchMinistryContextState = {
  activeChurchId: null,
  activeMinistryId: null,
  availableChurches: [],
  availableMinistries: [],
};

export const useChurchMinistryContextStore = create<ChurchMinistryContextStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: (user: User) => {
        const churches = (user.churches ?? []).filter(
          (c): c is ChurchResponse => typeof c !== 'string'
        );
        const ministries = (user.ministries ?? []).filter(
          (m): m is MinistryResponse => typeof m !== 'string'
        );

        const isMinistryUser =
          user.roles?.includes(UserRole.MinistryUser) &&
          !user.roles?.includes(UserRole.SuperUser) &&
          !user.roles?.includes(UserRole.AdminUser);

        const currentActiveChurchId = get().activeChurchId;
        const hasValidChurch = churches.some((c) => c.id === currentActiveChurchId);

        const activeChurchId = hasValidChurch
          ? currentActiveChurchId
          : churches.length > 0
            ? churches[0].id
            : null;

        const ministriesForChurch = activeChurchId
          ? ministries.filter((m) => m.theirChurch?.id === activeChurchId)
          : ministries;

        const currentActiveMinistryId = get().activeMinistryId;
        const hasValidMinistry = ministriesForChurch.some(
          (m) => m.id === currentActiveMinistryId
        );

        const activeMinistryId =
          isMinistryUser
            ? hasValidMinistry
              ? currentActiveMinistryId
              : ministriesForChurch.length > 0
                ? ministriesForChurch[0].id
                : null
            : null;

        set({
          availableChurches: churches,
          availableMinistries: ministries,
          activeChurchId,
          activeMinistryId,
        });
      },

      setActiveChurch: (churchId: string) => {
        const { availableMinistries, activeMinistryId } = get();

        const ministriesForChurch = availableMinistries.filter(
          (m) => m.theirChurch?.id === churchId
        );

        const hasValidMinistry = ministriesForChurch.some(
          (m) => m.id === activeMinistryId
        );

        set({
          activeChurchId: churchId,
          activeMinistryId: hasValidMinistry
            ? activeMinistryId
            : ministriesForChurch.length > 0
              ? ministriesForChurch[0].id
              : null,
        });
      },

      setActiveMinistry: (ministryId: string | null) => {
        set({ activeMinistryId: ministryId });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'church-ministry-context-storage',
      partialize: (state) => ({
        activeChurchId: state.activeChurchId,
        activeMinistryId: state.activeMinistryId,
      }),
    }
  )
);
