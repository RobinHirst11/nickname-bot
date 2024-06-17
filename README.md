# Discord Nickname Moderator

This Discord bot utilizes Google's Gemini AI model to automatically moderate nicknames and ensure a safe and respectful environment in your server. 

## Features

* **AI-Powered Nickname Analysis:**  Analyzes nicknames using Gemini-1.5-Pro model to assess their appropriateness.
* **Configurable Severity Threshold:** Set a custom threshold (1-5) for your server, determining the minimum severity level that triggers a nickname change.
* **Automatic Nickname Replacement:**  Automatically replaces potentially inappropriate nicknames with random usernames.
* **Slash Command (`/setseverity`):**  Easily adjust the severity threshold using a simple slash command.
* **Robust Error Handling:**  Includes error handling for potential API issues or Discord API limitations.

## Setup

1. **Create a Discord Bot:** 
    * Visit the Discord Developer Portal: https://discord.com/developers/applications
    * Create a new application.
    * Navigate to the "Bot" tab and click "Add Bot".
    * Copy the bot token (keep it secret!)

2. **Obtain Google Gemini API Key:**
    * Sign up for the Gemini API: https://aistudio.google.com/app/apikey
    * Create a new API key.

3. **Set Environment Variables:**
    * Create a `.env` file in the project root directory and add the following:
    ```
    DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
    ```

4. **Install Dependencies:**
    ```bash
    npm install
    ```

5. **Run the bot:**
    ```bash
    node index.js
    ```

6. **Invite the bot to your server:**
    * Go to your bot's application page in the Discord Developer Portal.
    * Under "OAuth2", select the "bot" scope.
    * Click "Copy" to copy the OAuth2 URL.
    * Paste the URL into a browser and authorize the bot to access your server.

## Usage

Once the bot is added to your server:

* **Set the severity threshold:** Use the `/setseverity` slash command, followed by a number between 1 and 5 (e.g., `/setseverity 4`).
* **Monitor nickname changes:** The bot automatically detects and moderates nicknames based on the set threshold.

## Configuration

* **`generationConfig` (index.js):** Adjust these parameters to fine-tune the Gemini AI model's behavior:
    * `temperature`: Controls the randomness of the model's output.
    * `topP`: Influences the probability distribution of the model's output.
    * `topK`: Limits the number of possible words the model considers at each step.
    * `maxOutputTokens`: Sets the maximum length of the model's response.

## Disclaimer

This bot is for educational purposes and may not always accurately assess the appropriateness of nicknames. It is important to review the bot's output and manually adjust its actions if necessary. 
