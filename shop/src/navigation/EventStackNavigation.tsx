import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateEventScreen } from '@screens/event/CreateEventScreen';
import { EventDetailScreen } from '@screens/event/EventDetailScreen';
import { EventStatsScreen } from '@screens/event/EventStatsScreen';
import { OrganizerEventListScreen } from '@screens/event/OrganizerEventListScreen';
import { TicketScannerScreen } from '@screens/event/TicketScannerScreen';
import { VendorBookingScreen } from '@screens/event/VendorBookingScreen';
import { EventsDiscoveryScreen } from '@screens/event/client/EventsDiscoveryScreen';
import { MyTicketsScreen } from '@screens/event/client/MyTicketsScreen';
import { TicketSelectionScreen } from '@screens/event/client/TicketSelectionScreen';
import React from 'react';
import { EventStackParamList } from './types';

const Stack = createNativeStackNavigator<EventStackParamList>();

const EventStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="OrganizerEventList">
            <Stack.Screen name="OrganizerEventList" component={OrganizerEventListScreen} />
            <Stack.Screen name="EventsDiscovery" component={EventsDiscoveryScreen} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="EventStats" component={EventStatsScreen} />
            <Stack.Screen name="VendorBooking" component={VendorBookingScreen} />
            <Stack.Screen name="TicketSelection" component={TicketSelectionScreen} />
            <Stack.Screen name="TicketScanner" component={TicketScannerScreen} />
            <Stack.Screen name="MyTickets" component={MyTicketsScreen} />

        </Stack.Navigator>
    )
}

export default EventStackNavigation