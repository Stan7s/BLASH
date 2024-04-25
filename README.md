# An LLM-based Writing Assistant for Peer-to-Peer Mental Health Support in Online Forums

## Overview

This repository contains the source code for an LLM-based Writing Assistant for Peer-to-Peer Mental Health Support in Online Forums. The extension allows users to access a popup chat application within their browser.

## Getting Started

To use this extension, follow these steps:

1. Clone this repository locally:

   ```bash
   git clone https://github.com/Stan7s/BLASH.git
   ```

2. Navigate to the repository's root directory:

   ```bash
   cd BLASH
   ```

3. Install the required npm packages:

   ```bash
   npm install
   ```

4. Create the `secrets.api.js` file to store OpenAI API Key:

   - Create the `secrets.api.js` file located in the root directory with content as follows
   - Replace the placeholder value of GPT_API_KEY with your own API key.
   - Save the changes.
   ```
   const GPT_API_KEY = "YOUR_API_KEY";
   export { GPT_API_KEY };
   ```

5. Generate necessary files using OpenSSL `key.pem` and `cert.pem` and put them under the `utils` folder:

   ```bash
   cd utils
   openssl genrsa -out key.pem
   openssl req -new -x509 -key key.pem -out cert.pem -days 365
   ```

6. Start the development server:

   ```bash
   npm start
   ```

7. Enable developer mode in Google Chrome:

   - Open Google Chrome.
   - Navigate to `chrome://extensions/`.
   - Enable developer mode.

8. Load the extension:

   - Click on "Load unpacked".
   - Select the `build` folder from the repository.
   - The extension should now be visible in the browser toolbar under Extensions.
  
9. Use the extension:

   - Navigate to a Reddit Post related to mental health. Example: [Other people have it worse isn't very comforting](https://www.reddit.com/r/mentalhealth/comments/1b8y5s5/other_people_have_it_worse_isnt_very_comforting/)
   - Click on the extension to start interacting with the AI assistant!

## Usage

Once the extension is loaded, users can click on the extension icon in the browser toolbar to open a popup chat window. From there, users can start using the application.
