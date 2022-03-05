import config from './config.json' assert { type: 'json' };
import { MessageEmbed } from 'discord.js';

async function buildEmbed(newsInfo) {
    const embedConfig = config.embed;

    for (let embedConfigKey in embedConfig) {
        embedConfig[embedConfigKey].replaceAll('', '')
    }

    const embed = new MessageEmbed()
        .setTitle(embedConfig.title.text)
        .setURL(embedConfig.title.url)
        .setAuthor({
            name: embedConfig.author.name,
            iconURL: embedConfig.author.iconUrl,
            url: embedConfig.author.url
        })
        .setColor(embedConfig.color)
        .setThumbnail(embedConfig.thumbnail)
        .setImage(embedConfig.imageUrl)
        .setFooter({
            text: embedConfig.footer.text,
            iconURL: embedConfig.footer.iconUrl
        });

    if (embedConfig.timestamp) embed.setTimestamp();
    if (embedConfig.description) embed.setDescription(embedConfig.description);
    else embed.setDescription(newsInfo.description);

    return embed
}

export { buildEmbed }