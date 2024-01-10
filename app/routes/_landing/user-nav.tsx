import { Link, redirect, useOutletContext } from '@remix-run/react';
import { Settings, ArchiveIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { DatabaseOutletContext } from '~/root';

export const UserNav = () => {
  const { profile, user } = useOutletContext<DatabaseOutletContext>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
        <Avatar className="w-7 h-7 overflow-hidden">
          <AvatarImage src={profile?.avatarUrl} />
          <AvatarFallback>Username</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-35" align="start">
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
        <DropdownMenuItem>
          <ArchiveIcon className="mr-2 h-4 w-4" />
          <Link to="/shift">My sfhit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link to="/settings">Réglages</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action="/" method="post">
          <input type="hidden" name="_action" value="logout" />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <button type="submit">Log out</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
