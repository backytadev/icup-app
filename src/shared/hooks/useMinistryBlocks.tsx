import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

interface Options {
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
}

export const useMinistryBlocks = ({ setMinistryBlocks }: Options) => {
  const addMinistryBlock = () => {
    setMinistryBlocks((prev) => [
      ...prev,
      {
        churchId: null,
        ministryType: null,
        ministryId: null,
        ministryRoles: [],
        ministries: [],
        churchPopoverOpen: false,
        ministryPopoverOpen: false,
      },
    ]);
  };

  const updateMinistryBlock = <K extends keyof MinistryMemberBlock>(
    index: number,
    field: K,
    value: MinistryMemberBlock[K]
  ) => {
    setMinistryBlocks((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const toggleRoleInBlock = (index: number, role: string, isChecked: boolean) => {
    setMinistryBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? {
              ...block,
              ministryRoles: isChecked
                ? [...block.ministryRoles, role]
                : block.ministryRoles.filter((r) => r !== role),
            }
          : block
      )
    );
  };

  const removeMinistryBlock = (indexToRemove: number) => {
    setMinistryBlocks((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const fetchMinistriesByChurch = async (churchId: string) => {
    try {
      const respData = await getSimpleMinistries({ isSimpleQuery: true, churchId });
      return respData ?? [];
    } catch (error) {
      console.error('Error fetching ministries:', error);
      return [];
    }
  };

  const handleSelectChurch = async (index: number, churchId: string) => {
    const ministries = await fetchMinistriesByChurch(churchId);

    setMinistryBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? {
              ...block,
              churchId,
              ministryId: null,
              ministries: ministries.filter(
                (ministry) => ministry.ministryType === block.ministryType
              ),
            }
          : block
      )
    );
  };

  return {
    addMinistryBlock,
    updateMinistryBlock,
    toggleRoleInBlock,
    removeMinistryBlock,
    handleSelectChurch,
  };
};
