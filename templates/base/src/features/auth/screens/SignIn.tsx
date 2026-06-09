import type { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useResponsive } from '@/theme/responsive';
import { useAuthStore } from '@/store/authStore';

import { SocialAuthSection } from '@/components/auth';
import { Button, Column, Modal, Row, Text, useAppToast } from '@/components/ui';

import { translateAuthError } from '@/features/auth/api/apiErrors';
import {
  resendSignupConfirmation,
  signInWithEmail,
} from '@/features/auth/api/emailAuth';
import {
  isAppleSignInSupported,
  signInWithAppleNative,
  signInWithGoogleNative,
} from '@/features/auth/api/nativeOAuth';
import { isGoogleOAuthConfigured } from '@/features/auth/api/oauthEnvironment';
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from '@/features/auth/api/schemas';
import { AuthFooterLink } from '@/features/auth/components/AuthFooterLink';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { AuthScreenShell } from '@/features/auth/components/AuthScreenShell';
import { cn } from '@/utils/cn';

type ModalState = {
  isVisible: boolean;
  message: string;
  title: string;
};

export function SignIn() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isTablet } = useResponsive();

  // Form State
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState({
    main: false,
    google: false,
    apple: false,
  });

  const [errorModal, setErrorModal] = useState<ModalState>({
    isVisible: false,
    title: '',
    message: '',
  });

  const { showToast } = useAppToast();
  const [emailConfirmModal, setEmailConfirmModal] = useState<{
    email: string;
    isVisible: boolean;
    message: string;
  }>({
    email: '',
    isVisible: false,
    message: '',
  });

  const handleResendVerification = async () => {
    if (!emailConfirmModal.email) {
      return;
    }
    const targetEmail = emailConfirmModal.email;
    setEmailConfirmModal((previous) => ({ ...previous, isVisible: false }));
    setLoading((previous) => ({ ...previous, main: true }));
    try {
      const { error, ok } = await resendSignupConfirmation(targetEmail);
      if (ok) {
        showToast({
          description: t('screen_ftue.verify_code_resend_success_body'),
          title: t('screen_ftue.verify_code_resend_success_title'),
          type: 'success',
        });
        navigation.navigate(Paths.VerifyResetCode, {
          email: targetEmail,
          type: 'signup',
        });
      } else {
        showError(error ?? t('screen_ftue.errors.unknown'));
      }
    } catch {
      showError(t('screen_ftue.errors.unknown'));
    } finally {
      setLoading((previous) => ({ ...previous, main: false }));
    }
  };

  const showGoogle = isGoogleOAuthConfigured;
  const showApple = isAppleSignInSupported();

  // Landing back on sign-in means any in-progress password recovery is over.
  useEffect(() => {
    useAuthStore.getState().setPasswordRecovery(false);
  }, []);

  // Successful auth flips `isAuthenticated` via the onAuthStateChange listener
  // in Application.tsx, which reactively swaps in the app navigator. No manual
  // navigation reset is needed (and Paths.Main isn't even in the auth stack).
  const navigateHome = useCallback(() => {}, []);

  const showError = (
    message: string,
    title = t('screen_ftue.auth_error_title'),
  ) => {
    setErrorModal({ isVisible: true, title, message });
  };

  const handleOAuth = async (provider: 'apple' | 'google') => {
    setLoading((previous) => ({ ...previous, [provider]: true }));
    const result =
      provider === 'google'
        ? await signInWithGoogleNative()
        : await signInWithAppleNative();
    setLoading((previous) => ({ ...previous, [provider]: false }));

    if (result.ok) {
      navigateHome();
    } else if (
      result.code !== 'cancelled' &&
      result.code !== 'apple_unsupported'
    ) {
      showError(translateAuthError(t, result.code));
    }
  };

  const handleSubmit = async () => {
    setErrors({ identifier: '', password: '' });

    const trimmedIdentifier = form.identifier.trim();
    const isEmail = trimmedIdentifier.includes('@');

    const identResult = isEmail
      ? emailSchema.safeParse(trimmedIdentifier)
      : usernameSchema.safeParse(trimmedIdentifier);
    const passResult = passwordSchema.safeParse(form.password);

    if (!identResult.success || !passResult.success) {
      setErrors({
        identifier: identResult.success
          ? ''
          : isEmail
            ? t('screen_ftue.validation_invalid_email')
            : t('screen_ftue.validation_invalid_username'),
        password: passResult.success
          ? ''
          : t('screen_ftue.validation_invalid_password'),
      });
      return;
    }

    setLoading((previous) => ({ ...previous, main: true }));
    const result = await signInWithEmail(trimmedIdentifier, passResult.data);
    setLoading((previous) => ({ ...previous, main: false }));

    if (result.ok) {
      navigateHome();
    } else if (result.code === 'email-not-confirmed') {
      setEmailConfirmModal({
        email: trimmedIdentifier,
        isVisible: true,
        message: translateAuthError(t, result.code),
      });
    } else {
      showError(translateAuthError(t, result.code));
    }
  };

  return (
    <>
      <AuthScreenShell
        footer={
          <AuthFooterLink
            label={t('screen_ftue.sign_in_no_account')}
            linkText={t('screen_ftue.sign_in_sign_up')}
            onPress={() => navigation.navigate(Paths.SignUp)}
          />
        }
        showBack={false}
        subtitle={t('screen_ftue.sign_in_tagline')}
        title={t('screen_ftue.sign_in_headline')}
      >
        <Column className="gap-6">
          <AuthInput
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.identifier}
            icon="user"
            label={t('screen_ftue.field_email_or_username')}
            onChangeText={(identifier) =>
              setForm((f) => ({ ...f, identifier }))
            }
            placeholder={t('screen_ftue.sign_in_placeholder_email')}
            value={form.identifier}
          />

          <Column className="gap-1.5">
            <Row className="items-center justify-between px-0.5">
              <Text className="font-semibold" variant="label">
                {t('screen_ftue.field_password')}
              </Text>
            </Row>
            <AuthInput
              autoCapitalize="none"
              error={errors.password}
              icon="lock"
              label="" // Hidden label as we have custom one above with forgot link
              onChangeText={(password) => setForm((f) => ({ ...f, password }))}
              placeholder={t('screen_ftue.sign_in_placeholder_password')}
              secureTextEntry
              value={form.password}
            />
            <Pressable
              className="active:opacity-60 self-end"
              hitSlop={8}
              onPress={() => navigation.navigate(Paths.ForgotPassword)}
            >
              <Text
                className={cn(
                  'font-plusJakartaSansSemiBold text-primary-500',
                  isTablet ? 'text-lg' : 'text-sm',
                )}
                variant="caption"
              >
                {t('screen_ftue.sign_in_forgot')}
              </Text>
            </Pressable>
          </Column>

          <Button
            className="mt-2 rounded-xl shadow-sm shadow-neutral-900/10 active:scale-[0.98]"
            loading={loading.main}
            onPress={() => void handleSubmit()}
          >
            {t('screen_ftue.sign_in_submit')}
          </Button>

          <SocialAuthSection
            appleLoading={loading.apple}
            disabled={loading.main}
            googleLoading={loading.google}
            onPressApple={() => void handleOAuth('apple')}
            onPressGoogle={() => void handleOAuth('google')}
            showApple={showApple}
            showGoogle={showGoogle}
          />
        </Column>
      </AuthScreenShell>

      <Modal
        description={emailConfirmModal.message}
        isVisible={emailConfirmModal.isVisible}
        onClose={() =>
          setEmailConfirmModal((previous) => ({
            ...previous,
            isVisible: false,
          }))
        }
        onPrimaryButtonPress={() => {
          setEmailConfirmModal((previous) => ({
            ...previous,
            isVisible: false,
          }));
          navigation.navigate(Paths.VerifyResetCode, {
            email: emailConfirmModal.email,
            type: 'signup',
          });
        }}
        onSecondaryButtonPress={() => void handleResendVerification()}
        primaryButtonText={t('screen_ftue.verify_code_title')}
        secondaryButtonText={t('screen_ftue.verify_code_resend_link')}
        title={t('screen_ftue.sign_up_confirm_title')}
        type="default"
      />

      <Modal
        description={errorModal.message}
        isVisible={errorModal.isVisible}
        onClose={() => setErrorModal((p) => ({ ...p, isVisible: false }))}
        primaryButtonText={t('screen_ftue.auth_error_ok')}
        title={errorModal.title}
        type="error"
      />
    </>
  );
}
