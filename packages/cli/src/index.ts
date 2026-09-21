import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";


const program = new Command();

program
    .name("sendkit")
    .description("CLI tool for sendkit")
    .command("telegram")
    .description("Send a telegram message")
    .argument("<chatId>", "Telegram Chat ID")
    .argument("<message>", "Message text to send")
    .action(async (chatId: string, message: string) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.error("Missing Telegram_Bot_Token environment variable");
            process.exit(1);
        }
        if (!chatId) {
            console.error("Missing Telegram Chat ID");
            process.exit(1);
        }
        if (!message) {
            console.error("Missing Message");
            process.exit(1);
        }

        try {
            const result = await sendTelegramMessage({
                botToken: token,
                chatId,
                message,
            });

            console.log(`Telegram Message sent successfully! ${result.chatId}`);
            console.log(`Telegram Message ID: ${result.messageId}`);
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            console.error(`Failed to send Telegram message: ${detail}`);
            process.exit(1);
        }
    });

program.parseAsync(process.argv);

// https://api.telegram.org/bot8742327094:AAHGFsW_35wqZlFDSrnVjy2lRKrkK0LKzv4/getUpdates