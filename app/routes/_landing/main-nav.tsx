import { NavLink } from '@remix-run/react';
import { cn } from '~/lib/utils';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const navLink =
    'transition-colors hover:text-foreground/80 text-foreground/60 text-sm';
  const active = (isActive: boolean) =>
    isActive ? `${navLink} text-primary` : `${navLink} text-foreground/60`;

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6 tex', className)}
      {...props}
    >
      <NavLink to={''} className={({ isActive }) => active(isActive)}>
        Dashboard
      </NavLink>
      <NavLink to={'shift'} className={({ isActive }) => active(isActive)}>
        My Shifts
      </NavLink>
    </nav>
  );
}
