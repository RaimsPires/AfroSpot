import { addDays, format, formatDistanceToNow, isPast, isToday, isValid, Locale, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import i18next from 'i18next';

const localeMap: Record<string, Locale> = { en: enUS, fr: fr };

class DateFormatter {
    // 1. Backend Submission
    static toBackend(date: Date | string | null): string | null {
        if (!date) return null;
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateObj) ? format(dateObj, 'yyyy-MM-dd') : null;
    }

    // 2. Localized UI Display
    static toDisplay(date: Date | string | null, pattern: string = 'PP'): string {
        if (!date) return '';
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Invalid Date';

        const lang = i18next.language || 'en';
        const locale = localeMap[lang] || enUS;

        return format(dateObj, pattern, { locale });
    }

    // 3. Relative Time (e.g., "in 3 days", "2 hours ago")
    static toRelative(date: Date | string | null): string {
        if (!date) return '';
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return '';

        const lang = i18next.language || 'en';
        const locale = localeMap[lang] || enUS;

        return formatDistanceToNow(dateObj, { addSuffix: true, locale });
    }

    // 4. Scheduling Helpers
    static isExpired(date: Date | string | null): boolean {
        if (!date) return false;
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateObj) ? isPast(dateObj) : false;
    }

    static getFutureDate(days: number): Date {
        return addDays(new Date(), days);
    }

    static isToday(date: Date | string | null): boolean {
        if (!date) return false;
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateObj) ? isToday(dateObj) : false;
    }
}

export default DateFormatter;