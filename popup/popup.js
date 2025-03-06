// Popup script for Polymarket Filter extension

// Debug mode
const DEBUG = true;

// Debug logging function
function debugLog(...args) {
  if (DEBUG) {
    console.log('[Polymarket Filter Popup]', ...args);
  }
}

// DOM Elements
const filterToggle = document.getElementById('filter-toggle');
const keywordInput = document.getElementById('keyword-input');
const addKeywordBtn = document.getElementById('add-keyword');
const keywordsContainer = document.getElementById('keywords-container');
const categoriesGrid = document.querySelector('.categories-grid');
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
const priceRangeMin = document.getElementById('price-range-min');
const priceRangeMax = document.getElementById('price-range-max');
const volumeThreshold = document.getElementById('volume-threshold');
const liquidityThreshold = document.getElementById('liquidity-threshold');
const saveConfigBtn = document.getElementById('save-config');
const applyFiltersBtn = document.getElementById('apply-filters');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const savedFiltersList = document.getElementById('saved-filters-list');
const noSavedFilters = document.getElementById('no-saved-filters');
const trackedMarketsList = document.getElementById('tracked-markets-list');
const noTrackedMarkets = document.getElementById('no-tracked-markets');

// Current filters state
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

// Categories configuration
let categoriesConfig = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  debugLog('Popup initialized');
  
  // Load categories configuration
  loadCategoriesConfig();
  
  // Load current filters
  chrome.storage.sync.get('filters', (data) => {
    if (data.filters) {
      debugLog('Loaded filters from storage:', data.filters);
      currentFilters = data.filters;
      updateUI();
    } else {
      debugLog('No filters found in storage, using defaults');
    }
  });
  
  // Load saved filters
  loadSavedFilters();
  
  // Load tracked markets
  loadTrackedMarkets();
  
  // Set up event listeners
  setupEventListeners();
});

// Load categories configuration
function loadCategoriesConfig() {
  chrome.runtime.sendMessage({ action: 'getCategoriesConfig' }, (response) => {
    if (response && response.categories) {
      categoriesConfig = response.categories;
      debugLog('Loaded categories configuration:', categoriesConfig);
      
      // Generate category checkboxes
      generateCategoryCheckboxes();
      
      // Update UI with current filters
      updateUI();
    } else {
      debugLog('Failed to load categories configuration');
      
      // Fallback: Load categories from file directly
      fetch(chrome.runtime.getURL('categories.json'))
        .then(response => response.json())
        .then(data => {
          categoriesConfig = data.categories;
          debugLog('Loaded categories configuration from file:', categoriesConfig);
          
          // Generate category checkboxes
          generateCategoryCheckboxes();
          
          // Update UI with current filters
          updateUI();
        })
        .catch(error => {
          debugLog('Error loading categories configuration:', error);
        });
    }
  });
}

// Generate category checkboxes based on configuration
function generateCategoryCheckboxes() {
  // Clear existing checkboxes
  categoriesGrid.innerHTML = '';
  
  // Add checkboxes for each category
  categoriesConfig.forEach(category => {
    const label = document.createElement('label');
    label.className = 'category-checkbox';
    
    label.innerHTML = `
      <input type="checkbox" value="${category.id}">
      <span>${category.name}</span>
    `;
    
    categoriesGrid.appendChild(label);
  });
  
  // Update event listeners for the new checkboxes
  document.querySelectorAll('.category-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateCategories();
      // Apply filters immediately when a category is checked/unchecked
      saveFilters();
    });
  });
}

// Update UI based on current filters
function updateUI() {
  debugLog('Updating UI with current filters');
  
  // Update toggle
  filterToggle.checked = currentFilters.enabled;
  
  // Update keywords
  keywordsContainer.innerHTML = '';
  currentFilters.keywords.forEach(keyword => {
    addKeywordTag(keyword);
  });
  
  // Update categories
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox input');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.checked = currentFilters.categories.includes(checkbox.value);
    debugLog(`Category ${checkbox.value} is ${checkbox.checked ? 'checked' : 'unchecked'}`);
  });
  
  // Update price range
  priceMin.value = currentFilters.priceRange.min;
  priceMax.value = currentFilters.priceRange.max;
  priceRangeMin.value = currentFilters.priceRange.min;
  priceRangeMax.value = currentFilters.priceRange.max;
  
  // Update thresholds
  volumeThreshold.value = currentFilters.volumeThreshold;
  liquidityThreshold.value = currentFilters.liquidityThreshold;
}

