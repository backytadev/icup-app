import { type Member, memberColumns } from './member-columns';
import { DataTable } from './data-table-search-general';

async function getData(): Promise<Member[]> {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      first_name: 'Roberto Carlos',
      last_name: 'García',
      date_birth: '1985-03-15',
      gender: 'M',
    },
    // ...
  ];
}

export default async function DemoPage(): Promise<JSX.Element> {
  const data = await getData();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={memberColumns} data={data} />
    </div>
  );
}
