
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6a07258070344551b22a73b317db9627',
  appName: 'rizzpay-gateway',
  webDir: 'dist',
  server: {
    url: 'https://6a072580-7034-4551-b22a-73b317db9627.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    }
  }
};

export default config;
