import { formatInstant } from '~/services/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const LastActivityItem = ({ data }: { data: any }) => {
  return (
    <div className="flex items-center hover:bg-muted/50 py-4 px-3 rounded-sm">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={data.Shift?.supervisor?.profile.avatarUrl as string}
          alt="Avatar"
        />
        <AvatarFallback>Name</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-2">
        <p className="text-sm font-semibold leading-none capitalize">
          {data.system}
        </p>
        <span className="text-xs capitalize text-muted-foreground">
          {data.Shift?.supervisor?.fullName}
        </span>
      </div>
      <div className="ml-auto text-muted-foreground font-medium text-xs md:text-sm">
        {formatInstant(data.Shift.createdAt as string)}
      </div>
    </div>
  );
};

export default LastActivityItem;
