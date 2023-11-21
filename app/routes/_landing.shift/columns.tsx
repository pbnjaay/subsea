import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

import { Form, Link, useFetcher, useOutletContext } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '~/components/ui/badge';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SupabaseOutletContext, links } from '~/root';
import { formateDate } from '~/services/utils';

export type Shifts = {
  id: number;
  created_at: string;
  supervisor: string | null;
  end_at: string | null;
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
    accessorKey: 'supervisor',
    header: () => <div className="text-justify">Supervisor</div>,
  },
  {
    accessorKey: 'created_at',
    header: () => <div className="text-justify">Start</div>,
    cell: ({ row }) => {
      const created_at = new Date(row.getValue('created_at'));
      const formatted = formateDate(created_at);

      return <div className="text-justify font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'end_at',
    header: () => <div className="text-justify">End</div>,
    cell: ({ row }) => {
      const end_date = row.getValue('end_at')
        ? new Date(row.getValue('end_at'))
        : null;

      return end_date ? (
        <div className="text-justify font-medium">{formateDate(end_date)}</div>
      ) : (
        <Badge>In progress</Badge>
      );
    },
  },
  {
    accessorKey: 'is_basic_done',
    header: () => <div className="text-justify">Basic</div>,
    cell: ({ row }) => {
      const is_basic_done = Boolean(row.getValue('is_basic_done'));
      return (
        <div className="text-justify font-medium">
          {is_basic_done ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-primary" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_alarm_checked',
    header: () => <div className="text-justify">Alarm</div>,
    cell: ({ row }) => {
      const is_alarm_checked = Boolean(row.getValue('is_alarm_checked'));
      return (
        <div className="text-justify font-medium">
          {is_alarm_checked ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-primary" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_room_checked',
    header: () => <div className="text-justify">Room</div>,
    cell: ({ row }) => {
      const is_room_checked = Boolean(row.getValue('is_room_checked'));
      return (
        <div className="text-justify font-medium">
          {is_room_checked ? (
            <CheckCircledIcon className="text-primary" />
          ) : (
            <CrossCircledIcon className="text-primary" />
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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {!shift.end_at && (
              <DropdownMenuItem>
                <fetcher.Form action={`/shift/${shift.id}/end`} method="PATCH">
                  <Button size={'sm'} variant={'ghost'} type="submit">
                    End shift
                  </Button>
                </fetcher.Form>
              </DropdownMenuItem>
            )}
            {!shift.is_basic_done && (
              <DropdownMenuItem>
                <fetcher.Form
                  action={`/shift/${shift.id}/basic`}
                  method="PATCH"
                >
                  <Button size={'sm'} variant={'ghost'} type="submit">
                    Mark basic
                  </Button>
                </fetcher.Form>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <fetcher.Form
                action={`/shift/${shift.id}/destroy`}
                method="PATCH"
              >
                <Button size={'sm'} variant={'ghost'} type="submit">
                  Delete shifts
                </Button>
              </fetcher.Form>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`${shift.id}`}>View shift details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
