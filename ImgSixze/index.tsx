/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";
import definePlugin from "@utils/types";
import { addAccessory } from "@api/MessageAccessories";
import { classNameFactory } from "@api/Styles";
import { Message } from "discord-types/general";

export const cl = classNameFactory("vc-imgsize-");

export function ImgSizeAccessory({ message }: { message: Message; }) {
    if (message.attachments.length == 1) {
        let attachment = message.attachments[0];
        const regex = /^image\/(.*?)$/;
        if (regex.test(attachment.content_type ?? "")) {
            return (
                <span className={cl("accessory")}>
                    {attachment.filename} - {attachment.width}x{attachment.height}px
                </span>
            );
        }
    } else if (message.embeds.length == 1 && message.embeds[0].type == "image") {
        let embed = message.embeds[0];

        return (
            <span className={cl("accessory")}>
                {embed.image?.url.split("?")[0].split("/").slice(-1)} - {embed.image?.width}x{embed.image?.height}px
            </span>
        );
    }
    return null;
}

export default definePlugin({
    name: "ImgSize",
    description: "ImgSize uwu",
    authors: [
        {
            name: "G1rby",
            id: 413425284105371648n
        }
    ],
    start() {
        addAccessory("vc-imgsize", props => <ImgSizeAccessory message={props.message} />);
    }
});
