import { EmbedBuilder } from 'discord.js';

async function createEmbed(newsInfo, messageConfig) {
    const embed = new EmbedBuilder();

    if (messageConfig.description !== '') embed.setDescription(messageConfig.description);
    else embed.setDescription(newsInfo.description);

    if (messageConfig.color !== '') embed.setColor(messageConfig.color);
    if (messageConfig.title.text !== '') embed.setTitle(messageConfig.title.text);
    if (messageConfig.title.url !== '') embed.setURL(messageConfig.title.url);
    if (messageConfig.author.name !== '') embed.setAuthor({
        name: messageConfig.author.name,
        iconURL: messageConfig.author.icon,
        url: messageConfig.author.url
    });
    if (messageConfig.thumbnail !== '') embed.setThumbnail(messageConfig.thumbnail);
    if (messageConfig.image !== '') embed.setImage(messageConfig.image);
    if (messageConfig.footer.text !== '') embed.setFooter({
        text: messageConfig.footer.text,
        iconURL: messageConfig.footer.icon
    });

    if (messageConfig.timestamp) embed.setTimestamp();

    return embed;
}

async function generateMessageConfig(messageConfig, newsInfo) {
    const messageConfigString = JSON.stringify(messageConfig);

    return JSON.parse(messageConfigString
        .replaceAll('{{title}}', newsInfo.title.replaceAll('"', '\\"'))
        .replaceAll('{{description}}', newsInfo.description.replaceAll('"', '\\"'))
        .replaceAll('{{image}}', newsInfo.image.replaceAll('"', '\\"'))
        .replaceAll('{{link}}', newsInfo.link.replaceAll('"', '\\"'))
    );
}

export { createEmbed, generateMessageConfig }
