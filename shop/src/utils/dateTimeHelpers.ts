// @utils/dateTimeHelpers.ts

export const DAY_MAP_TO_BACKEND: Record<string, number> = {
    Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7
};

export const DAY_MAP_TO_FRONTEND: Record<number, string> = {
    1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'
};

/** Converts "09:00 AM" to "09:00" and "06:00 PM" to "18:00" */
export const convert12to24Hour = (timeStr: string): string | null => {
    if (!timeStr) return null;
    
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
};