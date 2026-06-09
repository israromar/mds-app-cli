import type { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps, RootStackParamList } from '@/navigation/types';

import { Button, Column, Modal, Text, useAppToast } from '@/components/ui';

import { PASSWORD_RESET_RESEND_COOLDOWN_SECONDS } from '@/constants/auth';
import { MILLISECONDS_PER_SECOND } from '@/constants/time';
import { translatePasswordResetError } from '@/features/auth/api/apiErrors';
import {
  requestPasswordReset,
  verifyPasswordResetCode,
} from '@/features/auth/api/passwordResetApi';
import { recoveryTokenHolder } from '@/features/auth/api/recoveryTokenHolder';
import { resetCodeSchema } from '@/features/auth/api/schemas';
import { AuthScreenShell } from '@/features/auth/components/AuthScreenShell';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';

export function VerifyResetCode({
  route,
}: RootScreenProps<Paths.VerifyResetCode>) {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showToast } = useAppToast();
  const email = route.params.email;
  const type = route.params.type ?? 'recovery';

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);
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
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((previous) => previous - 1);
      }, MILLISECONDS_PER_SECOND);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [cooldown]);

  // The recovery OTP native fallback (verifyOtp) establishes a real session
  // mid-flow. Flag recovery so the root navigator keeps the user in the auth
  // stack until they actually set a new password (see Application.tsx).
  useEffect(() => {
    if (type === 'recovery') {
      useAuthStore.getState().setPasswordRecovery(true);
    }
  }, [type]);

  const handleResend = async () => {
    if (cooldown > 0) {
      return;
    }

    setResending(true);
    let success = false;

    if (type === 'signup') {
      const { error } = await supabase.auth.resend({
        email,
        type: 'signup',
      });
      setResending(false);

      if (error) {
        setErrorModal({
          isVisible: true,
          title: t('screen_ftue.auth_error_title'),
          message: error.message,
        });
        return;
      }
      success = true;
    } else {
      const result = await requestPasswordReset(email);
      setResending(false);

      if (!result.ok) {
        setErrorModal({
          isVisible: true,
          title: t('screen_ftue.auth_error_title'),
          message: translatePasswordResetError(t, result.error),
        });
        return;
      }
      success = true;
    }

    if (success) {
      setCooldown(PASSWORD_RESET_RESEND_COOLDOWN_SECONDS);
      showToast({
        title: t('screen_ftue.verify_code_resend_success_title'),
        description: t('screen_ftue.verify_code_resend_success_body'),
        type: 'success',
      });
    }
  };

  const handleSubmit = async () => {
    setCodeError(undefined);

    const parsedCode = resetCodeSchema.safeParse(code);

    if (!parsedCode.success) {
      setCodeError(t('screen_ftue.validation_invalid_otp'));
      return;
    }

    setLoading(true);

    if (type === 'signup') {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: parsedCode.data,
        type: 'signup',
      });
      setLoading(false);

      if (error) {
        setErrorModal({
          isVisible: true,
          title: t('screen_ftue.auth_error_title'),
          message: error.message,
        });
        return;
      }

      // Verifying the signup OTP establishes a session; the auth listener in
      // Application.tsx flips `isAuthenticated` and reactively swaps in the app
      // navigator, so no manual reset to Paths.Main is needed here.
      showToast({
        title: t('screen_ftue.auth_success_title'),
        type: 'success',
      });
    } else {
      const result = await verifyPasswordResetCode(email, parsedCode.data);
      setLoading(false);

      if (!result.ok) {
        setErrorModal({
          isVisible: true,
          title: t('screen_ftue.auth_error_title'),
          message: translatePasswordResetError(t, result.error),
        });
        return;
      }

      if (result.recoveryToken) {
        recoveryTokenHolder.set(result.recoveryToken);
      }

      navigation.navigate(Paths.ResetPassword, { email });
    }
  };

  return (
    <>
      <AuthScreenShell
        subtitle={
          type === 'signup'
            ? t('screen_ftue.verify_signup_subtitle', {
                email,
                defaultValue: `Enter the 6-digit code we sent to ${email}.`,
              })
            : t('screen_ftue.verify_code_subtitle', { email })
        }
        title={
          type === 'signup'
            ? t('screen_ftue.verify_signup_title', {
                defaultValue: 'Verify email',
              })
            : t('screen_ftue.reset_title', {
                defaultValue: 'Reset Password',
              })
        }
      >
        <Column className="gap-6">
          <OtpInput
            code={code}
            error={codeError}
            label={t('screen_ftue.field_otp')}
            onCodeChange={(newCode) => {
              setCode(newCode);
              if (codeError) {
                setCodeError(undefined);
              }
            }}
          />

          <Column className="gap-4 mt-2">
            <Button
              className="rounded-xl shadow-sm shadow-neutral-900/10"
              loading={loading}
              onPress={() => void handleSubmit()}
            >
              {type === 'signup'
                ? t('screen_ftue.verify_signup_submit', {
                    defaultValue: 'Verify',
                  })
                : t('screen_ftue.verify_code_submit')}
            </Button>

            <Pressable
              disabled={cooldown > 0 || resending}
              onPress={() => void handleResend()}
            >
              <Text
                className={`text-center font-plusJakartaSansSemiBold ${
                  cooldown > 0 || resending ? 'text-neutral-300' : 'text-tint'
                }`}
                variant="caption"
              >
                {cooldown > 0
                  ? t('screen_ftue.verify_code_resend_cooldown', {
                      seconds: cooldown,
                    })
                  : t('screen_ftue.verify_code_resend_link')}
              </Text>
            </Pressable>
          </Column>
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
