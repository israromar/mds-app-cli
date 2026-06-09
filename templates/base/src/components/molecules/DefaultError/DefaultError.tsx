import { Flame } from 'lucide-react-native';
import { useErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, Text } from '@/components/ui';

type Properties = {
  readonly onReset?: () => void;
};

function DefaultErrorScreen({ onReset = undefined }: Properties) {
  const { colors, fonts, gutters, layout } = useTheme();
  const { t } = useTranslation();
  const { resetBoundary } = useErrorBoundary();

  return (
    <View
      style={[
        layout.flex_1,
        layout.justifyCenter,
        layout.itemsCenter,
        gutters.gap_16,
        gutters.padding_16,
      ]}
    >
      <Icon as={Flame} color={colors.error} size={42} />
      <Text style={[fonts.size_16, fonts.bold]}>
        {t('error_boundary.title')}
      </Text>
      <Text style={[fonts.size_12, fonts.alignCenter]}>
        {t('error_boundary.description')}
      </Text>

      {onReset ? (
        <TouchableOpacity
          onPress={() => {
            resetBoundary();
            onReset();
          }}
        >
          <Text style={[fonts.size_16, fonts.bold]}>
            {t('error_boundary.cta')}
          </Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

export default DefaultErrorScreen;
