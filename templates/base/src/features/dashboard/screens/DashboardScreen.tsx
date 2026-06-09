import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { SafeScreen } from '@/components/templates';
import { Button, Card, Column, Heading, Text } from '@/components/ui';

import { APP_CONFIG } from '@/constants/app';

export function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Column className="gap-6">
          <Column className="gap-1">
            <Heading>{t('app:screen_dashboard.title')}</Heading>
            <Text className="text-muted">
              {t('app:screen_dashboard.subtitle', { name: APP_CONFIG.name })}
            </Text>
          </Column>

          <Card className="gap-3 p-5">
            <Text className="font-plusJakartaSansBold text-lg">
              {t('app:screen_dashboard.card_title')}
            </Text>
            <Text className="text-muted">
              {t('app:screen_dashboard.card_body')}
            </Text>
          </Card>

          <Column className="gap-3">
            <Button onPress={() => navigation.navigate(Paths.Profile)}>
              {t('app:screen_dashboard.go_profile')}
            </Button>
            <Button
              variant="outline"
              onPress={() => navigation.navigate(Paths.Settings)}
            >
              {t('app:screen_dashboard.go_settings')}
            </Button>
          </Column>
        </Column>
      </ScrollView>
    </SafeScreen>
  );
}
