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
import { User } from '@prisma/client';

export type Shifts = {
  id: number;
  startAt: Date;
  endAt: Date;
  isBasicDone: boolean;
  isAlarmChecked: boolean;
  isRoomChecked: boolean;
  createdAt: Date;
  userId: number;
  supervisor: User;
};

export const columns: ColumnDef<Shifts>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="text-justify">Id</div>,
  },
  {
    accessorKey: 'supervisor',
    header: () => <div className="text-justify">Superviseur</div>,
    cell: ({ row }) => {
      const supervisor = row.getValue<User>('supervisor');
      return (
        <Link
          className="text-justify font-medium capitalize"
          to={`/shift/${row.original.id}`}
        >
          {supervisor ? supervisor.fullName : 'no name'}
        </Link>
      );
    },
  },
  {
    accessorKey: 'startAt',
    header: () => <div className="text-justify">Debut</div>,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('startAt'));
      const formatted = formateDate(createdAt);

      return <p className="text-justify font-medium">{formatted}</p>;
    },
  },
  {
    accessorKey: 'endAt',
    header: () => <div className="text-justify">Fin</div>,
    cell: ({ row }) => {
      const endAte = row.getValue('endAt')
        ? new Date(row.getValue('endAt'))
        : null;

      return endAte ? (
        <div className="text-justify font-medium">{formateDate(endAte)}</div>
      ) : (
        <span className="inline-flex justify-center w-2 h-2 bg-green-600 rounded-full"></span>
      );
    },
  },
  {
    accessorKey: 'isBasicDone',
    header: () => <div className="text-justify">Basique</div>,
    cell: ({ row }) => {
      const isBasicDone = Boolean(row.getValue('isBasicDone'));
      return (
        <div className="text-justify font-medium">
          {isBasicDone ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'isAlarmChecked',
    header: () => <div className="text-justify">Alarme</div>,
    cell: ({ row }) => {
      const isAlarmChecked = Boolean(row.getValue('isAlarmChecked'));
      return (
        <div className="text-justify font-medium">
          {isAlarmChecked ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'isRoomChecked',
    header: () => <div className="text-justify">Chambre</div>,
    cell: ({ row }) => {
      const isRoomChecked = Boolean(row.getValue('isRoomChecked'));
      return (
        <div className="text-justify font-medium">
          {isRoomChecked ? (
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
                    defaultValue={shift.isBasicDone ? 'true' : 'false'}
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
                    defaultValue={shift.isAlarmChecked ? 'true' : 'false'}
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
                    defaultValue={shift.isRoomChecked ? 'true' : 'false'}
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
