// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Use a more robust check for preventing multiple initializations
const SENTRY_INITIALIZED_KEY = '__sentry_initialized__';

if (typeof window !== 'undefined' && !window[SENTRY_INITIALIZED_KEY]) {
  try {
    Sentry.init({
      dsn: "https://5ef83c3ca8f00fffb32b5dcb105f3120@o4509529152421888.ingest.us.sentry.io/4509529155305477",

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Replay configuration
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,

      // You can remove this option if you're not planning to use the Sentry Session Replay feature:
      integrations: [
        Sentry.replayIntegration({
          // Additional Replay configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Prevent initialization in development hot reload
      beforeSend(event, hint) {
        // Check if we're in development and this is a hot reload
        if (process.env.NODE_ENV === 'development' && window[SENTRY_INITIALIZED_KEY]) {
          return null; // Don't send the event
        }
        return event;
      },
    });
    
    // Mark as initialized
    window[SENTRY_INITIALIZED_KEY] = true;
  } catch (error) {
    console.warn('Sentry initialization error:', error);
  }
}