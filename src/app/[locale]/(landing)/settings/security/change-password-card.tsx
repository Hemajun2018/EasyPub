'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { authClient } from '@/core/auth/client';
import { PanelCard } from '@/shared/blocks/panel';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function ChangePasswordCard() {
  const t = useTranslations('settings.security');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (loading) return;

    if (!currentPassword.trim()) {
      toast.error(t('messages.current_required'));
      return;
    }

    if (!newPassword.trim()) {
      toast.error(t('messages.new_required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('messages.mismatch'));
      return;
    }

    setLoading(true);

    try {
      await authClient.changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
        revokeOtherSessions: true,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('messages.success'));
    } catch (e: any) {
      toast.error(e?.error?.message || e?.message || t('messages.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelCard
      title={t('change_password.title')}
      description={t('change_password.description')}
      className="max-w-md"
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void handleChangePassword();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="current_password">
            {t('fields.current_password')}
          </Label>
          <Input
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="new_password">{t('fields.new_password')}</Label>
          <Input
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm_password">
            {t('fields.confirm_password')}
          </Label>
          <Input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <Button type="submit" className="w-fit" size="sm" disabled={loading}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            t('change_password.buttons.submit')
          )}
        </Button>
      </form>
    </PanelCard>
  );
}
