// app/index.tsx
import { View, StyleSheet, StatusBar } from 'react-native';
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
      <WebView
        source={{ uri: 'https://app.referencehomes.com/' }}
        startInLoadingState
        style={{ flex: 1 }}
        scalesPageToFit={false}
        bounces={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        injectedJavaScript={`
          (function() {
            // Zoom'u devre dışı bırak
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Touch olaylarını engelle
            document.addEventListener('touchstart', function(e) {
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }, { passive: false });
            
            document.addEventListener('gesturestart', function(e) {
              e.preventDefault();
            }, { passive: false });
            
            document.addEventListener('gesturechange', function(e) {
              e.preventDefault();
            }, { passive: false });
            
            document.addEventListener('gestureend', function(e) {
              e.preventDefault();
            }, { passive: false });
          })();
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
