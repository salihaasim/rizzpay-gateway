
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6a07258070344551b22a73b317db9627',
  appName: 'RizzPay Gateway',
  webDir: 'dist',
  server: {
    url: 'https://rizzpay.co.in?forceHideBadge=true',
    cleartext: true,
    allowNavigation: ['rizzpay.co.in', '*.rizzpay.co.in']
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    },
    // Enhanced mobile optimizations for Android
    backgroundColor: "#ffffff",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    initialFocus: true,
    hideLogs: false,
    overrideUserAgent: false,
    appendUserAgent: "RizzPay-AndroidApp",
    minWebViewVersion: 55
  },
  ios: {
    // Enhanced iOS specific configurations
    contentInset: "always",
    allowsLinkPreview: false,
    scrollEnabled: true,
    useUserAgent: true,
    overrideUserAgent: "RizzPay-iOSApp",
    limitsNavigationsToAppBoundDomains: true,
    cordovaSwiftVersion: "5.0",
    preferredContentMode: "mobile",
    backgroundColor: "#ffffff"
  },
  // Enhanced mobile device optimizations
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#2563eb",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    // Added for better mobile experience
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
      animation: "fade"
    },
    CapacitorHttp: {
      enabled: true
    },
    Device: {
      overrideUserAgent: "RizzPay Mobile App"
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#2563eb"
    }
  }
};

export default config;
