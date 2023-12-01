import { Link, useNavigate, useOutletContext } from '@remix-run/react';
import { Session } from '@supabase/supabase-js';
import { User, LogOut, UserPlusIcon } from 'lucide-react';
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
import { SupabaseOutletContext } from '~/root';
import { Profile } from './header';

export const UserNav = ({ profile }: { profile: Profile | null }) => {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:block" asChild>
        <Avatar className="w-7 h-7 overflow-hidden">
          <AvatarImage
            src={
              profile?.avatar_url
                ? profile?.avatar_url
                : `https://github.com/shadcn.png`
            }
          />
          <AvatarFallback>Username</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-35" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link to="/me">{profile ? profile.username : 'Profile'}</Link>
          </DropdownMenuItem>
          {profile?.is_admin && (
            <DropdownMenuItem>
              <UserPlusIcon className="mr-2 h-4 w-4" />
              <Link to={'/signup'}>Nouveau utilisateur</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
