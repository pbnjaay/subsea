import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
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
import DatePicker from '~/components/date-picker';
import DateTimePicker from '~/components/date-picker';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const shifts = await getShifts({ request, response });
  return json({ shifts }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const formData = await request.formData();
  const { _action, shiftId, checked } = Object.fromEntries(formData);

  if (_action === 'postShift') {
    const shift = await postShift({ request, response });
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
            <fetcher.Form className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Heure de debut</Label>
                <DateTimePicker date={new Date()} setDate={() => new Date()} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Heure de fin</Label>
                <DateTimePicker date={new Date()} setDate={() => new Date()} />
              </div>
              <DialogFooter>
                <Button className="w-full" type="submit">
                  Save
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
