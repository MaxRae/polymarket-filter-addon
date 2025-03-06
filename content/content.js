// Content script for Polymarket Filter extension

// Store current filter settings
let currentFilters = {
  keywords: [],
  categories: [],
  priceRange: {
    min: 0,
    max: 100
  },
  volumeThreshold: 0,
  liquidityThreshold: 0,
  enabled: true
};

// Store categories configuration
let categoriesConfig = [];

// Debug mode
const DEBUG = true;

// Debug logging function
function debugLog(...args) {
  if (DEBUG) {
    console.log('[Polymarket Filter]', ...args);
  }
}

// Load categories configuration
function loadCategoriesConfig() {
  fetch(chrome.runtime.getURL('categories.json'))
    .then(response => response.json())
    .then(data => {
      categoriesConfig = data.categories;
      debugLog('Loaded categories configuration:', categoriesConfig);
    })
    .catch(error => {
      debugLog('Error loading categories configuration:', error);
    });
}

// Load categories configuration when the script starts
loadCategoriesConfig();

// Get initial filter settings
chrome.storage.sync.get('filters', (data) => {
  if (data.filters) {
    currentFilters = data.filters;
    debugLog('Loaded filters from storage:', currentFilters);
    applyFilters();
  }
});

// Listen for filter updates from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'applyFilters') {
    debugLog('Received new filters:', message.filters);
    currentFilters = message.filters;
    applyFilters();
    sendResponse({ success: true });
  } else if (message.action === 'getCategoriesConfig') {
    // Send the categories configuration to the popup
    sendResponse({ categories: categoriesConfig });
  }
  return true;
});

// Function to apply filters to the page
function applyFilters() {
  if (!currentFilters.enabled) {
    debugLog('Filters disabled, restoring all markets');
    restoreAllMarkets();
    return;
  }

  debugLog('Applying filters...');
  
  // Wait for the page to fully load
  setTimeout(() => {
    // Find all market cards on the page - try multiple possible selectors
    const marketCards = document.querySelectorAll('.c-dhzjXW.c-dhzjXW-idNOCmT-css, [data-testid="market-card"], .market-card, [class*="MarketCard"]');
    
    debugLog(`Found ${marketCards.length} market cards`);
    
    if (marketCards.length === 0) {
      // If no market cards found, try again later
      debugLog('No market cards found, trying again in 1 second');
      setTimeout(applyFilters, 1000);
      return;
    }
    
    // Add a filter indicator to the page if it doesn't exist
    addFilterIndicator();
    
    let hiddenCount = 0;
    
    // For debugging, dump the first market card's HTML
    if (marketCards.length > 0 && DEBUG) {
      debugLog('First market card HTML:', marketCards[0].outerHTML);
    }
    
    marketCards.forEach((card, index) => {
      // Check if the market should be filtered out
      const shouldFilter = shouldFilterMarket(card);
      
      if (DEBUG && index < 5) {
        // Log details for the first few cards
        const titleEl = card.querySelector('h3, h4, [class*="Title"], div');
        const title = titleEl ? titleEl.textContent : 'No title found';
        debugLog(`Market #${index}: "${title}" - Should filter: ${shouldFilter}`);
      }
      
      if (shouldFilter) {
        // Hide the market card
        card.style.display = 'none';
        hiddenCount++;
      } else {
        // Show the market card
        card.style.display = '';
      }
    });
    
    debugLog(`Filtered ${hiddenCount} markets`);
    
    // Update the filter indicator with the count of hidden markets
    updateFilterIndicator(hiddenCount);
  }, 500);
}

