import { MessageEmbed } from 'discord.js';

async function createEmbed(newsInfo, messageConfig) {
    const embed = new MessageEmbed()
        .setTitle(messageConfig.title.text)
        .setURL(messageConfig.title.url)
        .setAuthor({
            name: messageConfig.author.name,
            iconURL: messageConfig.author.icon,
            url: messageConfig.author.url
        })
        .setThumbnail(messageConfig.thumbnail)
        .setImage(messageConfig.image)
        .setFooter({
            text: messageConfig.footer.text,
            iconURL: messageConfig.footer.icon
        });

    if (messageConfig.description !== '') embed.setDescription(messageConfig.description);
    else embed.setDescription(newsInfo.description);

    if (messageConfig.color !== '') embed.setColor(messageConfig.color);

    if (messageConfig.timestamp) embed.setTimestamp();

    return embed
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