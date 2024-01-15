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
            let tokenSymbol = tokenInfo.token_symbol;

            // Honeypot ?
            let isHoneypot = tokenInfo.is_honeypot;
            if (isHoneypot == 1){
                isHoneypot = "Oui"
            } else if (isHoneypot == 0){
                isHoneypot = "Non"
            } else {
                isHoneypot = "Impossible d'avoir l'info"
            }

            let buyTax = tokenInfo.buy_tax * 100;
            let sellTax = tokenInfo.sell_tax * 100;
            let creatorAddress = tokenInfo.creator_address;
            let creatorPercent = tokenInfo.creator_percent;

            //Take back Ownership ?
            let canTakeBackOwnership = tokenInfo.can_take_back_ownership;
            if (canTakeBackOwnership == 1){
                canTakeBackOwnership = "Oui"
            } else if (canTakeBackOwnership == 0){
                canTakeBackOwnership = "Non"
            } else {
                canTakeBackOwnership = "Impossible d'avoir l'info"
            }

            // Slippage is modifiable ?
            let slippageModifiable = tokenInfo.slippage_modifiable;
            if (slippageModifiable == 1){
                slippageModifiable = "Oui"
            } else if (slippageModifiable == 0){
                slippageModifiable = "Non"
            } else {
                slippageModifiable = "Impossible d'avoir l'info"
            }

            // AntiWhale ?
            let isAntiWhale = tokenInfo.is_anti_whale;
            if (isAntiWhale == 1){
                isAntiWhale = "Oui"
            } else if (isAntiWhale == 0){
                isAntiWhale = "Non"
            } else {
                isAntiWhale = "Impossible d'avoir l'info"
            }

            // Mintable ?
            let isMintable = tokenInfo.is_mintable;
            if (isMintable == 1){
                isMintable = "Oui"
            } else if (isMintable == 0){
                isMintable = "Non"
            } else {
                isMintable = "Impossible d'avoir l'info"
            }

            let message =
                `
                Token Name: ${tokenName}
                Token Symbol: ${tokenSymbol}
                Honeypot ? : ${isHoneypot}
                Buy Tax: ${buyTax}%
                Sell Tax: ${sellTax}%
                Creator Address: ${creatorAddress}
                Creator % token owned: ${creatorPercent}%
                Can Take Back Ownership: ${canTakeBackOwnership}
                Is the tax editable: ${slippageModifiable}
                Protection anti-whale: ${isAntiWhale}
                Is Mintable ?: ${isMintable}
                `
            ;

            bot.sendMessage(chatId, message);
        }
    }
});

