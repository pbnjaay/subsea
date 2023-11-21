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
    <div className="container mx-auto py-6 space-y-2">
      <fetcher.Form method="post">
        <Button type="submit">New Shift</Button>
      </fetcher.Form>
      {shifts && <DataTable columns={columns} data={shifts} />}
    </div>
  );
};

export default ShiftPage;
