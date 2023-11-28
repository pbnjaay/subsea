import { Link } from '@remix-run/react';
import { ModeToggle } from './mode-toogle';
import { UserNav } from './user-nav';
import { MainNav } from './main-nav';
import { LinkBreak2Icon } from '@radix-ui/react-icons';
import { Session } from '@supabase/supabase-js';

export interface Profile {
  avatar_url: string | null;
  full_name: string | null;
  id: string;
  is_admin: boolean;
  updated_at: string | null;
  username: string | null;
}

const Header = ({ profile }: { profile: Profile | null }) => {
  return (
    <header className="container supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="h-14 flex justify-between items-center">
        <div className="flex gap-x-12">
          <div className="flex items-center gap-x-2">
            <LinkBreak2Icon />
            <Link className="font-semibold text-lg" to={'/'}>
              SubSea
            </Link>
          </div>
          <MainNav className="hidden md:flex" />
        </div>
        <div className="flex gap-x-4 items-center">
          <ModeToggle />
          <UserNav profile={profile} />
        </div>
      </div>
    </header>
  );
};

export default Header;
