
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
    // Mobile specific optimizations
    backgroundColor: "#ffffff",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    // iOS specific configurations
    contentInset: "always",
    allowsLinkPreview: false,
    scrollEnabled: true,
    useUserAgent: false,
    limitsNavigationsToAppBoundDomains: true
  },
  // General mobile device optimizations
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
    }
  }
};

export default config;