// Set up event listeners
function setupEventListeners() {
  debugLog('Setting up event listeners');
  
  // Toggle filter
  filterToggle.addEventListener('change', () => {
    currentFilters.enabled = filterToggle.checked;
    debugLog(`Filter toggle changed to ${currentFilters.enabled}`);
    saveFilters();
  });
  
  // Add keyword
  addKeywordBtn.addEventListener('click', () => {
    addKeyword();
  });
  
  keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  });
  
  // Price range inputs
  priceMin.addEventListener('input', () => {
    const value = parseInt(priceMin.value) || 0;
    priceRangeMin.value = value;
    currentFilters.priceRange.min = value;
  });
  
  priceMax.addEventListener('input', () => {
    const value = parseInt(priceMax.value) || 100;
    priceRangeMax.value = value;
    currentFilters.priceRange.max = value;
  });
  
  priceRangeMin.addEventListener('input', () => {
    const value = parseInt(priceRangeMin.value);
    priceMin.value = value;
    currentFilters.priceRange.min = value;
  });
  
  priceRangeMax.addEventListener('input', () => {
    const value = parseInt(priceRangeMax.value);
    priceMax.value = value;
    currentFilters.priceRange.max = value;
  });
  
  // Threshold inputs
  volumeThreshold.addEventListener('input', () => {
    currentFilters.volumeThreshold = parseInt(volumeThreshold.value) || 0;
  });
  
  liquidityThreshold.addEventListener('input', () => {
    currentFilters.liquidityThreshold = parseInt(liquidityThreshold.value) || 0;
  });
  
  // Save configuration
  saveConfigBtn.addEventListener('click', () => {
    saveFilterConfiguration();
  });
  
  // Apply filters
  applyFiltersBtn.addEventListener('click', () => {
    saveFilters();
  });
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

// Add a keyword to the filters
function addKeyword() {
  const keyword = keywordInput.value.trim();
  if (keyword && !currentFilters.keywords.includes(keyword)) {
    debugLog(`Adding keyword: ${keyword}`);
    currentFilters.keywords.push(keyword);
    addKeywordTag(keyword);
    keywordInput.value = '';
    saveFilters();
  }
}

// Add a keyword tag to the UI
function addKeywordTag(keyword) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.innerHTML = `
    ${keyword}
    <span class="tag-remove" data-keyword="${keyword}">×</span>
  `;
  
  tag.querySelector('.tag-remove').addEventListener('click', (e) => {
    const keywordToRemove = e.target.getAttribute('data-keyword');
    removeKeyword(keywordToRemove);
  });
  
  keywordsContainer.appendChild(tag);
}

// Remove a keyword from the filters
function removeKeyword(keyword) {
  debugLog(`Removing keyword: ${keyword}`);
  currentFilters.keywords = currentFilters.keywords.filter(k => k !== keyword);
  updateUI();
  saveFilters();
}

// Update categories based on checkboxes
function updateCategories() {
  const previousCategories = [...currentFilters.categories];
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox input');
  
  currentFilters.categories = Array.from(categoryCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  debugLog('Categories updated:', currentFilters.categories);
  
  // Log changes for debugging
  const added = currentFilters.categories.filter(cat => !previousCategories.includes(cat));
  const removed = previousCategories.filter(cat => !currentFilters.categories.includes(cat));
  
  if (added.length > 0) {
    debugLog('Categories added:', added);
  }
  
  if (removed.length > 0) {
    debugLog('Categories removed:', removed);
  }
}

// Save filters to storage and apply to active tab
function saveFilters() {
  debugLog('Saving filters to storage:', currentFilters);
  
  chrome.storage.sync.set({ filters: currentFilters }, () => {
    // Notify content script to apply filters
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('polymarket.com')) {
        debugLog('Sending filters to content script');
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'applyFilters', 
          filters: currentFilters 
        }, (response) => {
          if (chrome.runtime.lastError) {
            debugLog('Error sending message to content script:', chrome.runtime.lastError);
          } else if (response) {
            debugLog('Content script response:', response);
          }
        });
      } else {
        debugLog('Not on Polymarket.com, not sending filters to content script');
      }
    });
  });
}

// Save current filter configuration
function saveFilterConfiguration() {
  const configName = prompt('Enter a name for this filter configuration:');
  if (!configName) return;
  
  debugLog(`Saving filter configuration: ${configName}`);
  
  const config = {
    name: configName,
    filters: { ...currentFilters },
    createdAt: new Date().toISOString()
  };
  
  chrome.runtime.sendMessage({ 
    action: 'saveFilterConfig', 
    config 
  }, (response) => {
    if (response && response.success) {
      debugLog('Filter configuration saved successfully');
      loadSavedFilters();
      switchTab('saved');
    } else {
      debugLog('Error saving filter configuration');
    }
  });
}

