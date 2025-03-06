# Troubleshooting Guide for Polymarket Filter

If you're experiencing issues with the Polymarket Filter extension, here are some common problems and their solutions:

## Extension Not Working

### Issue: No markets are being filtered even when filters are applied

1. **Check the console for errors**:
   - Open Chrome DevTools by pressing F12 or right-clicking on the page and selecting "Inspect"
   - Go to the "Console" tab
   - Look for any error messages related to "Polymarket Filter"

2. **Verify the extension is running**:
   - Check if the filter indicator appears in the bottom-right corner of the Polymarket website
   - If not, try clicking the extension icon to open the popup and then click "Apply Filters"

3. **Reload the page**:
   - Sometimes the extension needs a page reload to properly initialize
   - After applying filters, try refreshing the page

4. **Check your filter settings**:
   - Make sure the "Enabled" toggle is turned on
   - Verify that you've selected at least one category or added keywords

### Issue: Extension popup doesn't open

1. **Reinstall the extension**:
   - Go to `chrome://extensions/`
   - Remove the Polymarket Filter extension
   - Reload the extension using the "Load unpacked" button

2. **Check for conflicts**:
   - Temporarily disable other extensions that might be interfering

## Specific Filtering Issues

### Issue: Trump markets are not being filtered

1. **Check category selection**:
   - Make sure the "Trump" category checkbox is checked
   - Click "Apply Filters" after checking the box

2. **Try using keywords instead**:
   - Add "trump" as a keyword in the Keywords section
   - Click "Apply Filters"

3. **Enable debug mode**:
   - Open Chrome DevTools (F12)
   - Check the console for debug messages
   - Look for messages about market filtering to see if the Trump category is being detected

### Issue: Filter indicator shows "0 markets filtered" even though filters are applied

1. **Check market content**:
   - The extension filters based on text content in the market cards
   - Make sure the markets you expect to be filtered contain the relevant keywords

2. **Try reloading the page**:
   - Sometimes the filter needs to be reapplied after the page fully loads

3. **Check for DOM changes**:
   - Polymarket may have updated their website structure
   - Check the console for any debug messages about market cards not being found

## Category Configuration Issues

### Issue: Categories are not appearing in the popup

1. **Check if categories.json is loaded**:
   - Open Chrome DevTools (F12)
   - Look for console messages about loading categories configuration
   - If there are errors, the file might be missing or malformed

2. **Verify categories.json format**:
   - Make sure the file follows the correct JSON format
   - Check for syntax errors like missing commas or brackets

3. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Polymarket Filter extension

### Issue: Custom categories are not working

1. **Check keyword matching**:
   - Make sure the keywords in your custom categories match the text in the market cards
   - Try adding more general keywords that are more likely to appear in the text

2. **Verify changes were saved**:
   - After editing categories.json, make sure to reload the extension
   - Check the console for messages confirming the categories were loaded

3. **Try using the keyword filter instead**:
   - If category filtering isn't working, you can use the keyword filter as a workaround

## Advanced Troubleshooting

### Enabling Verbose Logging

For advanced troubleshooting, you can enable verbose logging:

1. Open Chrome DevTools (F12)
2. Go to the "Console" tab
3. Filter console messages by typing "Polymarket Filter" in the filter box
4. Reload the page and apply filters
5. Check the detailed logs to see what's happening

### Manual DOM Inspection

If filters aren't working as expected:

1. Open Chrome DevTools (F12)
2. Go to the "Elements" tab
3. Inspect a market card element
4. Look for the class names and structure
5. Compare with what the extension is looking for (check content.js)

### Debugging Categories Configuration

If you're having issues with the categories configuration:

1. Open Chrome DevTools (F12)
2. Go to the "Application" tab
3. Under "Frames" > "top" > "Extension", look for the categories.json file
4. Verify that the file is being loaded correctly
5. Check the console for any errors related to parsing the file

## Reporting Issues

If you continue to experience problems:

1. Take screenshots of the issue
2. Collect console logs
3. Note the steps to reproduce the problem
4. Open an issue on the GitHub repository with this information

## Contact

For additional help, please open an issue on the GitHub repository or contact the extension author. 