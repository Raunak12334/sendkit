import {
    telegramSendMessageRequestSchema,
    telegramSendMessageResponseSchema,
    telegramMessageOptionSchema,
    telegramMessageOutputSchema,
    TelegramMessageOption,
    TelegramMessageOutput
} from "./schemas";

export async function sendTelegramMessage(
    input: TelegramMessageOption,
): Promise<TelegramMessageOutput> {
    const parseInput = telegramMessageOptionSchema.parse(input);
    const requestBody = telegramSendMessageRequestSchema.parse({
        chat_id: parseInput.chatId,
        text: parseInput.message
    });

    const response = await fetch(
        `https://api.telegram.org/bot${parseInput.botToken}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: await Response.json(requestBody).text(),
        }
    );

    const data = telegramSendMessageResponseSchema.parse(await response.json());

    if (!response.ok || !data.ok || !data.result) {
        throw new Error(data.description ?? "Failed to send Telegram message");
    }

    return telegramMessageOutputSchema.parse({
        ok: true,
        chatId: parseInput.chatId,
        messageId: data.result.message_id
    })
};