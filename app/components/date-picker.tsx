import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Input } from './ui/input';

const DateTimePicker = ({ dateTimeName }: { dateTimeName: string }) => {
  const now = new Date();
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState(now.toISOString().slice(11, 16));
  const [dateTimeValue, setDateTimeValue] = React.useState<string>();

  React.useEffect(() => {
    // Mettez à jour la valeur du champ datetime-local lorsque la date ou l'heure change
    if (date) {
      const dateInTimeZone = utcToZonedTime(date, 'Africa/Dakar');
      const selectedDateTime = new Date(
        dateInTimeZone.getFullYear(),
        dateInTimeZone.getMonth(),
        dateInTimeZone.getDate(),
        parseInt(time.split(':')[0], 10),
        parseInt(time.split(':')[1], 10),
        0,
        0
      );

      const utcDateTime = zonedTimeToUtc(selectedDateTime, 'Africa/Dakar');
      const formattedDateTime = utcDateTime.toISOString();
      setDateTimeValue(formattedDateTime);
    }
  }, [date, time]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal relative',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date and time</span>}
          <Input
            className="self-center absolute w-15 right-0"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input hidden type="datetime-local" name={dateTimeName} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto flex p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
