/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { SocialAuthSection } from '@/components/auth';
import { Button, Column, Modal, useAppToast } from '@/components/ui';

import { translateAuthError } from '@/features/auth/api/apiErrors';
import {
  checkUsernameAvailable,
  signUpWithEmail,
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
import { useUsernameAvailability } from '@/features/auth/hooks/useUsernameAvailability';

export function SignUp() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showToast } = useAppToast();

  const [appleLoading, setAppleLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >(undefined);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | undefined>(
    undefined,
  );

  const usernameAvailability = useUsernameAvailability(username);

  const usernameHelper = (() => {
    if (usernameError) return undefined;
    switch (usernameAvailability) {
      case 'available': {
        return {
          tone: 'success' as const,
          text: t('screen_ftue.username_available'),
        };
      }
      case 'checking': {
        return {
          tone: 'muted' as const,
          text: t('screen_ftue.username_checking'),
        };
      }
      case 'taken': {
        return {
          tone: 'error' as const,
          text: t('screen_ftue.errors.username_already_exists'),
        };
      }
      default: {
        return undefined;
      }
    }
  })();

  type ModalState = {
    isVisible: boolean;
    message: string;
    onClose?: () => void;
    title: string;
    type: 'default' | 'error' | 'success';
  };

  const [modal, setModal] = useState<ModalState>({
    isVisible: false,
    message: '',
    title: '',
    type: 'error',
  });

  const showGoogle = isGoogleOAuthConfigured;
  const showApple = isAppleSignInSupported();

  const navigateHome = () => {
    // The onAuthStateChange listener in Application.tsx flips `isAuthenticated`
    // on the new session and reactively swaps in the app navigator; no manual
    // reset to Paths.Main (which isn't part of the auth stack) is required.
    showToast({
      title: t('screen_ftue.auth_success_title'),
      type: 'success',
    });
  };

  const showError = (
    message: string,
    title = t('screen_ftue.auth_error_title'),
  ) => {
    setModal({
      isVisible: true,
      message,
      title,
      type: 'error',
    });
  };

  const showSuccess = (
    message: string,
    title: string,
    onClose?: () => void,
  ) => {
    setModal({
      isVisible: true,
      message,
      onClose,
      title,
      type: 'success',
    });
  };

  const handleGoogleOAuth = async () => {
    setGoogleLoading(true);
    const result = await signInWithGoogleNative();
    setGoogleLoading(false);

    if (result.ok) {
      navigateHome();
      return;
    }

    if (result.code !== 'cancelled') {
      showError(translateAuthError(t, result.code));
    }
  };

  const handleAppleOAuth = async () => {
    setAppleLoading(true);
    const result = await signInWithAppleNative();
    setAppleLoading(false);

    if (result.ok) {
      navigateHome();
      return;
    }

    if (result.code !== 'cancelled' && result.code !== 'apple_unsupported') {
      showError(translateAuthError(t, result.code));
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setUsernameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);

    const parsedUsername = usernameSchema.safeParse(username);
    const parsedEmail = emailSchema.safeParse(email);
    const parsedPassword = passwordSchema.safeParse(password);

    let isValid = true;

    if (!parsedUsername.success) {
      setUsernameError(t('screen_ftue.validation_invalid_username'));
      isValid = false;
    }
    if (!parsedEmail.success) {
      setEmailError(t('screen_ftue.validation_invalid_email'));
      isValid = false;
    }
    if (!parsedPassword.success) {
      setPasswordError(t('screen_ftue.validation_invalid_password'));
      isValid = false;
    } else if (parsedPassword.data !== confirmPassword) {
      setConfirmPasswordError(t('screen_ftue.validation_password_mismatch'));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Pre-flight: catch obvious username collisions before round-tripping
    // through Supabase Auth so the user gets immediate, targeted feedback
    // (the trigger-level unique-constraint check still backs this up).
    setLoading(true);
    const availability = await checkUsernameAvailable(parsedUsername.data!);
    if (availability.ok && !availability.available) {
      setLoading(false);
      setUsernameError(t('screen_ftue.errors.username_already_exists'));
      return;
    }

    const result = await signUpWithEmail(
      parsedEmail.data!,
      parsedPassword.data!,
      {
        username: parsedUsername.data,
      },
    );
    setLoading(false);
    console.warn('sign up result', result);

    if (!result.ok) {
      const errorMessage = translateAuthError(t, result.code);

      switch (result.code) {
        case 'user-already-exists': {
          setEmailError(errorMessage);
          break;
        }
        case 'username-already-exists': {
          setUsernameError(errorMessage);
          break;
        }
        case 'weak-password': {
          setPasswordError(errorMessage);
          break;
        }
        default: {
          showError(errorMessage);
          break;
        }
      }
      return;
    }

    // Check session
    if (result.session) {
      navigateHome();
      return;
    }

    // Success with email confirmation required
    showSuccess(
      t('screen_ftue.sign_up_confirm_body'),
      t('screen_ftue.sign_up_confirm_title'),
      () => {
        navigation.navigate(Paths.VerifyResetCode, {
          email: parsedEmail.data!,
          type: 'signup',
        });
      },
    );
  };

  return (
    <>
      <AuthScreenShell
        footer={
          <AuthFooterLink
            label={t('screen_ftue.sign_up_already_account')}
            linkText={t('screen_ftue.sign_up_sign_in')}
            onPress={() => {
              navigation.navigate(Paths.SignIn);
            }}
          />
        }
        subtitle={t('screen_ftue.sign_up_subtitle')}
        title={t('screen_ftue.sign_up_title')}
      >
        <Column className="gap-6">
          <AuthInput
            accessibilityLabel={t('screen_ftue.field_username')}
            autoCapitalize="none"
            autoCorrect={false}
            error={usernameError}
            helper={usernameHelper?.text}
            helperTone={usernameHelper?.tone}
            icon="user"
            label={t('screen_ftue.field_username')}
            onChangeText={(text) => {
              setUsername(text);
              if (usernameError) {
                setUsernameError(undefined);
              }
            }}
            placeholder={t('screen_ftue.sign_up_placeholder_username')}
            value={username}
          />

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
            placeholder={t('screen_ftue.sign_up_placeholder_email')}
            value={email}
          />

          <AuthInput
            accessibilityLabel={t('screen_ftue.field_password')}
            autoCapitalize="none"
            error={passwordError}
            icon="lock"
            label={t('screen_ftue.field_password')}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) {
                setPasswordError(undefined);
              }
            }}
            placeholder={t('screen_ftue.sign_up_placeholder_password')}
            secureTextEntry
            value={password}
          />

          <AuthInput
            accessibilityLabel={t('screen_ftue.field_confirm_password')}
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
            className="mt-2 rounded-xl shadow-sm shadow-neutral-900/10 active:scale-[0.98]"
            disabled={
              usernameAvailability === 'checking' ||
              usernameAvailability === 'taken'
            }
            loading={loading}
            onPress={() => void handleSubmit()}
          >
            {t('screen_ftue.sign_up_submit')}
          </Button>
        </Column>

        <SocialAuthSection
          appleLoading={appleLoading}
          disabled={loading}
          googleLoading={googleLoading}
          onPressApple={() => void handleAppleOAuth()}
          onPressGoogle={() => void handleGoogleOAuth()}
          showApple={showApple}
          showGoogle={showGoogle}
        />
      </AuthScreenShell>

      <Modal
        description={modal.message}
        isVisible={modal.isVisible}
        onClose={() => {
          setModal((previous) => ({ ...previous, isVisible: false }));
          modal.onClose?.();
        }}
        primaryButtonText={t('screen_ftue.auth_error_ok')}
        title={modal.title}
        type={modal.type}
      />
    </>
  );
}
