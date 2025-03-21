// src/utils/processPolyfill.ts
/**
 * This polyfill adds a process object to the window when it doesn't exist
 * This prevents "Can't find variable: process" errors in browser environments
 */

// Only add the polyfill if process doesn't exist
if (typeof window !== 'undefined' && !window.process) {
    // Create a minimal process object with env property
    (window as any).process = {
      env: {
        // Add your environment variables here
        NODE_ENV: 'development',
        REACT_APP_AI_HISTORY_KEY: '', 
      }
    };
    
    console.debug('Process polyfill added to window');
  }
  
  // Export an empty object just to make this a valid module
  export {};