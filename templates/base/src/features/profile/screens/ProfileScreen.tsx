import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { SafeScreen } from '@/components/templates';
import { Button, Card, Column, Heading, Text } from '@/components/ui';

export function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Column className="gap-6">
          <Heading>{t('app:screen_profile.title')}</Heading>

          <Card className="gap-2 p-5">
            <Text className="font-plusJakartaSansBold text-lg">
              {t('app:screen_profile.placeholder_name')}
            </Text>
            <Text className="text-muted">
              {t('app:screen_profile.placeholder_bio')}
            </Text>
          </Card>

          <Button onPress={() => navigation.navigate(Paths.EditProfile)}>
            {t('app:screen_profile.edit')}
          </Button>
        </Column>
      </ScrollView>
    </SafeScreen>
  );
}
