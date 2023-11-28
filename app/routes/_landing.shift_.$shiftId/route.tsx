import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { deleteActivity, getActivities, getShift } from '~/services/api';
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
import { MailPlusIcon, PlusSquareIcon, SendIcon, icons } from 'lucide-react';

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

  if (_action === 'deleteActivity') {
    await deleteActivity(Number(id), { request, response });
  }

  return json({}, { headers: response.headers });
};

const ShiftDetailsPage = () => {
  const { shift, activities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();

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
              <Button
                variant={'outline'}
                size={'icon'}
                className="flex items-center gap-x-2"
              >
                <MailPlusIcon className="w-4 h-4" />
              </Button>
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
