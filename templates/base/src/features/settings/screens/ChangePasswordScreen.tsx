import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { supabase } from '@/services/supabase';

import { SafeScreen } from '@/components/templates';
import { Button, Column, Heading, Text, useAppToast } from '@/components/ui';

import { AuthInput } from '@/features/auth/components/AuthInput';

export function ChangePasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showToast } = useAppToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    if (newPassword.length < 6) {
      setError(t('app:screen_settings.change_password_error_length'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('app:screen_settings.change_password_error_mismatch'));
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    showToast({
      title: t('app:screen_settings.change_password_success'),
      type: 'success',
    });
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Column className="gap-6">
          <Heading>{t('app:screen_settings.change_password_title')}</Heading>

          <AuthInput
            autoCapitalize="none"
            icon="lock"
            label={t('app:screen_settings.change_password_new_label')}
            onChangeText={setNewPassword}
            placeholder={t('app:screen_settings.change_password_new_placeholder')}
            secureTextEntry
            value={newPassword}
          />

          <AuthInput
            autoCapitalize="none"
            icon="lock"
            label={t('app:screen_settings.change_password_confirm_label')}
            onChangeText={setConfirmPassword}
            placeholder={t(
              'app:screen_settings.change_password_confirm_placeholder',
            )}
            secureTextEntry
            value={confirmPassword}
          />

          {error ? <Text className="text-error">{error}</Text> : undefined}

          <Button loading={loading} onPress={() => void handleSave()}>
            {t('app:common_save')}
          </Button>
        </Column>
      </ScrollView>
    </SafeScreen>
  );
}
