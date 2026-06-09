import i18n from '@/translations';

/**
 * Compact relative time for activity feeds.
 */
export function formatFriendlyDistance(
  distance: null | number | undefined,
): string {
  if (distance === undefined || distance === null) {
    return i18n.t('app:relative_time.here_now');
  }
  if (distance < 20) {
    return i18n.t('app:relative_time.right_here');
  }
  if (distance < 100) {
    return i18n.t('app:relative_time.steps_away');
  }
  if (distance < 1000) {
    return i18n.t('app:relative_time.meters_away', {
      count: Math.round(distance),
    });
  }
  return i18n.t('app:relative_time.kilometers_away', {
    count: Number((distance / 1000).toFixed(1)),
  });
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return '';
  }

  const diffMs = Date.now() - then;
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) {
    return i18n.t('app:relative_time.just_now');
  }
  if (diffMins < 60) {
    return i18n.t('app:relative_time.minutes_ago', { count: diffMins });
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return i18n.t('app:relative_time.hours_ago', { count: diffHours });
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return i18n.t('app:relative_time.days_ago', { count: diffDays });
  }

  return new Date(iso).toLocaleDateString();
}
