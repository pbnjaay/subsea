import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { getShifts, postShift } from '~/services/api';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const shifts = await getShifts({ request, response });
  return json({ shifts }, { headers: response.headers });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const shift = await postShift({ request, response });

  return json({ shift }, { headers: response.headers });
};

const ShiftPage = () => {
  const { shifts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div
      className={`container flex flex-col mt-8 gap-y-4 ${
        fetcher.state === 'submitting'
          ? 'opacity-50 transition-opacity'
          : 'opacity-1 transition-opacity'
      }`}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Shifts</h1>
        <fetcher.Form method="post">
          <Button type="submit">New Shift</Button>
        </fetcher.Form>
      </div>
      {shifts && <DataTable columns={columns} data={shifts} />}
    </div>
  );
};

export default ShiftPage;
