const { GoPlus, ErrorCode } = require("@goplus/sdk-node");
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

let telegramBotKey = process.env["telekey"];

// Remplacez 'YOUR_TELEGRAM_BOT_TOKEN' par le token de votre bot Telegram
const bot = new TelegramBot(telegramBotKey, {polling: true});

bot.onText(/\/checkToken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const tokenAddress = match[1];

    let chainId = "43114";

    let res = await GoPlus.tokenSecurity(chainId, [tokenAddress], 30);

    if (res.code !== ErrorCode.SUCCESS) {
        bot.sendMessage(chatId, `Error: ${res.message}`);
    } else {
        for (let tokenAddress in res.result) {
            let tokenInfo = res.result[tokenAddress];

            let tokenName = tokenInfo.token_name;
            let isHoneypot = tokenInfo.is_honeypot;
            let buyTax = tokenInfo.buy_tax;
            let sellTax = tokenInfo.sell_tax;
            let creatorAddress = tokenInfo.creator_address;
            let creatorPercent = tokenInfo.creator_percent;
            let canTakeBackOwnership = tokenInfo.can_take_back_ownership;
            let isAntiWhale = tokenInfo.is_anti_whale;
            let isMintable = tokenInfo.is_mintable;

            let message = `
                Token Address: ${tokenAddress},
                Token Name: ${tokenName},
                Is Honeypot: ${isHoneypot},
                Buy Tax: ${buyTax},
                Sell Tax: ${sellTax},
                Creator Address: ${creatorAddress},
                Creator Percent: ${creatorPercent},
                Can Take Back Ownership: ${canTakeBackOwnership},
                Is Anti-Whale: ${isAntiWhale},
                Is Mintable: ${isMintable}
            `;

            bot.sendMessage(chatId, message);
        }
    }
});

