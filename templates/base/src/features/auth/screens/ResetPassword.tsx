import type { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps, RootStackParamList } from '@/navigation/types';

import { Button, Column, Modal, useAppToast } from '@/components/ui';

import { translatePasswordResetError } from '@/features/auth/api/apiErrors';
import { completePasswordReset } from '@/features/auth/api/passwordResetApi';
import { recoveryTokenHolder } from '@/features/auth/api/recoveryTokenHolder';
import { passwordSchema } from '@/features/auth/api/schemas';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { AuthScreenShell } from '@/features/auth/components/AuthScreenShell';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';

export function ResetPassword({ route }: RootScreenProps<Paths.ResetPassword>) {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showToast } = useAppToast();
  const email = route.params.email;
  const type = route.params.type ?? 'recovery';

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );
  const [errorModal, setErrorModal] = useState<{
    isVisible: boolean;
    message: string;
    title: string;
  }>({
    isVisible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    if (!recoveryTokenHolder.get()) {
      showToast({
        title: t('screen_ftue.reset_missing_token_title'),
        description: t('screen_ftue.reset_missing_token_body'),
        type: 'error',
      });
      navigation.goBack();
    }
  }, [t, navigation, showToast]);

  const handleSubmit = async () => {
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);

    const parsedPassword = passwordSchema.safeParse(password);
    let hasError = false;

    if (!parsedPassword.success) {
      setPasswordError(t('screen_ftue.validation_invalid_password'));
      hasError = true;
    }

    if (parsedPassword.success && parsedPassword.data !== confirmPassword) {
      setConfirmPasswordError(t('screen_ftue.validation_password_mismatch'));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const recoveryToken = recoveryTokenHolder.get();
    if (!recoveryToken) {
      showToast({
        title: t('screen_ftue.reset_missing_token_title'),
        description: t('screen_ftue.reset_missing_token_body'),
        type: 'error',
      });
      navigation.goBack();
      return;
    }

    setLoading(true);
    const result = await completePasswordReset({
      email,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newPassword: parsedPassword.data!,
      recoveryToken,
    });
    setLoading(false);

    if (!result.ok) {
      setErrorModal({
        isVisible: true,
        title: t('screen_ftue.auth_error_title'),
        message: translatePasswordResetError(t, result.error),
      });
      return;
    }

    recoveryTokenHolder.clear();

    // The native OTP fallback leaves a live recovery session behind. Clear it
    // (locally + on the server) and end recovery mode so the user logs in fresh
    // with their new password instead of being auto-dropped into the app.
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setPasswordRecovery(false);
    void supabase.auth.signOut();

    showToast({
      title: t('screen_ftue.reset_success_title'),
      description: t('screen_ftue.reset_success_body'),
      type: 'success',
    });

    navigation.reset({
      index: 0,
      routes: [{ name: Paths.SignIn }],
    });
  };

  return (
    <>
      <AuthScreenShell
        subtitle={
          type === 'signup'
            ? t('screen_ftue.reset_signup_subtitle', {
                defaultValue: 'Create a secure password for your new account.',
              })
            : t('screen_ftue.reset_subtitle')
        }
        title={
          type === 'signup'
            ? t('screen_ftue.reset_signup_title', {
                defaultValue: 'Create Password',
              })
            : t('screen_ftue.reset_title')
        }
      >
        <Column className="gap-4">
          <AuthInput
            autoCapitalize="none"
            error={passwordError}
            icon="lock"
            label={t('screen_ftue.field_new_password')}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) {
                setPasswordError(undefined);
              }
            }}
            placeholder={t('screen_ftue.sign_in_placeholder_password')}
            secureTextEntry
            value={password}
          />

          <AuthInput
            autoCapitalize="none"
            error={confirmPasswordError}
            icon="lock"
            label={t('screen_ftue.field_confirm_password')}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                setConfirmPasswordError(undefined);
              }
            }}
            placeholder={t('screen_ftue.sign_up_placeholder_confirm_password')}
            secureTextEntry
            value={confirmPassword}
          />

          <Button
            className="mt-2 rounded-xl shadow-sm shadow-neutral-900/10"
            loading={loading}
            onPress={() => void handleSubmit()}
          >
            {t('screen_ftue.reset_submit')}
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
