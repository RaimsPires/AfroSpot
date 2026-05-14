import { ReactNode } from 'react';

export type NotificationCardProps = {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    time: string;
    description: string;
    image?: string;
    actions?: ReactNode;
    showChevron?: boolean;
    onPress?: () => void;
    colors: any;
};

export type NotificationGroupProps = {
    title: string;
    children: ReactNode;
    colors: any;
};

export type NotificationItem = NotificationCardProps & {
    id: string;
};

export type NotificationGroupItem = {
    title: string;
    items: NotificationItem[];
};
