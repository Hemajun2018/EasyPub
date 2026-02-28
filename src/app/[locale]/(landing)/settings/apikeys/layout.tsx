import { ReactNode } from 'react';

import { redirect } from '@/core/i18n/navigation';
import { PERMISSIONS } from '@/core/rbac/permission';
import { getSignUser } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';

export default async function ApiKeysLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale } = await params;
  const user = await getSignUser();

  if (!user) {
    redirect({ href: '/sign-in', locale });
    return null;
  }

  const isAdmin = await hasPermission(user.id, PERMISSIONS.ADMIN_ACCESS);
  if (!isAdmin) {
    redirect({ href: '/settings/profile', locale });
  }

  return <>{children}</>;
}