// Load saved filter configurations
function loadSavedFilters() {
  chrome.runtime.sendMessage({ action: 'getSavedFilters' }, (savedFilters) => {
    debugLog('Loaded saved filters:', savedFilters);
    
    if (!savedFilters || savedFilters.length === 0) {
      noSavedFilters.style.display = 'block';
      savedFiltersList.innerHTML = '';
      return;
    }
    
    noSavedFilters.style.display = 'none';
    savedFiltersList.innerHTML = '';
    
    savedFilters.forEach((config, index) => {
      const li = document.createElement('li');
      li.className = 'saved-filter-item';
      
      const date = new Date(config.createdAt);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      li.innerHTML = `
        <div>
          <strong>${config.name}</strong>
          <div class="filter-details">
            <small>${formattedDate}</small>
            <small>${config.filters.keywords.length} keywords, ${config.filters.categories.length} categories</small>
          </div>
        </div>
        <div class="saved-filter-actions">
          <button class="action-btn apply" data-index="${index}">Apply</button>
          <button class="action-btn delete" data-index="${index}">Delete</button>
        </div>
      `;
      
      savedFiltersList.appendChild(li);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.saved-filter-actions .apply').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        applySavedFilter(index);
      });
    });
    
    document.querySelectorAll('.saved-filter-actions .delete').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        deleteSavedFilter(index);
      });
    });
  });
}

// Apply a saved filter configuration
function applySavedFilter(index) {
  chrome.runtime.sendMessage({ action: 'getSavedFilters' }, (savedFilters) => {
    if (savedFilters && index >= 0 && index < savedFilters.length) {
      debugLog(`Applying saved filter: ${savedFilters[index].name}`);
      currentFilters = { ...savedFilters[index].filters };
      updateUI();
      saveFilters();
      switchTab('filters');
    }
  });
}

// Delete a saved filter configuration
function deleteSavedFilter(index) {
  chrome.runtime.sendMessage({ action: 'getSavedFilters' }, (savedFilters) => {
    if (savedFilters && index >= 0 && index < savedFilters.length) {
      debugLog(`Deleting saved filter: ${savedFilters[index].name}`);
      savedFilters.splice(index, 1);
      chrome.storage.sync.set({ savedFilters }, () => {
        loadSavedFilters();
      });
    }
  });
}

// Load tracked markets
function loadTrackedMarkets() {
  chrome.runtime.sendMessage({ action: 'getTrackedMarkets' }, (trackedMarkets) => {
    debugLog('Loaded tracked markets:', trackedMarkets);
    
    if (!trackedMarkets || trackedMarkets.length === 0) {
      noTrackedMarkets.style.display = 'block';
      trackedMarketsList.innerHTML = '';
      return;
    }
    
    noTrackedMarkets.style.display = 'none';
    trackedMarketsList.innerHTML = '';
    
    trackedMarkets.forEach((market, index) => {
      const li = document.createElement('li');
      li.className = 'tracked-market-item';
      
      const date = new Date(market.trackedAt);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      li.innerHTML = `
        <div>
          <strong>${market.title}</strong>
          <div class="market-details">
            <small>Price: ${market.price}</small>
            <small>Tracked: ${formattedDate}</small>
          </div>
        </div>
        <div class="tracked-market-actions">
          <button class="action-btn view" data-url="${market.url}">View</button>
          <button class="action-btn delete" data-index="${index}">Delete</button>
        </div>
      `;
      
      trackedMarketsList.appendChild(li);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.tracked-market-actions .view').forEach(button => {
      button.addEventListener('click', (e) => {
        const url = e.target.getAttribute('data-url');
        chrome.tabs.create({ url });
      });
    });
    
    document.querySelectorAll('.tracked-market-actions .delete').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        deleteTrackedMarket(index);
      });
    });
  });
}

// Delete a tracked market
function deleteTrackedMarket(index) {
  chrome.runtime.sendMessage({ action: 'getTrackedMarkets' }, (trackedMarkets) => {
    if (trackedMarkets && index >= 0 && index < trackedMarkets.length) {
      debugLog(`Deleting tracked market: ${trackedMarkets[index].title}`);
      trackedMarkets.splice(index, 1);
      chrome.storage.sync.set({ trackedMarkets }, () => {
        loadTrackedMarkets();
      });
    }
  });
}

// Switch between tabs
function switchTab(tabName) {
  debugLog(`Switching to tab: ${tabName}`);
  
  tabButtons.forEach(button => {
    if (button.getAttribute('data-tab') === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  tabContents.forEach(content => {
    if (content.id === `${tabName}-tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
} 