// Function to determine if a market should be filtered out
function shouldFilterMarket(marketCard) {
  // Extract all text content from the market card for more reliable filtering
  const allText = marketCard.textContent.toLowerCase();
  
  // Get market title and description - try multiple possible selectors
  const titleElement = marketCard.querySelector('h3, h4, [class*="Title"], div');
  
  if (!titleElement) {
    debugLog('No title element found for market card');
    return false;
  }
  
  const title = titleElement.textContent.toLowerCase();
  debugLog('Market title:', title);
  
  // Check categories filter first (most likely to be used)
  if (currentFilters.categories.length > 0) {
    debugLog('Checking categories:', currentFilters.categories);
    
    // For categories, we check if the market title or all text contains any of the category terms
    const matchesCategory = currentFilters.categories.some(categoryId => {
      // Find the category configuration
      const categoryConfig = categoriesConfig.find(cat => cat.id === categoryId);
      
      if (!categoryConfig) {
        debugLog(`Category configuration not found for: ${categoryId}`);
        return false;
      }
      
      debugLog(`Checking category: ${categoryConfig.name} (${categoryId})`);
      
      // Check if any of the category keywords are in the text
      const hasKeyword = categoryConfig.keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        const result = allText.includes(keywordLower) || 
                      new RegExp(`\\b${keywordLower}\\b`, 'i').test(allText);
        
        if (result) {
          debugLog(`Market matches keyword '${keyword}' for category '${categoryConfig.name}'`);
        }
        
        return result;
      });
      
      // Check if any exclude keywords are in the text
      const hasExcludeKeyword = categoryConfig.excludeKeywords ? 
        categoryConfig.excludeKeywords.some(keyword => {
          const keywordLower = keyword.toLowerCase();
          return allText.includes(keywordLower);
        }) : false;
      
      // Match if it has a keyword and doesn't have any exclude keywords
      return hasKeyword && !hasExcludeKeyword;
    });
    
    if (matchesCategory) {
      debugLog('Market filtered due to category match');
      return true;
    }
  }
  
  // Check keywords filter
  if (currentFilters.keywords.length > 0) {
    debugLog('Checking keywords:', currentFilters.keywords);
    
    const matchesKeyword = currentFilters.keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      const result = allText.includes(keywordLower);
      
      if (result) {
        debugLog(`Market matches keyword '${keyword}'`);
      }
      
      return result;
    });
    
    if (matchesKeyword) {
      debugLog('Market filtered due to keyword match');
      return true;
    }
  }
  
  // Check price range filter
  if (currentFilters.priceRange.min > 0 || currentFilters.priceRange.max < 100) {
    debugLog('Checking price range:', currentFilters.priceRange);
    
    // Try to find price in the text using regex
    const priceMatch = allText.match(/\$?(\d+(\.\d+)?)\s*%?/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      debugLog('Found price:', price);
      
      if (price < currentFilters.priceRange.min || price > currentFilters.priceRange.max) {
        debugLog('Market filtered due to price range');
        return true;
      }
    }
  }
  
  // Check volume threshold
  if (currentFilters.volumeThreshold > 0) {
    debugLog('Checking volume threshold:', currentFilters.volumeThreshold);
    
    // Try to find volume in the text using regex
    const volumeMatch = allText.match(/volume\s*\$?(\d+(\.\d+)?[KMB]?)/i);
    if (volumeMatch) {
      let volume = parseFloat(volumeMatch[1].replace(/[KMB]/g, ''));
      // Convert K, M, B to actual numbers
      if (volumeMatch[1].includes('K')) volume *= 1000;
      if (volumeMatch[1].includes('M')) volume *= 1000000;
      if (volumeMatch[1].includes('B')) volume *= 1000000000;
      
      debugLog('Found volume:', volume);
      
      if (volume < currentFilters.volumeThreshold) {
        debugLog('Market filtered due to volume threshold');
        return true;
      }
    }
  }
  
  // Check liquidity threshold
  if (currentFilters.liquidityThreshold > 0) {
    debugLog('Checking liquidity threshold:', currentFilters.liquidityThreshold);
    
    // Try to find liquidity in the text using regex
    const liquidityMatch = allText.match(/liquidity\s*\$?(\d+(\.\d+)?[KMB]?)/i);
    if (liquidityMatch) {
      let liquidity = parseFloat(liquidityMatch[1].replace(/[KMB]/g, ''));
      // Convert K, M, B to actual numbers
      if (liquidityMatch[1].includes('K')) liquidity *= 1000;
      if (liquidityMatch[1].includes('M')) liquidity *= 1000000;
      if (liquidityMatch[1].includes('B')) liquidity *= 1000000000;
      
      debugLog('Found liquidity:', liquidity);
      
      if (liquidity < currentFilters.liquidityThreshold) {
        debugLog('Market filtered due to liquidity threshold');
        return true;
      }
    }
  }
  
  // If none of the filters match, don't filter out this market
  return false;
}

// Function to restore all hidden markets
function restoreAllMarkets() {
  const marketCards = document.querySelectorAll('.c-dhzjXW.c-dhzjXW-idNOCmT-css, [data-testid="market-card"], .market-card, [class*="MarketCard"]');
  debugLog(`Restoring ${marketCards.length} markets`);
  
  marketCards.forEach(card => {
    card.style.display = '';
  });
  
  // Remove the filter indicator
  const indicator = document.querySelector('.polymarket-filter-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Function to add a filter indicator to the page
function addFilterIndicator() {
  // Check if the indicator already exists
  if (document.querySelector('.polymarket-filter-indicator')) {
    return;
  }
  
  debugLog('Adding filter indicator');
  
  const indicator = document.createElement('div');
  indicator.className = 'polymarket-filter-indicator';
  indicator.innerHTML = `
    <span class="polymarket-filter-indicator-icon">🔍</span>
    <span class="polymarket-filter-indicator-text">Filters active</span>
  `;
  
  // Add click event to toggle filters
  indicator.addEventListener('click', () => {
    currentFilters.enabled = !currentFilters.enabled;
    debugLog('Filter toggle clicked, enabled:', currentFilters.enabled);
    
    // Save the updated filters
    chrome.storage.sync.set({ filters: currentFilters }, () => {
      if (currentFilters.enabled) {
        applyFilters();
      } else {
        restoreAllMarkets();
      }
    });
  });
  
  document.body.appendChild(indicator);
}

// Function to update the filter indicator with the count of hidden markets
function updateFilterIndicator(hiddenCount) {
  const indicator = document.querySelector('.polymarket-filter-indicator');
  if (indicator) {
    const textElement = indicator.querySelector('.polymarket-filter-indicator-text');
    if (textElement) {
      textElement.textContent = `${hiddenCount} markets filtered`;
      debugLog('Updated filter indicator:', hiddenCount);
    }
  }
}

// Apply filters when the page content changes (for single-page applications)
const observer = new MutationObserver((mutations) => {
  // Check if relevant elements were added or removed
  const relevantChanges = mutations.some(mutation => {
    return Array.from(mutation.addedNodes).some(node => {
      return node.nodeType === 1 && (
        node.classList && (
          node.classList.contains('c-dhzjXW') || 
          node.classList.contains('market-card') ||
          node.querySelector('.c-dhzjXW') ||
          node.querySelector('[data-testid="market-card"]') ||
          node.querySelector('.market-card') ||
          node.querySelector('[class*="MarketCard"]')
        )
      );
    });
  });
  
  if (relevantChanges) {
    debugLog('Detected DOM changes, reapplying filters');
    applyFilters();
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Initial application of filters
debugLog('Content script loaded, applying initial filters');
setTimeout(applyFilters, 1000); // Delay initial application to ensure page is loaded 