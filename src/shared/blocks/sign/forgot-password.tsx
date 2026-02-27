'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { authClient } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { defaultLocale } from '@/config/locale';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function ForgotPassword({
  passwordResetEnabled,
  defaultEmail = '',
}: {
  passwordResetEnabled: boolean;
  defaultEmail?: string;
}) {
  const t = useTranslations('common.sign');
  const locale = useLocale();

  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const base = locale !== defaultLocale ? `/${locale}` : '';

  const handleSubmit = async () => {
    if (loading) return;

    if (!email?.trim()) {
      toast.error(t('forgot_password_email_required'));
      return;
    }

    if (!passwordResetEnabled) {
      toast.error(t('forgot_password_disabled'));
      return;
    }

    setLoading(true);

    try {
      await authClient.forgetPassword({
        email: email.trim(),
        redirectTo: `${base}/reset-password`,
      });

      setSent(true);
      toast.success(t('forgot_password_sent'));
    } catch (e: any) {
      toast.error(
        e?.error?.message || e?.message || t('forgot_password_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full md:max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          <h1>{t('forgot_password_title')}</h1>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          <h2>{t('forgot_password_description')}</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">{t('email_title')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {sent && (
            <p className="text-xs text-green-600">{t('forgot_password_tip')}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>{t('forgot_password_submit')}</p>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            <Link href="/sign-in" className="underline">
              <span className="cursor-pointer dark:text-white/70">
                {t('back_to_sign_in')}
              </span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
