# Create .js file with src/header.js + src/global/title_text.js + src/main.js + src/global/languages.js

cat src/header.js > "${GITHUB_WORKSPACE}/widget.js"
( cat src/global/title_text.js; cat src/main.js; cat src/global/languages.js ) >> "${GITHUB_WORKSPACE}/widget.js"
