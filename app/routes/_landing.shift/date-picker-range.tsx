'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { setDefaultOptions, format, subDays } from 'date-fns';
import { cn } from '~/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

import { Calendar } from '~/components/ui/calendar';
import { Button } from '~/components/ui/button';
import { DateRange } from 'react-day-picker';
import fr from 'date-fns/locale/fr/index.js';

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  return (
    <div className={cn('grid gap-2', className)}>
      <input type="hidden" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd LLL, y')} -{' '}
                  {format(date.to, 'dd LLL, y')}
                </>
              ) : (
                format(date.from, 'dd LLL, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}