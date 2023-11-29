import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import {
  deleteActivity,
  endShift,
  getActivities,
  getShift,
} from '~/services/api';
import { formateDate } from '~/services/utils';
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
import { MailIcon, MailPlusIcon } from 'lucide-react';
import Email from '~/components/email';
import { mailer } from '~/entry.server';
import { render } from '@react-email/render';
import { useToast } from '~/components/ui/use-toast';
import { useEffect } from 'react';
import { ToastAction, ToastDescription } from '~/components/ui/toast';

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
  const { _action, id } = Object.fromEntries(formData);

  if (_action === 'end') {
    try {
      const [endShiftResult, activities, shift] = await Promise.all([
        endShift(Number(params.shiftId), { request, response }),
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
        subject: `Rapport d'activité du ${formateDate(date)}`,
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
    return json({}, { headers: response.headers });
  }
};

const ShiftDetailsPage = () => {
  const { shift, activities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.success === 'ok') {
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
        <h1 className="text-2xl font-bold">
          {formateDate(new Date(shift.created_at))}
        </h1>
        <div className="flex gap-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {fetcher.state === 'submitting' ? (
                <Button
                  className="flex items-center gap-x-2"
                  size={'icon'}
                  variant={'outline'}
                >
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
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
                <fetcher.Form method="PATCH">
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
