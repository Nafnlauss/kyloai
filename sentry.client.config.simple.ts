// Simplified Sentry configuration without Session Replay
// Use this if you're experiencing issues with multiple Sentry instances

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5ef83c3ca8f00fffb32b5dcb105f3120@o4509529152421888.ingest.us.sentry.io/4509529155305477",
  
  // Adjust this value in production
  tracesSampleRate: 1,
  
  // Debug mode
  debug: false,
  
  // Disable Session Replay to avoid conflicts
  integrations: (integrations) => {
    // Filter out the replay integration
    return integrations.filter((integration) => integration.name !== 'Replay');
  },
});