import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import {
  deleteShift,
  endShift,
  getActivities,
  getShift,
  getShifts,
  postShift,
  toogleAlarm,
  toogleBasic,
  toogleRoom,
} from '~/services/api';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '~/components/ui/button';
import { mailer } from '~/entry.server';
import { render } from '@react-email/render';
import { formateDate } from '~/services/utils';
import Email from '~/components/email';
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
import { icons } from 'lucide-react';

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

  if (_action === 'end') {
    await endShift(Number(shiftId), { request, response });
    const activities = await getActivities(String(shiftId), {
      request,
      response,
    });

    const shift = await getShift(Number(shiftId), { request, response });

    const emailHtml = render(<Email activities={activities} shift={shift} />);
    const date = new Date(Date.now());

    const transporter = mailer.createTransport({
      host: 'webmail.orange-sonatel.com',
      port: 587,
      secure: false,
      auth: {
        user: 'S_SupSMS',
        pass: 'Sonatel2022',
      },
      tls: {
        ciphers: 'TLSv1.2',
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: 'supervision.services@orange-sonatel.com',
      to: [
        'papabassirou.ndiaye@orange-sonatel.com',
        'tapha.sow@orange-sonatel.com',
      ],
      subject: `Rapport d'actvité du ${formateDate(date)}`,
      html: emailHtml,
    });
  }

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
    <div
      className={`container flex flex-col mt-8 gap-y-4 ${
        fetcher.state === 'submitting'
          ? 'opacity-50 transition-opacity'
          : 'opacity-100 transition-opacity'
      }`}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Shifts</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={'sm'}>Nouveau</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir commencer un nouveau shift ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Appuyez sur Annuler si vous avez déjà un shift en cours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuler</AlertDialogCancel>
              <fetcher.Form method="post">
                <AlertDialogAction
                  type="submit"
                  name="_action"
                  value="postShift"
                >
                  Confirmer
                </AlertDialogAction>
              </fetcher.Form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {shifts && <DataTable columns={columns} data={shifts} />}
    </div>
  );
};

export default ShiftPage;
