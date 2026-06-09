import type { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { Button, Column, Modal, useAppToast } from '@/components/ui';

import { translatePasswordResetError } from '@/features/auth/api/apiErrors';
import { requestPasswordReset } from '@/features/auth/api/passwordResetApi';
import { emailSchema } from '@/features/auth/api/schemas';
import { AuthFooterLink } from '@/features/auth/components/AuthFooterLink';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { AuthScreenShell } from '@/features/auth/components/AuthScreenShell';

export function ForgotPassword() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showToast } = useAppToast();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isVisible: boolean;
    message: string;
    title: string;
  }>({
    isVisible: false,
    title: '',
    message: '',
  });

  const handleSubmit = async () => {
    setEmailError(undefined);

    const parsedEmail = emailSchema.safeParse(email);

    if (!parsedEmail.success) {
      setEmailError(t('screen_ftue.validation_invalid_email'));
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(parsedEmail.data);
    setLoading(false);

    if (!result.ok) {
      setErrorModal({
        isVisible: true,
        title: t('screen_ftue.auth_error_title'),
        message: translatePasswordResetError(t, result.error),
      });
      return;
    }

    showToast({
      title: t('screen_ftue.forgot_password_success_title'),
      description: t('screen_ftue.forgot_password_success_body'),
      type: 'success',
    });

    navigation.navigate(Paths.VerifyResetCode, { email: parsedEmail.data });
  };

  return (
    <>
      <AuthScreenShell
        footer={
          <AuthFooterLink
            label={t('screen_ftue.forgot_password_already_has_code_label', {
              defaultValue: 'Already have a code?',
            })}
            linkText={t('screen_ftue.forgot_password_already_has_code_link', {
              defaultValue: 'Verify here',
            })}
            onPress={() => {
              const parsedEmail = emailSchema.safeParse(email);
              if (!parsedEmail.success) {
                setEmailError(t('screen_ftue.validation_invalid_email'));
                return;
              }
              navigation.navigate(Paths.VerifyResetCode, {
                email: parsedEmail.data,
              });
            }}
          />
        }
        subtitle={t('screen_ftue.forgot_password_subtitle')}
        title={t('screen_ftue.forgot_password_title')}
      >
        <Column className="gap-4">
          <AuthInput
            accessibilityLabel={t('screen_ftue.field_email')}
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
            icon="email"
            keyboardType="email-address"
            label={t('screen_ftue.field_email')}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            placeholder={t('screen_ftue.forgot_password_placeholder_email')}
            value={email}
          />

          <Button
            className="mt-2 rounded-xl shadow-sm shadow-neutral-900/10"
            loading={loading}
            onPress={() => void handleSubmit()}
          >
            {t('screen_ftue.forgot_password_submit')}
          </Button>
        </Column>
      </AuthScreenShell>

      <Modal
        description={errorModal.message}
        isVisible={errorModal.isVisible}
        onClose={() =>
          setErrorModal((previous) => ({ ...previous, isVisible: false }))
        }
        primaryButtonText={t('screen_ftue.auth_error_ok')}
        title={errorModal.title}
        type="error"
      />
    </>
  );
}
