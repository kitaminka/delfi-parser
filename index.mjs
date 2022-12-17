import Discord from 'discord.js';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';
import HTMLToText from 'html-to-text';
import 'dotenv/config'
import { createEmbed, generateMessageConfig } from './message.mjs';
import config from './config.json' assert {type: 'json'};

const webhookClient = new Discord.WebhookClient({ url: config.webhook.url });

let previousNewsIds = [];

fetch('https://rus.delfi.lv/news/novosti/', {
    method: 'GET'
}).then(res => res.text()).then((mainPage) => {
    const mainPageHTML = HTMLParser.parse(mainPage);
    const linkElements = mainPageHTML.querySelectorAll('div#ajax-headlines>div.row>div.mb-4>a');

    for (const linkElement of linkElements) {
        previousNewsIds.push(linkElement.attrs.href.split('?id=')[1]);
    }
});

setInterval(async () => {
    console.log('Parsing news...');

    const mainPage = await fetch('https://rus.delfi.lv/news/novosti/', {
        method: 'GET'
    }).then(res => res.text());

    const mainPageHTML = HTMLParser.parse(mainPage);
    const linkElements = mainPageHTML.querySelectorAll('div#ajax-headlines>div.row>div.mb-4>a');
    const imageElements = mainPageHTML.querySelectorAll('.img-fluid.w-100.lazy-img.disable-lazy');

    for (let i = 3; i >= 0; i--) {
        const linkElement = linkElements[i];
        const imageElement = imageElements[i];

        if (!previousNewsIds.includes(linkElement.attrs.href.split('?id=')[1])) {
            const newsInfo = {};

            const newsPage = await fetch(linkElement.attrs.href, {
                method: 'GET'
            }).then(res => res.text());
            const newsPageHTML = HTMLParser.parse(newsPage);
            const descriptionElement = newsPageHTML.querySelector('p.font-weight-bold');

            newsInfo.title = HTMLToText.convert(imageElement.attrs.alt, {
                wordwrap: false
            });
            newsInfo.description = HTMLToText.convert(descriptionElement.innerHTML, {
                wordwrap: false,
                selectors: [
                    {
                        selector: 'a',
                        options: {
                            ignoreHref: '*'
                        }
                    }
                ]
            });
            newsInfo.image = imageElement.attrs.src;
            newsInfo.id = linkElement.attrs.href.split('?id=')[1];
            newsInfo.link = linkElement.attrs.href;

            const messageConfig = await generateMessageConfig(config.message, newsInfo);
            const embed = await createEmbed(newsInfo, messageConfig);

            try {
                await webhookClient.send({
                    username: config.webhook.username,
                    avatarURL: config.webhook.avatar,
                    content: messageConfig.content !== '' ? messageConfig.content : null,
                    embeds:[embed]
                });
                console.log(`News sent: ${newsInfo.title}`);
            } catch {
                console.error('Error sending message. Maybe the URL of the webhook is invalid.');
            }
        }
    }
    previousNewsIds = [];
    for (const linkElement of linkElements) {
        previousNewsIds.push(linkElement.attrs.href.split('?id=')[1]);
    }
    console.log('Parsing finished!');
}, config.parsingInterval);
