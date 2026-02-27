'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { authClient } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
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

export function ResetPassword({
  token,
  error,
}: {
  token?: string;
  error?: string;
}) {
  const t = useTranslations('common.sign');
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizedToken = useMemo(() => (token || '').trim(), [token]);
  const invalidToken = error === 'INVALID_TOKEN';
  const tokenMissing = !invalidToken && !normalizedToken;
  const disabled = invalidToken || tokenMissing;

  const handleSubmit = async () => {
    if (loading || disabled) return;

    if (!newPassword.trim()) {
      toast.error(t('reset_password_new_required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('reset_password_password_mismatch'));
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        token: normalizedToken,
        newPassword,
      });
      toast.success(t('reset_password_success'));
      router.replace('/sign-in');
    } catch (e: any) {
      toast.error(
        e?.error?.message || e?.message || t('reset_password_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full md:max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          <h1>{t('reset_password_title')}</h1>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          <h2>{t('reset_password_description')}</h2>
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
          {invalidToken && (
            <p className="text-xs text-red-500">
              {t('reset_password_invalid_token')}
            </p>
          )}
          {tokenMissing && (
            <p className="text-xs text-red-500">
              {t('reset_password_missing_token')}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="newPassword">{t('reset_password_new_title')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={disabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">
              {t('reset_password_confirm_title')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={disabled}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || disabled}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>{t('reset_password_submit')}</p>
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
