// app/index.tsx
import { View, StyleSheet, StatusBar, Alert, Platform, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
        hidden={false}
      />
                          <WebView
        source={{ uri: currentUrl }}
        startInLoadingState
        style={{ flex: 1, marginTop: 0 }}
        // iOS WebView bounce tamamen kapat
        bounces={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        // WebView scroll davranışını kontrol et
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        // iOS WebView için ek kontroller
        {...(Platform.OS === 'ios' && {
          allowsBackForwardNavigationGestures: false,
        })}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onMessage={handleMessage}
        // Media ayarları
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Link ve navigasyon
        allowsLinkPreview={false}
        allowsBackForwardNavigationGestures={false}
        // Scroll optimizasyonu
        overScrollMode="never"
        decelerationRate="normal"
        // Pull-to-refresh kapalı
        pullToRefreshEnabled={false}
        // Scroll performansı
        keyboardDisplayRequiresUserAction={false}
        suppressesIncrementalRendering={false}
        injectedJavaScript={`
          (function() {
            // WebView için özel bounce engelleme
            if (window.webkit && window.webkit.messageHandlers) {
              // iOS WebView içindeyiz
              Object.defineProperty(document.body.style, 'overflow', {
                value: 'hidden',
                writable: false
              });
            }
            
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
            
                         // SafeAreaView kullanıyoruz - CSS padding'e gerek yok
             var style = document.createElement('style');
             style.textContent = \`
               body { 
                 /* Status bar opaque olduğu için padding yok */
                 padding-top: 0px !important; 
                 margin: 0 !important;
                 -webkit-overflow-scrolling: touch;
                 -webkit-user-select: none;
                 -webkit-touch-callout: none;
                 -webkit-tap-highlight-color: transparent;
                 touch-action: manipulation;
                 /* iOS rubber band kontrol */
                 overscroll-behavior: none !important;
                 overscroll-behavior-y: none !important;
                 overscroll-behavior-x: none !important;
                 /* Yanlardan padding yok */
                 padding-left: 0px !important;
                 padding-right: 0px !important;
                 padding-bottom: 0px !important;
               }
                               /* Sadece zoom için gerekli olan elementlere touch-action uygula */
                img, video, canvas {
                  touch-action: none;
                }
                input, textarea, button, a, [role="button"], [tabindex] {
                  touch-action: auto;
                  -webkit-user-select: text;
                }
               /* Web sitesi header'ı normal */
               .header, header, nav, .navbar, .top-bar, .topbar, .navigation { 
                 /* Normal header - padding yok */
                 margin-top: 0px !important;
                 padding-top: 0px !important; 
                 position: relative;
                 z-index: 1000;
               }
               /* Ana içerik alanları normal */
               .main-content, .content, .container, main, #main, #content, #app {
                 /* Normal padding */
                 padding-top: 0px !important;
               }
                               /* WebView için bounce engelleme */
                html, body {
                  overflow-x: hidden;
                  /* iOS bounce engelleme - WebView özel */
                  overscroll-behavior: none !important;
                  overscroll-behavior-y: none !important;  
                  overscroll-behavior-x: none !important;
                  /* WebView için smooth scroll kapalı */
                  -webkit-overflow-scrolling: auto;
                  /* Touch action kontrolü */
                  touch-action: pan-y pinch-zoom;
                  /* Zoom engelleme */
                  -webkit-user-zoom: none;
                  -moz-user-zoom: none;
                  -ms-user-zoom: none;
                  user-zoom: none;
                  -webkit-touch-callout: none;
                  /* iOS text size */
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  text-size-adjust: 100%;
                  /* Safe area */
                  min-height: 100vh;
                  min-height: -webkit-fill-available;
                }
                /* iOS için ek güvenlik - normal padding */
                @supports (padding: max(0px)) {
                  body {
                    padding-top: 0px !important;
                  }
                }
                                 /* Android için minimal zoom engelleme */
                 img, video, canvas {
                   touch-action: none !important;
                 }
             \`;
             document.head.appendChild(style);
            
                         // Zoom engelleme ve bounce sıfırlama
             var startY = 0;
             document.addEventListener('touchstart', function(e) {
               startY = e.touches[0].pageY;
               // Pinch zoom engelle
               if (e.touches.length > 1) {
                 e.preventDefault();
                 return false;
               }
             }, { passive: false });
             
             document.addEventListener('touchmove', function(e) {
               // Sadece pinch zoom engelle - scroll'a hiç müdahale etme
               if (e.touches.length > 1) {
                 e.preventDefault();
                 return false;
               }
             }, { passive: false });
             
             document.addEventListener('touchend', function(e) {
               // Sadece pinch zoom engelle
               if (e.touches.length > 1) {
                 e.preventDefault();
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // SafeAreaView otomatik status bar padding'i ekler
  },
});

