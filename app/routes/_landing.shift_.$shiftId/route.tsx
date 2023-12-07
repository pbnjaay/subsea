import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { deleteActivity, getActivities, getShift } from '~/services/api';
import { formateDate, formateDateWithoutHour } from '~/services/utils';
import Action from './action';
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
import { MailIcon } from 'lucide-react';
import Email from '~/components/email';
import { mailer } from '~/entry.server';
import { render, renderAsync } from '@react-email/render';
import { useToast } from '~/components/ui/use-toast';
import { useEffect } from 'react';
import { ToastAction, ToastDescription } from '~/components/ui/toast';
import Loader from '~/components/loader';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const shift = await getShift(parseInt(params.shiftId), { request, response });
  const activities = await getActivities(params.shiftId, { request, response });
  return json({ shift, activities }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing contactId param');
  const response = new Response();
  const formData = await request.formData();
  const { _action, id, shifts, activities } = Object.fromEntries(formData);

  if (_action === 'end') {
    try {
      const [activities, shift] = await Promise.all([
        getActivities(String(params.shiftId), { request, response }),
        getShift(Number(params.shiftId), { request, response }),
      ]);

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
      const info = await transporter.sendMail({
        from: 'supervision.services@orange-sonatel.com',
        to: ['papabassirou.ndiaye@orange-sonatel.com'],
        subject: `Rapport d'activité du ${formateDateWithoutHour(date)}`,
        html: emailHtml,
      });

      return json({ success: 'ok' }, { headers: response.headers });
    } catch (error) {
      console.error('An error occurred:', error);
      return json({ error: 'An error occurred' }, { status: 500 });
    }
  }

  if (_action === 'deleteActivity') {
    await deleteActivity(Number(id), { request, response });
    return json({ deleted: true }, { headers: response.headers });
  }
};

const ShiftDetailsPage = () => {
  const { shift, activities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher?.success === 'ok') {
      toast({
        description: (
          <ToastDescription>Votre rapport a été envoyé</ToastDescription>
        ),
      });
    }
    if (fetcher.data?.error) {
      toast({
        variant: 'destructive',
        title: 'Oh, oh ! Quelque chose a mal tourné.',
        description: 'Il y a eu un problème avec votre demande.',
        action: <ToastAction altText="Try again">Réessayer</ToastAction>,
      });
    }
  }, [fetcher.data]);

  if (!shift) return;
  return (
    <div className="container pt-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold">
          {formateDate(new Date(shift.created_at))}
        </h1>
        <div className="flex gap-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {fetcher.state === 'submitting' ? (
                <Button
                  className="flex items-center gap-x-2"
                  size={'icon'}
                  variant={'outline'}
                >
                  <Loader />
                </Button>
              ) : (
                <Button
                  variant={'outline'}
                  size={'icon'}
                  className="flex items-center gap-x-2"
                >
                  <MailIcon className="w-4 h-4" />
                </Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr d'avoir terminer votre vacation ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Appuyez sur Annuler si vous avez déjà un shift en cours.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuler</AlertDialogCancel>
                <fetcher.Form method="post">
                  <div className="flex items-center gap-x-2">
                    <AlertDialogAction type="submit" name="_action" value="end">
                      Confirmer
                    </AlertDialogAction>
                    <input
                      type="number"
                      defaultValue={shift.id}
                      name="shiftId"
                      hidden
                    />
                  </div>
                </fetcher.Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size={'sm'} onClick={() => navigate(`addactivity`)}>
            Nouveau
          </Button>
        </div>
      </div>
      <Action activities={activities} />
    </div>
  );
};

export default ShiftDetailsPage;
