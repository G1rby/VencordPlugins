/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, findOption, sendBotMessage } from "@api/Commands";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import definePlugin from "@utils/types";

function Calculate(input) {
    const sanitizedInput = input.replace(/[^-()\d/*+.]/g, '');

    try {
        return new Function(`return ${sanitizedInput}`)();
    } catch (error) {
        return "Invalid Expression";
    }
}

export default definePlugin({
    name: "Math",
    description: "Evaluates math expressions by using <math {expression}> in a message or using the /math command.",
    authors: [
        {
            name: "G1rby",
            id: 413425284105371648n,
        },
    ],
    dependencies: ["CommandsAPI"],
    commands: [
        {
            name: "math",
            description: "",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    type: ApplicationCommandOptionType.STRING,
                    name: "equation",
                    description: "",
                    required: true,
                },
            ],
            execute: async (args, ctx) => {
                let equation = findOption<string>(args, "equation");
                // @ts-ignore
                equation = equation.replace("^", "**");
                sendBotMessage(ctx.channel.id, {
                    content: Calculate(equation).toString(),
                });
            }
        },
    ],
    async start() {
        this.preSend = addPreSendListener((channelId, msg) => {
            if (!msg.content) return;
            const regex = /<math(.*?)>/;
            const match = msg.content.match(regex);
            if (match) {
                match[1] = match[1].replace("^", "**");
                msg.content = msg.content.replace(regex, Calculate(match[1]));
            }
        });
    },

    stop() {
        removePreSendListener(this.preSend);
    },
});
