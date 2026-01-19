/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useQuery } from '@tanstack/react-query';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';
import { getSimplePreachers } from '@/modules/preacher/services/preacher.service';
import { getSimpleDisciples } from '@/modules/disciple/services/disciple.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';

interface Options {
  memberType?: string | undefined;
}

export const useModuleQueries = ({ memberType }: Options) => {
  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const pastorsQuery = useQuery({
    queryKey: ['pastors'],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    enabled: !!memberType && memberType === MemberType.Pastor,
    retry: false,
  });

  const copastorsQuery = useQuery({
    queryKey: ['copastors'],
    queryFn: () => getSimpleCopastors({ isSimpleQuery: true }),
    enabled: !!memberType && memberType === MemberType.Copastor,
    retry: false,
  });

  const supervisorsQuery = useQuery({
    queryKey: ['supervisors'],
    queryFn: () => getSimpleSupervisors({ isSimpleQuery: true }),
    enabled: !!memberType && memberType === MemberType.Supervisor,
    retry: false,
  });

  const preachersQuery = useQuery({
    queryKey: ['preachers'],
    queryFn: () => getSimplePreachers({ isSimpleQuery: true }),
    enabled: !!memberType && memberType === MemberType.Preacher,
    retry: false,
  });

  const disciplesQuery = useQuery({
    queryKey: ['disciples'],
    queryFn: () => getSimpleDisciples({ isSimpleQuery: true }),
    enabled: !!memberType && memberType === MemberType.Disciple,
    retry: false,
  });

  return {
    pastorsQuery,
    copastorsQuery,
    supervisorsQuery,
    preachersQuery,
    disciplesQuery,

    churchesQuery,
  };
};
