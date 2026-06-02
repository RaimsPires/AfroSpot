import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatRoomScreen } from '@screens/chat/ChatRoomScreen';
import { MessageTimelineScreen } from '@screens/chat/MessageTimelineScreen';

const Stack = createNativeStackNavigator();

const MessagesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MessageTimelineHome" component={MessageTimelineScreen} />
        <Stack.Screen name="ChatRoomInTab" component={ChatRoomScreen} />
    </Stack.Navigator>
);

export default MessagesStack