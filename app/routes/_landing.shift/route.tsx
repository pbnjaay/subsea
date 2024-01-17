import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from '@remix-run/react';
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
import { getSession } from '~/sessions';
import prisma from 'client.server';
import { DatePickerWithRange } from './date-picker-range';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: 'Liste des shifts' },
    { name: 'description', content: 'Welcome to subsea app!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.data.user?.isAdmin) {
    const shifts = await prisma.shift.findMany({
      where: {
        userId: {
          equals: Number(session.data.user?.id),
        },
      },
      include: {
        supervisor: true,
      },
    });
    return { data: shifts, success: false };
  }

  const url = new URL(request.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  if (from && to) {
    console.log('to', to, 'from', from);
    const shifts = await prisma.shift.findMany({
      include: {
        supervisor: true,
      },
      where: {
        startAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });

    if (shifts) return { data: shifts, success: true };
    return { data: shifts, success: false };
  } else {
    const shifts = await prisma.shift.findMany({
      include: {
        supervisor: true,
      },
    });

    if (shifts) return { data: shifts, success: true };
    return { data: shifts, success: false };
  }
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const formData = await request.formData();
  const { _action, shiftId, checked, start, end } =
    Object.fromEntries(formData);

  const session = await getSession(request.headers.get('Cookie'));

  if (_action === 'postShift' && session.data.user) {
    const shift = await prisma.shift.create({
      data: {
        endAt: new Date(String(end)),
        startAt: new Date(String(start)),
        userId: session.data.user.id,
      },
    });
    return shift;
  }

  const is_checked = checked === 'false' ? true : false;

  if (_action === 'destroy')
    await prisma.shift.delete({
      where: { id: Number(shiftId) },
    });

  if (_action === 'room')
    await prisma.shift.update({
      where: { id: Number(shiftId) },
      data: {
        isRoomChecked: is_checked,
      },
    });

  if (_action === 'alarm')
    await prisma.shift.update({
      where: { id: Number(shiftId) },
      data: {
        isAlarmChecked: is_checked,
      },
    });

  if (_action === 'basic')
    await prisma.shift.update({
      where: { id: Number(shiftId) },
      data: {
        isBasicDone: is_checked,
      },
    });

  return json({}, { headers: response.headers });
};

const ShiftPage = () => {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (data.success) setOpenFilterDialog(false);
  }, [searchParams.get('from'), searchParams.get('to')]);

  useEffect(() => {
    if (fetcher.formData?.get('_action') == 'postShift')
      setOpenAddDialog(false);
  }, [fetcher.formData?.get('_action')]);

  return (
    <div className="container flex flex-col mt-8 gap-y-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight">Shifts</h1>
        <div className="flex gap-x-4 flex-wrap gap-y-2 md:gap-y-0">
          <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
            <DialogTrigger asChild>
              <Button size={'sm'} variant={'ghost'}>
                <SlidersHorizontal className="w-4 h4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Filtrer les shifts par intervale de date
                </DialogTitle>
              </DialogHeader>
              <Form className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>De</Label>
                  <Input type="date" required name="from"></Input>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>A</Label>
                  <Input type="date" required name="to"></Input>
                </div>
                <DialogFooter>
                  <Button className="w-full" type="submit">
                    Rechercher
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
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
      </div>
      <div className="">
        {data && <DataTable columns={columns} data={data.data} />}
      </div>
    </div>
  );
};

export default ShiftPage;
