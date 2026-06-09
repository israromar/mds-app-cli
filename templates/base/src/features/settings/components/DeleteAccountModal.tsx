import { AlertTriangle, X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { palette } from '@/theme';

import { BaseSheetModal, IconButton, Text, VStack } from '@/components/ui';

type DeleteAccountModalProps = {
  readonly isVisible: boolean;
  readonly onClose: () => void;
  readonly onDeleteConfirm: () => Promise<void>;
};

export function DeleteAccountModal({
  isVisible,
  onClose,
  onDeleteConfirm,
}: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteConfirm();
    } catch (error) {
      console.error('Delete account failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <BaseSheetModal isVisible={isVisible} onClose={onClose}>
      {/* Close Header Button */}
      <View className="flex-row justify-end mb-2">
        <IconButton accessibilityLabel="Close" onPress={onClose}>
          <X color={palette.neutral[400]} size={24} />
        </IconButton>
      </View>

      {/* Visual Warning Box */}
      <VStack className="items-center mb-7">
        <View className="h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 mb-5">
          <AlertTriangle color="#EF4444" size={32} />
        </View>

        <Text className="text-[22px] font-plusJakartaSansBold text-neutral-900 text-center mb-3">
          {t('app:screen_settings.delete_account_title')}
        </Text>

        <Text className="text-sm text-neutral-500 text-center leading-5 px-4 font-plusJakartaSansMedium">
          {t('app:screen_settings.delete_account_subtitle')}
        </Text>
      </VStack>

      {/* Action Buttons */}
      <VStack className="gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-red-500 py-[18px] rounded-[24px] items-center justify-center flex-row"
          disabled={isDeleting}
          onPress={() => void handleDelete()}
        >
          {isDeleting ? (
            <ActivityIndicator className="mr-2" color="white" />
          ) : null}
          <Text className="text-white text-[15px] font-plusJakartaSansBold">
            {t('app:screen_settings.delete_account_confirm')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-neutral-200 border border-neutral-200 py-[18px] rounded-[24px] items-center justify-center"
          disabled={isDeleting}
          onPress={onClose}
        >
          <Text className="text-neutral-700 text-[15px] font-plusJakartaSansBold">
            {t('app:common_cancel')}
          </Text>
        </TouchableOpacity>
      </VStack>
    </BaseSheetModal>
  );
}
