/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, findOption, sendBotMessage } from "@api/Commands";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "Math",
    description: "The Mather.",
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
                const equation = findOption<string>(args, "equation");
                sendBotMessage(ctx.channel.id, {
                    //@ts-ignore
                    content: eval(equation),
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

                msg.content = msg.content.replace(regex, eval(match[1]));
            }
        });
    },

    stop() {
        removePreSendListener(this.preSend);
    },
});
