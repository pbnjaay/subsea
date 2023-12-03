import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import {
  deleteShift,
  getShifts,
  postShift,
  toogleAlarm,
  toogleBasic,
  toogleRoom,
} from '~/services/api';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Loader from '~/components/loader';

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: 'Liste des shifts' },
    { name: 'description', content: 'Welcome to subsea app!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const shifts = await getShifts({ request, response });
  return json({ shifts }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const formData = await request.formData();
  const { _action, shiftId, checked, start, end } =
    Object.fromEntries(formData);

  if (_action === 'postShift') {
    const shift = await postShift(
      { request, response },
      String(end),
      String(start)
    );
    return json({ shift }, { headers: response.headers });
  }

  const is_checked = checked === 'false' ? false : true;

  if (_action === 'destroy')
    await deleteShift(Number(shiftId), { request, response });

  if (_action === 'room')
    await toogleRoom(Number(shiftId), is_checked, {
      request,
      response,
    });

  if (_action === 'alarm')
    await toogleAlarm(Number(shiftId), is_checked, {
      request,
      response,
    });

  if (_action === 'basic')
    await toogleBasic(Number(shiftId), is_checked, {
      request,
      response,
    });

  return json({}, { headers: response.headers });
};

const ShiftPage = () => {
  const { shifts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <div className={`container flex flex-col mt-8 gap-y-4`}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Shifts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={'sm'}>Nouveau</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Fixer l'heure de vacation</DialogTitle>
              <DialogDescription>
                Donner l'heure exacte de debut et de fin de votre vacation
              </DialogDescription>
            </DialogHeader>
            <fetcher.Form className="flex flex-col space-y-4" method="post">
              <div className="flex flex-col space-y-2">
                <Label>Heure de debut</Label>
                <Input type="datetime-local" required name="start"></Input>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Heure de fin</Label>
                <Input type="datetime-local" required name="end"></Input>
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  type="submit"
                  name="_action"
                  value="postShift"
                >
                  {fetcher.state === 'submitting' ? <Loader /> : 'Creer'}
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="">
        {shifts && <DataTable columns={columns} data={shifts} />}
      </div>
    </div>
  );
};

export default ShiftPage;
