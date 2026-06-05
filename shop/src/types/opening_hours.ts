// @type/operating-hours.ts

export interface BackendOperatingHoursItem {
    /** The database ID of the specific day's operating hours record */
    id: number;
    
    /** The integer representation of the day (1 = Monday, 7 = Sunday) */
    day: number;
    
    /** The human-readable string translated by Django (e.g., "Monday") */
    day_display: string;
    
    /** Flag indicating if the business is marked closed on this day */
    is_closed: boolean;
    
    /** Format: "HH:MM AM/PM" (e.g., "09:00 AM") or null if is_closed is true */
    open_time: string | null;
    
    /** Format: "HH:MM AM/PM" (e.g., "06:00 PM") or null if is_closed is true */
    close_time: string | null;
}

export interface LocalScheduleItem {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}