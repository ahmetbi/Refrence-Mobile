// app/index.tsx
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={false}
        hidden={false}
      />
      <View style={styles.header}>
        <Text style={styles.appName}>Refrence Homes</Text>
      </View>
      <WebView
        source={{ uri: 'https://app.referencehomes.com/' }}
        startInLoadingState
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  appName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
