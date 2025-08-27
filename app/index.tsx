// app/index.tsx
import { View, StyleSheet, StatusBar, Alert, Platform } from 'react-native';
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
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    const url = request.url;
    
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
      return false; // URL yüklemesini engelle
    }
    
    return true; // URL yüklemesine izin ver
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'showAlert') {
        Alert.alert(
          'Uyarı',
          data.message,
          [{ text: 'Tamam', style: 'default' }]
        );
      }
    } catch (error) {
      // JSON parse hatası - mesajı görmezden gel
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
        hidden={false}
      />
             <WebView
         source={{ uri: currentUrl }}
         startInLoadingState
                   style={{ flex: 1, marginTop: 0 }}
          bounces={false}
         scrollEnabled={true}
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         automaticallyAdjustContentInsets={true}
         contentInsetAdjustmentBehavior="automatic"
         // iOS status bar için güvenli alan
                   contentInset={{ top: Platform.OS === 'ios' ? 0 : 0, bottom: 0, left: 0, right: 0 }}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onMessage={handleMessage}
          // iOS zoom özelliğini kapatmak için ek ayarlar
         allowsInlineMediaPlayback={true}
         mediaPlaybackRequiresUserAction={false}
         // Zoom'u engellemek için ek özellikler
         allowsLinkPreview={false}
         allowsBackForwardNavigationGestures={false}
         // Android için ek zoom engelleme
         overScrollMode="never"
        injectedJavaScript={`
          (function() {
            // Zoom'u devre dışı bırak - iOS için geliştirilmiş
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Mevcut viewport meta tag'ini güncelle
            var existingMeta = document.querySelector('meta[name="viewport"]');
            if (existingMeta) {
              existingMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');
            }
            
                         // Status bar için padding ekle (iOS özel)
             var style = document.createElement('style');
             style.textContent = \`
               body { 
                 padding-top: env(safe-area-inset-top) !important; 
                 margin: 0 !important;
                 -webkit-overflow-scrolling: touch;
                 -webkit-user-select: none;
                 -webkit-touch-callout: none;
                 -webkit-tap-highlight-color: transparent;
                 touch-action: manipulation;
                 /* iOS status bar için ek güvenlik */
                 padding-left: env(safe-area-inset-left) !important;
                 padding-right: env(safe-area-inset-right) !important;
                 padding-bottom: env(safe-area-inset-bottom) !important;
               }
                               /* Sadece zoom için gerekli olan elementlere touch-action uygula */
                img, video, canvas {
                  touch-action: none;
                }
                input, textarea, button, a, [role="button"], [tabindex] {
                  touch-action: auto;
                  -webkit-user-select: text;
                }
               /* Header ve navigation için güvenli alan */
               .header, header, nav, .navbar, .top-bar, .topbar, .navigation { 
                 padding-top: calc(env(safe-area-inset-top) + 20px) !important; 
                 position: relative;
                 z-index: 1000;
                 /* iOS status bar ile çakışmayı önle */
                 margin-top: 0 !important;
               }
               .main-content {
                 padding-top: env(safe-area-inset-top) !important;
               }
                               /* Zoom'u engellemek için ek CSS */
                html, body {
                  overflow-x: hidden;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  text-size-adjust: 100%;
                  /* iOS safe area desteği */
                  min-height: 100vh;
                  min-height: -webkit-fill-available;
                  /* %100 zoom engelleme */
                  -webkit-user-zoom: none;
                  -moz-user-zoom: none;
                  -ms-user-zoom: none;
                  user-zoom: none;
                                     /* Sadece zoom engelleme */
                   -webkit-touch-callout: none;
                }
                /* iOS için ek güvenlik */
                @supports (padding: max(0px)) {
                  body {
                    padding-top: max(env(safe-area-inset-top), 20px) !important;
                  }
                }
                                 /* Android için minimal zoom engelleme */
                 img, video, canvas {
                   touch-action: none !important;
                 }
             \`;
             document.head.appendChild(style);
            
                         // Touch olaylarını engelle - %100 zoom engelleme
             document.addEventListener('touchstart', function(e) {
               // Çoklu dokunma engelle
               if (e.touches.length > 1) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
               // Pinch zoom engelle
               if (e.touches.length === 2) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
             }, { passive: false });
             
             document.addEventListener('touchmove', function(e) {
               // Çoklu dokunma engelle
               if (e.touches.length > 1) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
               // Pinch zoom engelle
               if (e.touches.length === 2) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
             }, { passive: false });
             
             document.addEventListener('touchend', function(e) {
               // Çoklu dokunma engelle
               if (e.touches.length > 1) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
               // Pinch zoom engelle
               if (e.touches.length === 2) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
             }, { passive: false });
            
                         // Gesture olaylarını engelle - %100 zoom engelleme
             document.addEventListener('gesturestart', function(e) {
               e.preventDefault();
               e.stopPropagation();
               return false;
             }, { passive: false });
             
             document.addEventListener('gesturechange', function(e) {
               e.preventDefault();
               e.stopPropagation();
               return false;
             }, { passive: false });
             
             document.addEventListener('gestureend', function(e) {
               e.preventDefault();
               e.stopPropagation();
               return false;
             }, { passive: false });
             
                           // Android özel zoom engelleme
             document.addEventListener('touchstart', function(e) {
               if (e.touches.length >= 2) {
                 e.preventDefault();
                 e.stopPropagation();
                 return false;
               }
             }, { passive: false });
            
            // Wheel olaylarını da engelle (fare ile zoom)
            document.addEventListener('wheel', function(e) {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
              }
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
                     // Native alert kullan
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'showAlert',
                       message: 'Bu işlem mobil uygulamada kullanılamaz. Sadece bilgi görüntüleme amaçlıdır.'
                     }));
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
                 // Native alert kullan
                 window.ReactNativeWebView.postMessage(JSON.stringify({
                   type: 'showAlert',
                   message: 'Form gönderimi mobil uygulamada kullanılamaz.'
                 }));
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
    backgroundColor: '#ffffff',
    // iOS için safe area desteği
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    // iOS status bar için ek güvenlik
    ...(Platform.OS === 'ios' && {
      paddingTop: 0,
      marginTop: 0,
    }),
  },
});
