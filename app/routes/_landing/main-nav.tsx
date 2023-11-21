import { NavLink } from '@remix-run/react';
import { cn } from '~/lib/utils';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const navLink = 'text-sm font-medium transition-colors hover:text-primary';
  const active = (isActive: boolean) =>
    isActive
      ? `${navLink} text-primary font-semibold `
      : `${navLink} text-foreground/60`;

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <NavLink to={''} className={({ isActive }) => active(isActive)}>
        Dashboard
      </NavLink>
      <NavLink to={'shift'} className={({ isActive }) => active(isActive)}>
        Shifts
      </NavLink>
    </nav>
  );
}
