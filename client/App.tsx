import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppContent from './AppContent';
import './src/i18n';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});