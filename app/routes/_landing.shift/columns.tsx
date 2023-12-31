import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

import { Link, useFetcher } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DoorOpenIcon,
  FolderIcon,
  MoreHorizontal,
  PlusCircleIcon,
  SirenIcon,
  TrashIcon,
} from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { formateDate } from '~/services/utils';
import { Profile } from '../_landing/header';

export type Shifts = {
  id: number;
  created_at: string;
  supervisor: string | null;
  profiles: Profile | null;
  end_at: string | null;
  start_at: string | null;
  is_basic_done: boolean | null;
  is_room_checked: boolean | null;
  is_alarm_checked: boolean | null;
};

export const columns: ColumnDef<Shifts>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="text-justify">Id</div>,
  },
  {
    accessorKey: 'profiles',
    header: () => <div className="text-justify">Superviseur</div>,
    cell: ({ row }) => {
      const supervisor = row.getValue<Profile>('profiles');
      return (
        <Link to={`/shift/${row.original.id}`}>
          <div className="text-justify font-medium capitalize">
            {supervisor ? supervisor.full_name : 'no name'}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'start_at',
    header: () => <div className="text-justify">Debut</div>,
    cell: ({ row }) => {
      const created_at = new Date(row.getValue('start_at'));
      const formatted = formateDate(created_at);

      return <div className="text-justify font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'end_at',
    header: () => <div className="text-justify">Fin</div>,
    cell: ({ row }) => {
      const end_date = row.getValue('end_at')
        ? new Date(row.getValue('end_at'))
        : null;

      return end_date ? (
        <div className="text-justify font-medium">{formateDate(end_date)}</div>
      ) : (
        <span className="inline-flex justify-center w-2 h-2 bg-green-600 rounded-full"></span>
      );
    },
  },
  {
    accessorKey: 'is_basic_done',
    header: () => <div className="text-justify">Basique</div>,
    cell: ({ row }) => {
      const is_basic_done = Boolean(row.getValue('is_basic_done'));
      return (
        <div className="text-justify font-medium">
          {is_basic_done ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_alarm_checked',
    header: () => <div className="text-justify">Alarme</div>,
    cell: ({ row }) => {
      const is_alarm_checked = Boolean(row.getValue('is_alarm_checked'));
      return (
        <div className="text-justify font-medium">
          {is_alarm_checked ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_room_checked',
    header: () => <div className="text-justify">Chambre</div>,
    cell: ({ row }) => {
      const is_room_checked = Boolean(row.getValue('is_room_checked'));
      return (
        <div className="text-justify font-medium">
          {is_room_checked ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const shift = row.original;
      const fetcher = useFetcher();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <>
              <DropdownMenuItem>
                <fetcher.Form
                  method="PATCH"
                  className="flex items-center gap-x-2"
                >
                  <FolderIcon className="w-3 h-3" />
                  <input
                    type="text"
                    hidden
                    name="checked"
                    defaultValue={shift.is_basic_done ? 'true' : 'false'}
                  />
                  <button type="submit" name="_action" value="basic">
                    Marquer basique réseau
                  </button>
                  <input
                    type="number"
                    defaultValue={shift.id}
                    name="shiftId"
                    hidden
                  />
                </fetcher.Form>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <fetcher.Form
                  method="PATCH"
                  className="flex items-center gap-x-2"
                >
                  <SirenIcon className="w-3 h-3" />
                  <input
                    type="text"
                    hidden
                    name="checked"
                    defaultValue={shift.is_alarm_checked ? 'true' : 'false'}
                  />
                  <button type="submit" name="_action" value="alarm">
                    Marquer verification des alarmes
                  </button>
                  <input
                    type="number"
                    defaultValue={shift.id}
                    name="shiftId"
                    hidden
                  />
                </fetcher.Form>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <fetcher.Form
                  method="PATCH"
                  className="flex items-center gap-x-2"
                >
                  <DoorOpenIcon className="w-3 h-3" />
                  <input
                    type="text"
                    hidden
                    name="checked"
                    defaultValue={shift.is_room_checked ? 'true' : 'false'}
                  />
                  <button type="submit" name="_action" value="room">
                    Marquer ronde salle techniques
                  </button>
                  <input
                    type="number"
                    defaultValue={shift.id}
                    name="shiftId"
                    hidden
                  />
                </fetcher.Form>
              </DropdownMenuItem>
            </>

            <DropdownMenuItem>
              <fetcher.Form
                method="PATCH"
                className="flex items-center gap-x-2"
                onSubmit={(event) => {
                  const response = confirm(
                    'Veuillez confirmer que vous souhaitez supprimer cet enregistrement.'
                  );
                  if (!response) {
                    event.preventDefault();
                  }
                }}
              >
                <TrashIcon className="w-3 h-3" />
                <button type="submit" name="_action" value="destroy">
                  Supprimer
                </button>
                <input
                  type="text"
                  hidden
                  name="shiftId"
                  defaultValue={shift.id}
                />
              </fetcher.Form>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-x-2">
              <PlusCircleIcon className="w-4 h-4" />
              <Link className="w-full" to={`${shift.id}`}>
                Voir plus
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
