import React from 'react';
import { SidebarNav } from './side-nav';
import { Separator } from '~/components/ui/separator';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
  },
  {
    title: 'Nouveau utilisateur',
    href: '/settings/new-user',
  },
  {
    title: 'Changer de mot de passe',
    href: '/settings/new-password',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: SettingsLayoutProps) => {
  return (
    <div className="space-y-6 mt-8 container md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-semibold tracking-tight">Réglages</h2>
        <p className="text-muted-foreground">
          Gérer les paramètres de votre compte.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
