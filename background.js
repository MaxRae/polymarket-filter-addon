// Background script for Polymarket Filter extension

// Debug mode
const DEBUG = true;

// Debug logging function
function debugLog(...args) {
  if (DEBUG) {
    console.log('[Polymarket Filter Background]', ...args);
  }
}

// Store categories configuration
let categoriesConfig = null;

// Load categories configuration
function loadCategoriesConfig() {
  fetch(chrome.runtime.getURL('categories.json'))
    .then(response => response.json())
    .then(data => {
      categoriesConfig = data;
      debugLog('Loaded categories configuration:', categoriesConfig);
    })
    .catch(error => {
      debugLog('Error loading categories configuration:', error);
    });
}

// Load categories configuration when the extension starts
loadCategoriesConfig();

// Initialize default settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed or updated');
  
  // Set default filter settings
  chrome.storage.sync.set({
    filters: {
      keywords: [],
      categories: [],
      priceRange: {
        min: 0,
        max: 100
      },
      volumeThreshold: 0,
      liquidityThreshold: 0,
      enabled: true
    },
    savedFilters: [],
    trackedMarkets: []
  }, () => {
    debugLog('Default settings initialized');
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Received message:', message);
  
  if (message.action === 'getFilters') {
    // Retrieve current filters and send back
    chrome.storage.sync.get('filters', (data) => {
      debugLog('Sending filters:', data.filters);
      sendResponse(data.filters || {});
    });
    return true; // Required for async response
  }
  
  if (message.action === 'updateFilters') {
    // Update filters with new settings
    debugLog('Updating filters:', message.filters);
    chrome.storage.sync.set({ filters: message.filters }, () => {
      // Notify content script to apply new filters
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('polymarket.com')) {
          debugLog('Sending applyFilters message to tab:', tabs[0].id);
          chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFilters', filters: message.filters })
            .catch(error => {
              debugLog('Error sending message to tab:', error);
            });
        }
      });
      sendResponse({ success: true });
    });
    return true; // Required for async response
  }
  
  if (message.action === 'saveFilterConfig') {
    // Save a new filter configuration
    debugLog('Saving filter configuration:', message.config);
    chrome.storage.sync.get('savedFilters', (data) => {
      const savedFilters = data.savedFilters || [];
      savedFilters.push(message.config);
      chrome.storage.sync.set({ savedFilters }, () => {
        debugLog('Filter configuration saved, total configs:', savedFilters.length);
        sendResponse({ success: true });
      });
    });
    return true; // Required for async response
  }
  
  if (message.action === 'getSavedFilters') {
    // Retrieve saved filter configurations
    chrome.storage.sync.get('savedFilters', (data) => {
      debugLog('Sending saved filters:', data.savedFilters?.length || 0, 'configurations');
      sendResponse(data.savedFilters || []);
    });
    return true; // Required for async response
  }
  
  if (message.action === 'trackMarket') {
    // Add a market to tracked markets
    debugLog('Tracking market:', message.market);
    chrome.storage.sync.get('trackedMarkets', (data) => {
      const trackedMarkets = data.trackedMarkets || [];
      trackedMarkets.push(message.market);
      chrome.storage.sync.set({ trackedMarkets }, () => {
        debugLog('Market tracked, total tracked markets:', trackedMarkets.length);
        sendResponse({ success: true });
      });
    });
    return true; // Required for async response
  }
  
  if (message.action === 'getTrackedMarkets') {
    // Retrieve tracked markets
    chrome.storage.sync.get('trackedMarkets', (data) => {
      debugLog('Sending tracked markets:', data.trackedMarkets?.length || 0, 'markets');
      sendResponse(data.trackedMarkets || []);
    });
    return true; // Required for async response
  }
  
  if (message.action === 'getCategoriesConfig') {
    // Send the categories configuration
    if (categoriesConfig) {
      debugLog('Sending categories configuration');
      sendResponse({ categories: categoriesConfig.categories });
    } else {
      // If the configuration hasn't been loaded yet, load it and then send
      loadCategoriesConfig();
      // Use a timeout to wait for the configuration to load
      setTimeout(() => {
        if (categoriesConfig) {
          debugLog('Sending categories configuration (delayed)');
          sendResponse({ categories: categoriesConfig.categories });
        } else {
          debugLog('Failed to load categories configuration');
          sendResponse({ categories: null });
        }
      }, 500);
    }
    return true; // Required for async response
  }
  
  // If we get here, the message action wasn't recognized
  debugLog('Unknown message action:', message.action);
  return false;
}); 