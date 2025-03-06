# Installation Guide for Polymarket Filter

This guide provides detailed instructions for installing the Polymarket Filter Chrome extension.

## Prerequisites

- Google Chrome browser (version 88 or later recommended)
- Developer mode enabled in Chrome extensions

## Installation Steps

### Method 1: Using the packaged ZIP file

1. **Download the extension**:
   - Download the `polymarket-filter.zip` file from the repository

2. **Extract the ZIP file**:
   - Right-click on the ZIP file and select "Extract All..." or use your preferred extraction tool
   - Choose a location to extract the files

3. **Open Chrome Extensions page**:
   - Open Chrome and type `chrome://extensions/` in the address bar
   - Or go to Chrome menu (three dots) > More Tools > Extensions

4. **Enable Developer Mode**:
   - Toggle on "Developer mode" in the top-right corner of the Extensions page

5. **Load the extension**:
   - Click the "Load unpacked" button that appears after enabling Developer mode
   - Navigate to the folder where you extracted the extension files
   - Select the folder and click "Open"

6. **Verify installation**:
   - The Polymarket Filter extension should now appear in your extensions list
   - The extension icon should appear in your Chrome toolbar

### Method 2: From source code

1. **Clone or download the repository**:
   ```
   git clone https://github.com/yourusername/polymarket-filter.git
   ```
   Or download and extract the ZIP file from the repository

2. **Build the extension** (optional):
   - If you have Node.js installed, you can build the extension:
   ```
   cd polymarket-filter
   chmod +x build.sh
   ./build.sh
   ```

3. **Open Chrome Extensions page**:
   - Open Chrome and type `chrome://extensions/` in the address bar
   - Or go to Chrome menu (three dots) > More Tools > Extensions

4. **Enable Developer Mode**:
   - Toggle on "Developer mode" in the top-right corner of the Extensions page

5. **Load the extension**:
   - Click the "Load unpacked" button
   - Navigate to the repository folder (or the `dist` folder if you built the extension)
   - Select the folder and click "Open"

6. **Verify installation**:
   - The Polymarket Filter extension should now appear in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Post-Installation

1. **Pin the extension** (optional):
   - Click the Extensions icon (puzzle piece) in the Chrome toolbar
   - Find Polymarket Filter and click the pin icon to keep it visible in the toolbar

2. **Test the extension**:
   - Go to [Polymarket.com](https://polymarket.com)
   - Click the Polymarket Filter icon in the toolbar
   - Configure your filters and click "Apply Filters"
   - You should see a filter indicator in the bottom-right corner of the page

## Troubleshooting

If you encounter any issues during installation:

1. **Check for errors**:
   - Look for any error messages in the Extensions page
   - Click "Errors" next to the extension if available

2. **Reload the extension**:
   - On the Extensions page, click the refresh icon on the Polymarket Filter card

3. **Check console for errors**:
   - Open Chrome DevTools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Look for any error messages related to the extension

4. **Reinstall the extension**:
   - Remove the extension by clicking "Remove" on the Extensions page
   - Follow the installation steps again

For more detailed troubleshooting, refer to the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

## Updating the Extension

When new versions of the extension are released:

1. **Download the latest version**
2. **Remove the existing extension** from Chrome
3. **Install the new version** following the steps above

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find Polymarket Filter
3. Click "Remove" and confirm 