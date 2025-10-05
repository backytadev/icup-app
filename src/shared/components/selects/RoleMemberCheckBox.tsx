import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

interface RoleMemberCheckBoxProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  disabledRoles?: MemberRole[] | undefined;
}

export const RoleMemberCheckBox = ({
  form,
  disabledRoles,
  isInputDisabled,
}: RoleMemberCheckBoxProps): JSX.Element => {
  return (
    <FormField
      control={form.control}
      name='roles'
      render={() => (
        <FormItem>
          <div className='mb-4'>
            <FormLabel className='font-bold text-[16px] sm:text-[18px]'>
              Roles de Membresía
            </FormLabel>
            <FormDescription className='font-medium'>
              Asigna los roles de membresía correspondientes para este registro.
            </FormDescription>
          </div>
          <div className='grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Object.values(MemberRole).map(
              (role) =>
                (role === MemberRole.Pastor ||
                  role === MemberRole.Copastor ||
                  role === MemberRole.Supervisor ||
                  role === MemberRole.Preacher ||
                  role === MemberRole.Treasurer ||
                  role === MemberRole.Disciple) && (
                  <FormField
                    key={role}
                    control={form.control}
                    name='roles'
                    render={({ field }) => {
                      const isDisabled = disabledRoles?.includes(role) ?? isInputDisabled;
                      return (
                        <FormItem
                          key={role}
                          className='flex flex-row items-center space-x-2 space-y-0'
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Checkbox
                              checked={field.value?.includes(role)}
                              disabled={isDisabled || isInputDisabled}
                              onCheckedChange={(checked) => {
                                let updatedRoles: MemberRole[] = [];
                                checked
                                  ? (updatedRoles = field.value ? [...field.value, role] : [role])
                                  : (updatedRoles =
                                      field.value?.filter((value) => value !== role) ?? []);

                                field.onChange(updatedRoles);
                              }}
                              className={isDisabled || isInputDisabled ? 'bg-slate-500' : ''}
                            />
                          </FormControl>
                          <FormLabel className='text-[14px] cursor-pointer font-normal'>
                            {MemberRoleNames[role]}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                )
            )}
          </div>
          <FormMessage className='text-[13px]' />
        </FormItem>
      )}
    />
  );
};
