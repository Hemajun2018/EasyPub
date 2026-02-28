'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { authClient } from '@/core/auth/client';
import { defaultLocale } from '@/config/locale';
import { PanelCard } from '@/shared/blocks/panel';
import { Button } from '@/shared/components/ui/button';

export function ResetPasswordCard({
  email,
  passwordResetEnabled,
}: {
  email: string;
  passwordResetEnabled: boolean;
}) {
  const tSecurity = useTranslations('settings.security');
  const tCommon = useTranslations('common.sign');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const base = locale !== defaultLocale ? `/${locale}` : '';

  const handleSendResetEmail = async () => {
    if (loading) return;

    if (!passwordResetEnabled) {
      toast.error(tCommon('forgot_password_disabled'));
      return;
    }

    if (!email?.trim()) {
      toast.error(tCommon('forgot_password_email_required'));
      return;
    }

    setLoading(true);
    try {
      await authClient.forgetPassword({
        email: email.trim(),
        redirectTo: `${base}/reset-password`,
      });
      setSent(true);
      toast.success(tCommon('forgot_password_sent'));
    } catch (e: any) {
      toast.error(
        e?.error?.message || e?.message || tCommon('forgot_password_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelCard
      title={tSecurity('reset_password.title')}
      description={tSecurity('reset_password.description')}
      content={tSecurity('reset_password.tip')}
      className="max-w-md"
    >
      <div className="grid gap-3">
        {sent && (
          <p className="text-xs text-green-600">{tCommon('forgot_password_tip')}</p>
        )}
        <Button
          type="button"
          className="w-fit"
          size="sm"
          disabled={loading || !passwordResetEnabled}
          onClick={() => void handleSendResetEmail()}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            tCommon('forgot_password_submit')
          )}
        </Button>
      </div>
    </PanelCard>
  );
}
