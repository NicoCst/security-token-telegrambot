const { GoPlus, ErrorCode } = require("@goplus/sdk-node");
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

let telegramBotKey = process.env["telekey"];

const bot = new TelegramBot(telegramBotKey, {polling: true});

const chainIds = {
    avax: "43114",   // Avalanche
    arb: "42161",    // Arbitrum
    bsc: "56",       // Binance Smart Chain
    eth: "1",        // Ethereum Mainnet
    ftm: "250",      // Fantom Opera
    heco: "128",     // Huobi Eco Chain
    matic: "137",    // Polygon (Matic)
    sol: "1399811149",      // Solana
    xdai: "100",     // xDai
}

bot.onText(/\/check (.+?) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const chainName = match[1].toLowerCase(); // Convertit en minuscules pour assurer la correspondance
    const tokenAddress = match[2];

    // Vérifiez si le nom de la chaîne est valide
    if (!chainIds.hasOwnProperty(chainName)) {
        bot.sendMessage(chatId, `Chaîne invalide: ${chainName}`);
        return;
    }

    const chainId = chainIds[chainName];

    let res = await GoPlus.tokenSecurity(chainId, [tokenAddress], 30);

    if (res.code !== ErrorCode.SUCCESS) {
        bot.sendMessage(chatId, `Erreur: ${res.message}`);
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

            // Holders
            let holders = tokenInfo.holders;
            let holdersMessage = "🔹 Top Holders Infos :\n";

            for (let holder of holders) {
                let address = holder.address;
                let locked = holder.locked === 1 ? "Oui" : "Non";
                let tag = holder.tag;
                let isContract = holder.is_contract === 1 ? "Oui" : "Non";
                let balance = holder.balance
                let percent = holder.percent

                holdersMessage += `Address: ${address}\n`;
                holdersMessage += `Locked: ${locked}\n`;
                holdersMessage += `Tag: ${tag}\n`;
                holdersMessage += `Is Contract: ${isContract}\n`;
                holdersMessage += `Balance: ${balance}\n`;
                holdersMessage += `Percent: ${percent}%\n`;

                if (holder.locked_detail && holder.locked_detail.length > 0) {
                    holdersMessage += "Locked Details:\n";
                    for (let lockedDetail of holder.locked_detail) {
                        let amount = lockedDetail.amount;
                        let endTime = lockedDetail.end_time;
                        let optTime = lockedDetail.opt_time;

                        holdersMessage += `  Amount Locked: ${amount}\n`;
                        holdersMessage += `  Unlock Time: ${endTime}\n`;
                        holdersMessage += `  Locked Time: ${optTime}\n`;
                        holdersMessage += ` ------------------------- `
                    }
                }

                holdersMessage += "\n";
            }

            let message =
                `
                🔹 Token Name: ${tokenName}
🔹 Token Symbol: ${tokenSymbol}
🔹 Buy Tax: ${buyTax}%
🔹 Sell Tax: ${sellTax}%
🔹 Creator Address: ${creatorAddress}
🔹 Creator % token owned: ${creatorPercent}%
🔹 Honeypot ? : ${isHoneypot ? 'Yes' : 'No'}
🔹 Can Take Back Ownership: ${canTakeBackOwnership ? 'Yes' : 'No'}
🔹 Is the tax editable: ${slippageModifiable ? 'Yes' : 'No'}
🔹 Anti-whale protection: ${isAntiWhale ? 'Yes' : 'No'}
🔹 Is Mintable ?: ${isMintable ? 'Yes' : 'No'}\n
${holdersMessage}`
            ;

            bot.sendMessage(chatId, message);
        }
    }
});