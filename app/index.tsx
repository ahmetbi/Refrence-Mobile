// app/index.tsx
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState('https://app.referencehomes.com/');

  // Yasaklı URL'ler
  const blockedUrls = [
    'https://app.referencehomes.com/plan',
    'https://app.referencehomes.com/register'
  ];

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url;
    setCurrentUrl(url);
    
    // Yasaklı URL kontrolü
    const isBlocked = blockedUrls.some(blockedUrl => 
      url.includes(blockedUrl) || url.includes('/plan') || url.includes('/register')
    );
    
    if (isBlocked) {
      Alert.alert(
        'Erişim Engellendi',
        'Bu sayfa mobil uygulamada kullanılamaz.',
        [
          { 
            text: 'Ana Sayfaya Dön', 
            onPress: () => {
              // Ana sayfaya yönlendir
              setCurrentUrl('https://app.referencehomes.com/');
            }
          }
        ]
      );
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={false}
        hidden={false}
      />
      <WebView
        source={{ uri: currentUrl }}
        startInLoadingState
        style={{ flex: 1 }}
        scalesPageToFit={false}
        bounces={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        onNavigationStateChange={handleNavigationStateChange}
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
            
            // Satın alma ve kayıt linklerini engelle
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target !== document) {
                if (target.tagName === 'A' || target.tagName === 'BUTTON') {
                  var href = target.href || target.getAttribute('data-href') || '';
                  var text = target.textContent || target.innerText || '';
                  
                  if (href.includes('/plan') || 
                      href.includes('/register') || 
                      href.includes('/payment') ||
                      href.includes('/checkout') ||
                      href.includes('/buy') ||
                      href.includes('/purchase') ||
                      text.toLowerCase().includes('satın al') ||
                      text.toLowerCase().includes('buy') ||
                      text.toLowerCase().includes('purchase') ||
                      text.toLowerCase().includes('register') ||
                      text.toLowerCase().includes('kayıt ol') ||
                      text.toLowerCase().includes('ödeme') ||
                      text.toLowerCase().includes('payment')) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('Bu işlem mobil uygulamada kullanılamaz. Sadece bilgi görüntüleme amaçlıdır.');
                    return false;
                  }
                }
                target = target.parentElement;
              }
            }, true);
            
            // Form gönderimlerini engelle
            document.addEventListener('submit', function(e) {
              var form = e.target;
              var action = form.action || '';
              var method = form.method || 'get';
              
              if (action.includes('/register') || 
                  action.includes('/plan') || 
                  action.includes('/payment') ||
                  action.includes('/checkout')) {
                e.preventDefault();
                alert('Form gönderimi mobil uygulamada kullanılamaz.');
                return false;
              }
            }, true);
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
