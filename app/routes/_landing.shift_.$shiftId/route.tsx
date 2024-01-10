import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
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
import { render } from '@react-email/render';
import { useToast } from '~/components/ui/use-toast';
import { useEffect } from 'react';
import { ToastAction, ToastDescription } from '~/components/ui/toast';
import Loader from '~/components/loader';
import prisma from 'client.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const shift = await prisma.shift.findFirst({
    where: {
      id: Number(params.shiftId),
    },
  });

  if (!shift)
    throw new Response('Not Found', { status: 404, statusText: 'NOT FOUND' });

  const activities = await prisma.activity.findMany({
    where: { shiftId: Number(params.shiftId) },
  });
  return json({ shift, activities }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing contactId param');
  const response = new Response();
  const formData = await request.formData();
  const { _action, activityId } = Object.fromEntries(formData);

  if (_action === 'end') {
    try {
      const [activities, shift] = await Promise.all([
        prisma.activity.findMany({
          where: { shiftId: Number(params.shiftId) },
        }),
        prisma.shift.findFirst({
          where: {
            id: Number(params.shiftId),
          },
          include: {
            supervisor: true,
          },
        }),
      ]);

      const emailHtml = render(<Email activities={activities} shift={shift} />);

      const date = new Date(Date.now());

      const transporter = mailer.createTransport({
        host: 'webmail.orange-sonatel.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          ciphers: 'TLSv1.2',
          rejectUnauthorized: false,
        },
      });
      const info = await transporter.sendMail({
        from: 'supervision.services@orange-sonatel.com',
        to: [
          'papabassirou.ndiaye@orange-sonatel.com',
          'NOC-RAFIA@orange-sonatel.com',
          'supervisioncsm@orange-sonatel.com',
          'tapha.sow@orange-sonatel.com',
          'Ace_snoc1@orange-sonatel.com',
          'aboubacardiop@orange-sonatel.com',
          'abdoulayendiaye@orange-sonatel.com',
        ],
        subject: `Rapport d'activité du ${formateDateWithoutHour(date)}`,
        html: emailHtml,
      });

      return json(
        {
          data: {
            success: { message: 'Votre rapport a été envoyé' },
            error: { message: null },
          },
        },
        { headers: response.headers }
      );
    } catch (error) {
      return json({
        data: {
          success: { message: null },
          error: {
            message: "Votre courrier n'a pas été envoyé, veuillez réessayer.",
          },
        },
      });
    }
  }

  if (_action === 'deleteActivity') {
    await prisma.activity.delete({
      where: {
        id: Number(activityId),
      },
    });
    return json({
      data: {
        success: { message: 'Supprimer !' },
        error: {
          message: null,
        },
      },
    });
  }
};

const ShiftDetailsPage = () => {
  const { shift, activities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { toast } = useToast();
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data?.data.success.message) {
      toast({
        description: (
          <ToastDescription>{data.data.success.message}</ToastDescription>
        ),
      });
    }
    if (data?.data.error.message) {
      toast({
        variant: 'destructive',
        title: 'Oh, oh ! Quelque chose a mal tourné.',
        description: data.data.error.message,
        action: <ToastAction altText="Try again">Réessayer</ToastAction>,
      });
    }
  }, [data?.data]);

  if (!shift) return;
  return (
    <div className="container pt-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold">
          {formateDate(new Date(shift?.startAt))}
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
                  Appuyez sur Annuler pour interrompre l'action.
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
      <Action activities={activities as any} />
    </div>
  );
};

export default ShiftDetailsPage;
