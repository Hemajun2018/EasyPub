import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { PERMISSIONS } from '@/core/rbac/permission';
import { ConsoleLayout } from '@/shared/blocks/console/layout';
import { getSignUser } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';
import { Nav } from '@/shared/types/blocks/common';

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations('settings.sidebar');
  const user = await getSignUser();
  const isAdmin = user
    ? await hasPermission(user.id, PERMISSIONS.ADMIN_ACCESS)
    : false;

  // settings title
  const title = t('title');

  // settings nav
  const nav = t.raw('nav') as Nav;
  const topNav = t.raw('top_nav') as Nav;

  const filteredNav = isAdmin
    ? nav
    : {
        ...nav,
        items: nav.items.filter((item) => item.url !== '/settings/apikeys'),
      };

  const filteredTopNav = isAdmin
    ? topNav
    : {
        ...topNav,
        items: topNav.items.filter((item) => item.url !== '/activity'),
      };

  return (
    <ConsoleLayout
      title={title}
      nav={filteredNav}
      topNav={filteredTopNav}
      className="py-16 md:py-20"
    >
      {children}
    </ConsoleLayout>
  );
}
