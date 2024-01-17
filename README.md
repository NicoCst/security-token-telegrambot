# Token Security Checker for Telegram

Description
This project is a simple Telegram bot that checks the security of a given token on various blockchains. It uses the GoPlus API to gather information about the token, such as its honeypot status, buy and sell taxes, creator address, creator ownership percentage, anti-whale protection, and mintable status. It also provides information about the top token holders.

Usage
To use the bot, simply send a message in the following format to your Telegram bot:

/check [blockchain name] [token address]
For example, to check the security of the USDC token on the Ethereum blockchain, you would send the following message:

/check eth 0x22f6592c0b1b3bbc75c822c32d916ab305327e0f
The bot will then respond with a message containing information about the token, such as:

Token name
Token symbol
Honeypot status
Buy and sell taxes
Creator address
Creator ownership percentage
Anti-whale protection
Mintable status
Top token holders
Technologies Used
GoPlus API
Node.js
Telegram Bot API
Installation
To install the project, first clone the repository:

git clone https://github.com/[your-username]/token-security-checker.git
Then, install the dependencies:

cd token-security-checker
npm install
Running the Bot
To run the bot, you will need to set up a Telegram bot and get your bot token. Once you have your bot token, you can run the bot with the following command:

NODE_ENV=production node index.js
This will start the bot listening for messages. You can then send messages to your bot with the /check command to check the security of tokens.

Contributing
If you have any suggestions for improvements or bug fixes, please feel free to open an issue on GitHub.

License
This project is licensed under the MIT License.