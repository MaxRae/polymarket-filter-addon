#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all necessary files to dist
cp -r manifest.json background.js categories.json content popup assets LICENSE README.md TROUBLESHOOTING.md INSTALLATION.md dist/

# Create a zip file for the extension
cd dist
zip -r ../polymarket-filter.zip *

echo "Extension packaged successfully! The zip file is at polymarket-filter.zip" 