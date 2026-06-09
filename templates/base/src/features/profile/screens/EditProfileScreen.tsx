import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { SafeScreen } from '@/components/templates';
import { Button, Column, Heading, Input, Text } from '@/components/ui';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // TODO: persist profile changes to your backend.
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Column className="gap-6">
          <Heading>{t('app:screen_edit_profile.title')}</Heading>

          <Column className="gap-2">
            <Text className="font-semibold" variant="label">
              {t('app:screen_edit_profile.name_label')}
            </Text>
            <Input
              autoCapitalize="words"
              onChangeText={setName}
              placeholder={t('app:screen_edit_profile.name_placeholder')}
              value={name}
            />
          </Column>

          <Column className="gap-2">
            <Text className="font-semibold" variant="label">
              {t('app:screen_edit_profile.bio_label')}
            </Text>
            <Input
              multiline
              onChangeText={setBio}
              placeholder={t('app:screen_edit_profile.bio_placeholder')}
              value={bio}
            />
          </Column>

          <Button onPress={handleSave}>{t('app:common_save')}</Button>
        </Column>
      </ScrollView>
    </SafeScreen>
  );
}
