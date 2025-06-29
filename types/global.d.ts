declare global {
  var __sentryReplayIntegration__: any;
  var prisma: any;
  
  interface Window {
    __sentry_initialized__?: boolean;
    [key: string]: any;
  }
}

export {};