# Polymarket Filter Chrome Extension

A Chrome extension that enhances your experience on [Polymarket](https://polymarket.com) by providing advanced filtering capabilities for prediction markets.

## ⚠️ Deprecation Notice

Good news: Polymarket shipped an upgrade of their website that features a filter!
Bad news: The filter is currently only for sport bets, and has to be activated anew with each session.

I might make the necessary updates to this app, but I have already sent a feature request to the Polymarket team to improve their filter.

## Features

- **Market Filtering**: Filter markets based on custom criteria such as price range, volume, liquidity, and more
- **Keyword Filtering**: Hide or highlight markets containing specific keywords
- **Category Filtering**: Filter markets by categories like Politics, Sports, Crypto, Trump, and more
- **Custom Views**: Save your favorite filter combinations for quick access
- **Market Tracking**: Track specific markets and receive notifications on price changes
- **Dark/Light Mode**: Seamlessly integrates with Polymarket's theme
- **Responsive Design**: Works well on all screen sizes
- **Customizable Categories**: Easily modify the categories and their associated keywords through a simple JSON file

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link to be added once published)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your browser toolbar

## Usage

1. Click on the extension icon while browsing Polymarket
2. Set up your filters in the popup menu:
   - Enter keywords to filter markets (e.g., "Trump", "Bitcoin")
   - Check category boxes to filter by category
   - Set price ranges (e.g., only show markets with prices between 20% and 80%)
   - Configure volume and liquidity thresholds
   - Save your filter configuration for future use
3. Click "Apply Filters" to see only the markets that match your criteria
4. Toggle between different saved filter configurations
5. Look for the filter indicator in the bottom-right corner of the page showing how many markets are filtered

## Customizing Categories

The extension uses a `categories.json` file to define the categories and their associated keywords. You can easily customize this file to add, remove, or modify categories.

### Structure of categories.json

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Category Display Name",
      "keywords": [
        "keyword1",
        "keyword2",
        "keyword3"
      ],
      "excludeKeywords": [
        "exclude1",
        "exclude2"
      ]
    }
  ]
}
```

### How to Customize Categories

1. Open the `categories.json` file in a text editor
2. Modify the existing categories or add new ones
3. Save the file
4. Reload the extension in Chrome (go to `chrome://extensions/` and click the refresh icon on the extension)

### Example: Adding a New Category

To add a new category for filtering markets related to climate change:

```json
{
  "id": "climate",
  "name": "Climate Change",
  "keywords": [
    "climate",
    "global warming",
    "carbon",
    "emissions",
    "temperature"
  ]
}
```

Add this object to the `categories` array in the `categories.json` file.

## Filtering by Category

The extension provides several predefined categories for filtering:

- **Politics**: Markets related to elections, presidents, government, etc.
- **Sports**: Markets related to NFL, NBA, MLB, soccer, etc.
- **Crypto**: Markets related to Bitcoin, Ethereum, blockchain, etc.
- **Trump**: Markets specifically mentioning Trump
- **World Elections**: Markets about elections outside the US
- **Elon Tweets**: Markets related to Elon Musk or Twitter
- **Mentions**: Markets about someone mentioning or saying something
- **Creators**: Markets related to content creators, YouTubers, etc.
- **Pop Culture**: Markets about movies, music, celebrities, etc.
- **Business**: Markets about companies, stocks, economy, etc.

## Troubleshooting

If you encounter issues with the extension, please check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file for common problems and solutions.

Common issues include:
- No markets being filtered even when filters are applied
- Extension popup not opening
- Trump markets not being filtered
- Filter indicator showing "0 markets filtered"

## Development

### Prerequisites
- Node.js and npm

### Setup
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `./build.sh` to build the extension
4. Load the extension in Chrome as described in the Manual Installation section

### Project Structure
```
polymarket-filter/
├── manifest.json        # Extension configuration
├── background.js        # Background script
├── categories.json      # Categories configuration
├── popup/
│   ├── popup.html       # Popup UI
│   ├── popup.js         # Popup functionality
│   └── popup.css        # Popup styling
├── content/
│   ├── content.js       # Content script for Polymarket pages
│   └── content.css      # Content styling
└── assets/
    └── icons/           # Extension icons
```

### Debugging

The extension includes debug logging to help troubleshoot issues:

1. Open Chrome DevTools (F12) while on Polymarket.com
2. Look for console messages prefixed with "[Polymarket Filter]"
3. These messages provide information about what the extension is doing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Polymarket](https://polymarket.com) for their prediction market platform
- All contributors and users of this extension

## Development

This extension was developed using [Cursor](https://cursor.sh/), an AI-first code editor built on VSCode.

## Privacy Policy

This extension does not collect any personal data. It only interacts with the Polymarket website to provide filtering functionality.

