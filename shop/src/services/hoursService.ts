// @services/hoursService.ts
import { BackendOperatingHoursItem, LocalScheduleItem } from '@type/opening_hours';
import { convert12to24Hour, DAY_MAP_TO_BACKEND, DAY_MAP_TO_FRONTEND } from '@utils/dateTimeHelpers';
import { apiClient } from './apiClient';



export const hoursService = {
    /** Fetch hours from the backend and translate them into frontend states */
    fetchHours: async (): Promise<LocalScheduleItem[]> => {
        const response = await apiClient.get<BackendOperatingHoursItem[]>('/spots/operating-hours/');

        // Form a blank base matrix template
        const baseSchedule: Record<string, LocalScheduleItem> = {
            Monday: { day: 'Monday', isOpen: false, openTime: '', closeTime: '' },
            Tuesday: { day: 'Tuesday', isOpen: false, openTime: '', closeTime: '' },
            Wednesday: { day: 'Wednesday', isOpen: false, openTime: '', closeTime: '' },
            Thursday: { day: 'Thursday', isOpen: false, openTime: '', closeTime: '' },
            Friday: { day: 'Friday', isOpen: false, openTime: '', closeTime: '' },
            Saturday: { day: 'Saturday', isOpen: false, openTime: '', closeTime: '' },
            Sunday: { day: 'Sunday', isOpen: false, openTime: '', closeTime: '' },
        };

        // Hydrate baseline fields using database attributes
        response.data.forEach((item: any) => {
            const dayName = DAY_MAP_TO_FRONTEND[item.day];
            if (dayName) {
                baseSchedule[dayName] = {
                    day: dayName,
                    isOpen: !item.is_closed,
                    openTime: item.open_time || '',
                    closeTime: item.close_time || '',
                };
            }
        });

        return Object.values(baseSchedule);
    },

    /** Post single or bulk changes to the server */
    saveHours: async (selectedDays: string[], isOpen: boolean, openTime: string, closeTime: string) => {
        const payload = selectedDays.map(dayName => ({
            day: DAY_MAP_TO_BACKEND[dayName],
            is_closed: !isOpen,
            // 🚀 Convert the AM/PM strings to 24-hour strings here!
            open_time: isOpen ? convert12to24Hour(openTime) : null,
            close_time: isOpen ? convert12to24Hour(closeTime) : null,
        }));

        const response = await apiClient.post('/spots/operating-hours/', payload);
        return response.data;
    }
};